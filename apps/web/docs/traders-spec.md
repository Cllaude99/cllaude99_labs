# Traders - 상세 스펙 문서

## 목차

1. [기술스택 (Tech Stack)](#1-기술스택-tech-stack)
2. [데이터베이스 스키마](#2-데이터베이스-스키마)
3. [API 경로](#3-api-경로)
4. [구현 기능과 구현 방법](#4-구현-기능과-구현-방법)
5. [기간별 끝내야하는 작업](#5-기간별-끝내야하는-작업)

---

## 1. 기술스택 (Tech Stack)

### Frontend

| 카테고리 | 기술 | 버전 | 용도 |
|---------|------|------|------|
| 프레임워크 | React | 18.2 | UI 라이브러리 |
| 언어 | TypeScript | 5.0 | 타입 안전성 |
| 빌드 도구 | Vite | 4.0 | 개발 서버 및 번들링 |
| 스타일링 | Emotion | 11.11 | CSS-in-JS |
| 상태 관리 (클라이언트) | Zustand | 4.4 | 게임 상태, 포트폴리오 관리 |
| 상태 관리 (서버) | TanStack Query | 5.0 | 서버 데이터 캐싱, 낙관적 업데이트 |
| 차트 | Lightweight Charts | 4.x | TradingView 공식 차트 라이브러리 |
| 실시간 통신 | Supabase JS SDK | 2.x | Realtime, Auth, DB 연동 |
| 애니메이션 | Motion (Framer Motion) | 10.0 | 종목 공개, 전환 애니메이션 |
| 라우팅 | React Router DOM | 7.x | SPA 라우팅 |
| 폼 관리 | React Hook Form | 7.x | 매수/매도 폼 유효성 검증 |

### Backend (Supabase BaaS)

| 서비스 | 용도 |
|--------|------|
| PostgreSQL 15 | 주 데이터베이스 (종목, 가격, 게임 세션, 거래 내역) |
| Auth | 소셜 로그인 (Google, Kakao OAuth), 익명 로그인 |
| Realtime | WebSocket 기반 게임 이벤트 동기화 (거래 확인, 결산 알림) |
| Edge Functions | Deno 기반 서버리스 API (거래 처리, 게임 로직) |
| Storage | 뉴스 이미지, 차트 캐시 저장 |

### 데이터 소스

| 소스 | 용도 |
|------|------|
| Yahoo Finance API | 2010-2024년 일별 OHLCV 데이터 수집 (티커 형식: `005930.KS`) |
| Edge Function (`seed-stock-data`) | Yahoo Finance API fetch → DB 적재 자동화 |

> **참고**: Python/FinanceDataReader 없이 Supabase Edge Function에서 직접 Yahoo Finance API를 호출하여 데이터를 수집합니다. 외부 의존성 없이 Supabase 생태계 안에서 완결됩니다.

### DevOps

| 도구 | 용도 |
|------|------|
| Vercel | 프론트엔드 자동 배포 |
| Sentry | 런타임 에러 추적 |
| Playwright | E2E 테스트 |
| Jest | 단위 테스트 |

### 기존 패키지 재사용

| 패키지 | 용도 |
|--------|------|
| `@cllaude99/ui` | 공용 UI 컴포넌트 (Button, Modal, Input 등) |
| `@cllaude99/apis` | API 유틸리티, React Query 설정, HTTP 인터셉터 |
| `@cllaude99/icon` | SVG 아이콘 컴포넌트 라이브러리 |

---

## 2. 데이터베이스 스키마

### ERD 개요

```
user_profiles ──┬── game_sessions ──┬── portfolio_holdings
                │                   ├── trade_history
                │                   └── yearly_settlements
                ├── user_hint_unlocks
                ├── user_quiz_answers
                └── rankings

stocks ──┬── stock_secrets (관리자 전용: real_name, ticker)
         └── stock_daily_prices

quizzes (연도별 퀴즈)
hints (연도별 힌트)
blur_events (블러 차트 이벤트)
```

### 2.1 `stocks` - 종목 마스터 (공개 정보)

게임 중 클라이언트에 노출되는 공개 정보만 저장합니다. `real_name`, `ticker`는 별도 테이블(`stock_secrets`)에 분리하여 보안을 유지합니다.

```sql
CREATE TABLE stocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alias_code VARCHAR(2) NOT NULL UNIQUE,       -- 'A', 'B', 'C' ... 'J'
  category VARCHAR(50) NOT NULL,                -- 카테고리 (IT, 엔터, 바이오 등)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_stocks_alias_code ON stocks(alias_code);
CREATE INDEX idx_stocks_category ON stocks(category);
```

### 2.1.1 `stock_secrets` - 종목 비공개 정보 (관리자 전용)

실제 종목명과 티커를 저장합니다. 클라이언트에서 직접 조회할 수 없으며, Edge Function(service_role)에서만 접근합니다. 게임 완료 시에만 Edge Function이 `real_name`을 응답에 포함합니다.

```sql
CREATE TABLE stock_secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_id UUID NOT NULL REFERENCES stocks(id) ON DELETE CASCADE UNIQUE,
  real_name VARCHAR(100) NOT NULL,              -- 실제 종목명 (삼성전자 등)
  ticker VARCHAR(20) NOT NULL UNIQUE,           -- 종목 코드 (005930 등)
  description TEXT,                             -- 종목 설명 (게임 종료 후 공개)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_stock_secrets_stock ON stock_secrets(stock_id);
```

### 2.2 `stock_daily_prices` - 일별 OHLCV 데이터

2010-2024년 일별 시세 데이터를 저장합니다.

```sql
CREATE TABLE stock_daily_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_id UUID NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
  date DATE NOT NULL,                           -- 거래일
  open NUMERIC(12, 2) NOT NULL,                 -- 시가
  high NUMERIC(12, 2) NOT NULL,                 -- 고가
  low NUMERIC(12, 2) NOT NULL,                  -- 저가
  close NUMERIC(12, 2) NOT NULL,                -- 종가
  volume BIGINT NOT NULL DEFAULT 0,             -- 거래량
  change_rate NUMERIC(8, 4),                    -- 등락률 (%)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(stock_id, date)
);

-- 인덱스 (연도별 주가 조회 최적화)
CREATE INDEX idx_stock_daily_prices_stock_date ON stock_daily_prices(stock_id, date);
CREATE INDEX idx_stock_daily_prices_date ON stock_daily_prices(date);
```

### 2.3 `game_sessions` - 게임 세션

각 사용자의 게임 진행 상태를 관리합니다.

```sql
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_year INT NOT NULL DEFAULT 2010,       -- 현재 진행 연도 (2010-2024)
  current_month INT NOT NULL DEFAULT 1,         -- 현재 월 (1-12)
  cash_balance NUMERIC(15, 2) NOT NULL DEFAULT 10000000, -- 현금 잔고 (초기 1000만원)
  total_asset NUMERIC(15, 2) NOT NULL DEFAULT 10000000,  -- 총자산 (현금 + 주식 평가액)
  status VARCHAR(20) NOT NULL DEFAULT 'playing' -- 'playing' | 'settling' | 'completed' | 'abandoned'
    CHECK (status IN ('playing', 'settling', 'completed', 'abandoned')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_status ON game_sessions(status);
```

### 2.4 `portfolio_holdings` - 보유 종목

현재 보유 중인 종목과 수량을 관리합니다.

```sql
CREATE TABLE portfolio_holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  stock_id UUID NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 0,              -- 보유 수량
  avg_buy_price NUMERIC(12, 2) NOT NULL,        -- 평균 매수가
  total_invested NUMERIC(15, 2) NOT NULL,       -- 총 투자 금액
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(session_id, stock_id)
);

-- 인덱스
CREATE INDEX idx_portfolio_holdings_session ON portfolio_holdings(session_id);
```

### 2.5 `trade_history` - 거래 내역

모든 매수/매도 거래를 기록합니다.

```sql
CREATE TABLE trade_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  stock_id UUID NOT NULL REFERENCES stocks(id) ON DELETE CASCADE,
  trade_type VARCHAR(4) NOT NULL                -- 'buy' | 'sell'
    CHECK (trade_type IN ('buy', 'sell')),
  quantity INT NOT NULL,                        -- 거래 수량
  price NUMERIC(12, 2) NOT NULL,                -- 거래 단가
  total_amount NUMERIC(15, 2) NOT NULL,         -- 총 거래 금액 (quantity * price)
  trade_year INT NOT NULL,                      -- 거래 연도
  trade_month INT NOT NULL,                     -- 거래 월
  trade_date DATE NOT NULL,                     -- 거래일
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_trade_history_session ON trade_history(session_id);
CREATE INDEX idx_trade_history_session_year ON trade_history(session_id, trade_year);
```

### 2.6 `yearly_settlements` - 연도별 결산

매년 12월 31일 결산 결과를 기록합니다.

```sql
CREATE TABLE yearly_settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  year INT NOT NULL,                            -- 결산 연도
  starting_asset NUMERIC(15, 2) NOT NULL,       -- 연초 시작 자산
  ending_asset NUMERIC(15, 2) NOT NULL,         -- 연말 최종 자산
  return_rate NUMERIC(8, 4) NOT NULL,           -- 수익률 (%)
  total_trades INT NOT NULL DEFAULT 0,          -- 총 거래 횟수
  settled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(session_id, year)
);

-- 인덱스
CREATE INDEX idx_yearly_settlements_session ON yearly_settlements(session_id);
```

### 2.7 `quizzes` - 퀴즈 문제

연도별 경제 퀴즈 문제를 저장합니다.

```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INT NOT NULL,                            -- 퀴즈 대상 연도 (2010-2024)
  question_number INT NOT NULL,                 -- 문제 번호 (1, 2, 3)
  question TEXT NOT NULL,                       -- 퀴즈 질문
  options JSONB NOT NULL,                       -- 선택지 배열 ["A안", "B안", "C안", "D안"]
  correct_option INT NOT NULL,                  -- 정답 인덱스 (0-3)
  explanation TEXT,                             -- 해설
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(year, question_number)
);

-- 인덱스
CREATE INDEX idx_quizzes_year ON quizzes(year);
```

### 2.8 `hints` - 힌트 데이터

연도별 레벨 1, 레벨 2 힌트 정보를 저장합니다.

```sql
CREATE TABLE hints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INT NOT NULL,                            -- 힌트 대상 연도 (2010-2024)
  level INT NOT NULL                            -- 힌트 레벨 (1 또는 2)
    CHECK (level IN (1, 2)),
  content TEXT NOT NULL,                        -- 힌트 내용
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(year, level)
);

-- 인덱스
CREATE INDEX idx_hints_year ON hints(year);
```

### 2.9 `blur_events` - 블러 차트 이벤트

2년마다 발생하는 블러 차트 이벤트 정보를 저장합니다.

```sql
CREATE TABLE blur_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INT NOT NULL UNIQUE,                     -- 이벤트 연도 (2012, 2014, 2016, 2018, 2020, 2022, 2024)
  description TEXT NOT NULL,                    -- 이벤트 설명
  preview_months INT[] NOT NULL,                -- 미리보기 대상 월 배열 (3개월, 예: {3,4,5})
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_blur_events_year ON blur_events(year);
```

### 2.10 `user_hint_unlocks` - 사용자별 힌트 해금 기록

```sql
CREATE TABLE user_hint_unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  hint_id UUID NOT NULL REFERENCES hints(id) ON DELETE CASCADE,
  unlock_method VARCHAR(10) NOT NULL            -- 'quiz' | 'ad'
    CHECK (unlock_method IN ('quiz', 'ad')),
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(session_id, hint_id)
);

-- 인덱스
CREATE INDEX idx_user_hint_unlocks_session ON user_hint_unlocks(session_id);
```

### 2.11 `user_quiz_answers` - 사용자별 퀴즈 답변 기록

```sql
CREATE TABLE user_quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  selected_option INT NOT NULL,                 -- 선택한 답 인덱스 (0-3)
  is_correct BOOLEAN NOT NULL,                  -- 정답 여부
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(session_id, quiz_id)
);

-- 인덱스
CREATE INDEX idx_user_quiz_answers_session ON user_quiz_answers(session_id);
```

### 2.12 `rankings` - 최종 랭킹

게임 완료 후 최종 랭킹을 저장합니다.

```sql
CREATE TABLE rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  nickname VARCHAR(50) NOT NULL,
  final_asset NUMERIC(15, 2) NOT NULL,          -- 최종 자산
  total_return_rate NUMERIC(8, 4) NOT NULL,     -- 총 수익률 (%)
  total_trades INT NOT NULL DEFAULT 0,          -- 총 거래 횟수
  rank_position INT,                            -- 순위 (집계 시 갱신)
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(session_id)
);

-- 인덱스
CREATE INDEX idx_rankings_final_asset ON rankings(final_asset DESC);
CREATE INDEX idx_rankings_user ON rankings(user_id);
```

### 2.13 `user_profiles` - 사용자 프로필

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  nickname VARCHAR(50) NOT NULL,
  avatar_url TEXT,
  provider VARCHAR(20),                         -- 'google' | 'kakao' | 'anonymous'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_user_profiles_user ON user_profiles(user_id);
CREATE UNIQUE INDEX idx_user_profiles_nickname ON user_profiles(nickname);
```

### RLS (Row Level Security) 정책

모든 테이블에 RLS를 활성화하고, 사용자별로 자신의 데이터만 접근하도록 제한합니다.

```sql
-- 모든 테이블에 RLS 활성화
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE yearly_settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_hint_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- game_sessions: 본인 세션만 CRUD
CREATE POLICY "Users can manage own sessions"
  ON game_sessions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- portfolio_holdings: 본인 세션의 포트폴리오만 조회/수정
CREATE POLICY "Users can manage own portfolio"
  ON portfolio_holdings FOR ALL
  USING (session_id IN (SELECT id FROM game_sessions WHERE user_id = auth.uid()))
  WITH CHECK (session_id IN (SELECT id FROM game_sessions WHERE user_id = auth.uid()));

-- trade_history: 본인 세션의 거래 내역만 조회/추가
CREATE POLICY "Users can manage own trades"
  ON trade_history FOR ALL
  USING (session_id IN (SELECT id FROM game_sessions WHERE user_id = auth.uid()))
  WITH CHECK (session_id IN (SELECT id FROM game_sessions WHERE user_id = auth.uid()));

-- yearly_settlements: 본인 세션의 결산만 조회
CREATE POLICY "Users can view own settlements"
  ON yearly_settlements FOR SELECT
  USING (session_id IN (SELECT id FROM game_sessions WHERE user_id = auth.uid()));

-- user_hint_unlocks: 본인 세션의 힌트만 조회/추가
CREATE POLICY "Users can manage own hint unlocks"
  ON user_hint_unlocks FOR ALL
  USING (session_id IN (SELECT id FROM game_sessions WHERE user_id = auth.uid()))
  WITH CHECK (session_id IN (SELECT id FROM game_sessions WHERE user_id = auth.uid()));

-- user_quiz_answers: 본인 세션의 퀴즈 답변만 조회/추가
CREATE POLICY "Users can manage own quiz answers"
  ON user_quiz_answers FOR ALL
  USING (session_id IN (SELECT id FROM game_sessions WHERE user_id = auth.uid()))
  WITH CHECK (session_id IN (SELECT id FROM game_sessions WHERE user_id = auth.uid()));

-- rankings: 전체 공개 조회, 본인만 추가
CREATE POLICY "Anyone can view rankings"
  ON rankings FOR SELECT USING (true);

CREATE POLICY "Users can insert own ranking"
  ON rankings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- user_profiles: 전체 공개 조회, 본인만 수정
CREATE POLICY "Anyone can view profiles"
  ON user_profiles FOR SELECT USING (true);

CREATE POLICY "Users can manage own profile"
  ON user_profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- stocks: 공개 정보만 포함하므로 읽기 전용 공개
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read stocks" ON stocks FOR SELECT USING (true);

-- stock_secrets: 클라이언트 직접 접근 차단 (Edge Function의 service_role만 접근)
ALTER TABLE stock_secrets ENABLE ROW LEVEL SECURITY;
-- RLS 정책 없음 = 클라이언트에서 SELECT 불가. service_role 키를 사용하는 Edge Function만 접근 가능.

-- stock_daily_prices, quizzes, hints, blur_events: 읽기 전용 공개
ALTER TABLE stock_daily_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE hints ENABLE ROW LEVEL SECURITY;
ALTER TABLE blur_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read stock prices" ON stock_daily_prices FOR SELECT USING (true);
CREATE POLICY "Anyone can read quizzes" ON quizzes FOR SELECT USING (true);
CREATE POLICY "Anyone can read hints" ON hints FOR SELECT USING (true);
CREATE POLICY "Anyone can read blur events" ON blur_events FOR SELECT USING (true);
```

---

## 3. API 경로

모든 API는 Supabase Edge Functions로 구현합니다. 기본 URL 형식: `https://<project-ref>.supabase.co/functions/v1/<function-name>`

### 3.1 인증

Supabase Auth를 직접 사용하며, 별도 Edge Function 없이 클라이언트 SDK로 처리합니다.

#### Google OAuth 로그인

```typescript
// 클라이언트 SDK 호출
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${window.location.origin}/auth/callback` }
});
```

#### Kakao OAuth 로그인

```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'kakao',
  options: { redirectTo: `${window.location.origin}/auth/callback` }
});
```

#### 익명 로그인

```typescript
const { data, error } = await supabase.auth.signInAnonymously();
```

#### 로그아웃

```typescript
const { error } = await supabase.auth.signOut();
```

---

### 3.2 게임 관리

#### `POST /game-create` - 새 게임 세션 생성

새로운 게임을 시작하고 초기 상태를 설정합니다.

**Request**

```typescript
// Headers
Authorization: Bearer <access_token>
Content-Type: application/json

// Body (없음 - 인증 토큰에서 user_id 추출)
{}
```

**Response (201 Created)**

```typescript
{
  session_id: string;           // 생성된 세션 UUID
  current_year: 2010;
  current_month: 1;
  cash_balance: 10000000;       // 초기 시드머니 1000만원
  total_asset: 10000000;
  status: 'playing';
  stocks: Array<{               // 10개 익명 종목 목록
    stock_id: string;
    alias_code: string;         // 'A', 'B', ... 'J'
    category: string;           // '엔터', 'IT', '바이오' 등
  }>;
}
```

**에러 응답**

| 상태 코드 | 설명 |
|-----------|------|
| 401 | 인증 실패 |
| 409 | 이미 진행 중인 게임 세션이 존재 |

---

#### `GET /game-state?session_id={session_id}` - 게임 상태 조회

현재 게임 세션의 전체 상태를 조회합니다.

**Request**

```typescript
// Headers
Authorization: Bearer <access_token>

// Query Params
session_id: string;             // 게임 세션 UUID
```

**Response (200 OK)**

```typescript
{
  session: {
    id: string;
    current_year: number;
    current_month: number;
    cash_balance: number;
    total_asset: number;
    status: 'playing' | 'settling' | 'completed' | 'abandoned';
  };
  portfolio: Array<{
    stock_id: string;
    alias_code: string;
    category: string;
    quantity: number;
    avg_buy_price: number;
    total_invested: number;
    current_price: number;       // 현재 시점의 종가
    unrealized_pnl: number;      // 미실현 손익
    return_rate: number;         // 수익률 (%)
  }>;
  unlocked_hints: Array<{
    year: number;
    level: number;
    content: string;
  }>;
}
```

**에러 응답**

| 상태 코드 | 설명 |
|-----------|------|
| 401 | 인증 실패 |
| 403 | 본인의 세션이 아님 |
| 404 | 세션을 찾을 수 없음 |

---

#### `POST /game-advance-year` - 다음 연도로 이동

12월 결산 후 다음 연도로 이동합니다. 보유 주식을 연말 종가로 자동 매도하고 결산 기록을 생성합니다.

**Request**

```typescript
// Headers
Authorization: Bearer <access_token>
Content-Type: application/json

// Body
{
  session_id: string;
}
```

**Response (200 OK)**

```typescript
{
  settlement: {
    year: number;               // 결산 완료된 연도
    starting_asset: number;
    ending_asset: number;
    return_rate: number;
    total_trades: number;
  };
  next_year: {
    year: number;               // 새로 시작하는 연도
    cash_balance: number;       // 이월된 자산 = 전년도 ending_asset
  };
  is_game_completed: boolean;   // 2024년 결산 시 true
}
```

**처리 로직**

1. 현재 보유 주식 전량을 해당 연도 12월 마지막 거래일 종가로 자동 매도
2. `yearly_settlements` 테이블에 결산 기록 저장
3. `portfolio_holdings` 테이블의 해당 세션 보유 종목 초기화
4. `game_sessions` 테이블의 `current_year` + 1, `current_month` = 1, `cash_balance` = ending_asset
5. 2024년 결산 시 `status` = 'completed'로 변경 및 `rankings` 테이블에 기록

**에러 응답**

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 아직 12월이 아님 |
| 401 | 인증 실패 |
| 404 | 세션을 찾을 수 없음 |

---

#### `POST /game-abandon` - 게임 포기

진행 중인 게임을 포기합니다.

**Request**

```typescript
// Headers
Authorization: Bearer <access_token>
Content-Type: application/json

// Body
{
  session_id: string;
}
```

**Response (200 OK)**

```typescript
{
  session_id: string;
  status: 'abandoned';
  abandoned_at: string;         // ISO 8601 타임스탬프
}
```

**에러 응답**

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 이미 완료/포기된 게임 |
| 401 | 인증 실패 |
| 404 | 세션을 찾을 수 없음 |

---

### 3.3 매매

#### `POST /trade-execute` - 매수/매도 실행

주식을 매수하거나 매도합니다.

**Request**

```typescript
// Headers
Authorization: Bearer <access_token>
Content-Type: application/json

// Body
{
  session_id: string;
  stock_id: string;
  trade_type: 'buy' | 'sell';
  quantity: number;             // 매수/매도 수량
}
```

**Response (200 OK)**

```typescript
{
  trade: {
    id: string;
    stock_id: string;
    alias_code: string;
    trade_type: 'buy' | 'sell';
    quantity: number;
    price: number;              // 체결 단가 (현재 재생 시점의 가격)
    total_amount: number;
  };
  updated_balance: {
    cash_balance: number;       // 거래 후 현금 잔고
    total_asset: number;        // 거래 후 총자산
  };
  updated_holding: {            // 해당 종목의 업데이트된 보유 정보
    stock_id: string;
    quantity: number;
    avg_buy_price: number;
  } | null;                     // 전량 매도 시 null
}
```

**매수 처리 로직**

1. `quantity * current_price <= cash_balance` 검증
2. `trade_history` INSERT
3. `portfolio_holdings` UPSERT (기존 보유 시 평균 매수가 재계산)
4. `game_sessions.cash_balance` 차감

**매도 처리 로직**

1. `quantity <= current_holding.quantity` 검증
2. `trade_history` INSERT
3. `portfolio_holdings` UPDATE (전량 매도 시 DELETE)
4. `game_sessions.cash_balance` 증가

**에러 응답**

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 잔액 부족 / 보유 수량 부족 / 유효하지 않은 수량 |
| 401 | 인증 실패 |
| 404 | 세션 또는 종목을 찾을 수 없음 |
| 409 | 현재 재생이 일시정지 상태 (거래 불가) |

---

### 3.4 데이터 시딩 (관리용)

#### `POST /seed-stock-data` - 주식 데이터 수집 및 적재

Yahoo Finance API에서 **1개 종목**의 2010-2024년 일별 OHLCV 데이터를 수집하여 DB에 적재합니다. Edge Function 타임아웃(60초)을 고려하여 **종목 단위로 분리 호출**하며, 10개 종목을 순차적으로 실행합니다.

**Request**

```typescript
// Headers
Authorization: Bearer <access_token>  // 관리자 권한 필요
Content-Type: application/json

// Body
{
  ticker: string;                 // Yahoo Finance 티커 (예: '005930.KS')
  alias_code: string;             // 'A' ~ 'J'
  real_name: string;              // '삼성전자'
  category: string;               // 'IT'
  start_date: string;             // '2010-01-01'
  end_date: string;               // '2024-12-31'
}
```

**Response (200 OK)**

```typescript
{
  result: {
    stock_id: string;             // 생성된 종목 UUID
    alias_code: string;
    rows_inserted: number;        // 적재된 데이터 행 수
    date_range: {
      first: string;              // 최초 거래일
      last: string;               // 마지막 거래일
    };
  };
}
```

**처리 로직**

1. `stocks` 테이블에 종목 공개 정보 INSERT (alias_code, category)
2. `stock_secrets` 테이블에 비공개 정보 INSERT (real_name, ticker)
3. Yahoo Finance API 호출 (`https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?period1={start}&period2={end}&interval=1d`)
4. 응답에서 OHLCV 데이터 파싱 → `stock_daily_prices` 테이블에 배치 INSERT
5. 적재 완료 후 데이터 건수 반환

**호출 예시 (10개 종목 순차 실행)**

```bash
# MCP deploy_edge_function으로 배포 후, 종목별 순차 호출
POST /seed-stock-data { ticker: '005930.KS', alias_code: 'A', real_name: '삼성전자', category: 'IT', ... }
POST /seed-stock-data { ticker: '035720.KS', alias_code: 'B', real_name: '카카오', category: 'IT', ... }
# ... 10개 종목 반복
```

**에러 응답**

| 상태 코드 | 설명 |
|-----------|------|
| 401 | 인증 실패 |
| 403 | 관리자 권한 없음 |
| 409 | 해당 alias_code가 이미 적재되어 있음 |
| 502 | Yahoo Finance API 호출 실패 |

> **참고**: 이 Edge Function은 `verify_jwt: true`로 배포하되, 함수 내부에서 관리자 권한을 추가 검증합니다. 데이터 적재 후에는 비활성화하거나 삭제해도 무방합니다.

---

### 3.5 주식 데이터

#### `GET /stock-prices?session_id={session_id}&year={year}` - 연도별 주가 조회

특정 연도의 전 종목 일별 종가 데이터를 조회합니다.

**Request**

```typescript
// Headers
Authorization: Bearer <access_token>

// Query Params
session_id: string;
year: number;                   // 2010-2024
```

**Response (200 OK)**

```typescript
{
  year: number;
  stocks: Array<{
    stock_id: string;
    alias_code: string;
    category: string;
    prices: Array<{
      date: string;             // 'YYYY-MM-DD'
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
      change_rate: number;
    }>;
  }>;
}
```

---

#### `GET /stock-history?session_id={session_id}&stock_id={stock_id}` - 종목 과거 데이터 조회

특정 종목의 게임 시작부터 현재 연도까지의 월별 종가 데이터를 조회합니다.

**Request**

```typescript
// Headers
Authorization: Bearer <access_token>

// Query Params
session_id: string;
stock_id: string;
```

**Response (200 OK)**

```typescript
{
  stock_id: string;
  alias_code: string;
  category: string;
  monthly_prices: Array<{
    year: number;
    month: number;
    close: number;              // 월말 종가
    change_rate: number;        // 월간 등락률 (%)
  }>;
}
```

---

#### `GET /stock-blur-preview?session_id={session_id}&year={year}` - 블러 차트 데이터 조회

블러 차트용 해당 연도의 **3개월 구간** 가격 데이터를 조회합니다. `blur_events` 테이블의 `preview_months`에 지정된 3개월 구간의 일별 종가만 반환하며, 블러 차트를 해금한 경우에만 데이터를 제공합니다.

**Request**

```typescript
// Headers
Authorization: Bearer <access_token>

// Query Params
session_id: string;
year: number;                   // 블러 이벤트 연도 (2012, 2014, 2016, 2018, 2020, 2022, 2024)
```

**Response (200 OK)**

```typescript
{
  year: number;
  is_unlocked: boolean;
  preview_months: number[];       // 미리보기 대상 월 (예: [3, 4, 5])
  description: string;            // 이벤트 설명
  preview_data: Array<{           // is_unlocked = true일 때만 데이터 포함
    stock_id: string;
    alias_code: string;
    daily_closes: Array<{         // 3개월 구간의 일별 종가
      date: string;               // 'YYYY-MM-DD'
      close: number;
    }>;
  }> | null;
}
```

**에러 응답**

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 블러 이벤트가 아닌 연도 |
| 401 | 인증 실패 |
| 403 | 블러 차트 미해금 상태 |
| 404 | 세션을 찾을 수 없음 |

---

### 3.6 주가 재생 (클라이언트 사이드)

> **설계 결정**: 주가 스트리밍은 Edge Function이 아닌 **클라이언트 사이드**에서 처리합니다.
> Edge Function의 실행 시간 제한(60초)으로 인해 장시간 스트리밍이 불가능하며,
> 클라이언트에서 연도 데이터를 한 번에 fetch한 후 `setInterval`로 재생하는 방식이
> 서버 리소스를 최소화하고 속도 조절도 즉시 반영됩니다.

**재생 방식**

1. `GET /stock-prices?year={year}` API로 해당 연도의 전 종목 일별 데이터를 한 번에 로드
2. 클라이언트의 `useStockPlayback` 훅에서 `setInterval`로 1일씩 순차 재생
3. 재생/일시정지/속도 변경은 클라이언트 상태로 즉시 제어 (서버 호출 없음)
4. 현재 재생 위치(년/월/일)를 Zustand 스토어에서 관리

**재생 속도**

| 배속 | 1일 데이터 표시 간격 | 1개월(~22거래일) 소요 시간 |
|------|---------------------|--------------------------|
| 1x | 1000ms | ~22초 |
| 2x | 500ms | ~11초 |
| 5x | 200ms | ~4.4초 |

**별도 API 불필요** - `stock-prices` API(3.5절)로 데이터를 조회하고, 재생 로직은 전적으로 클라이언트에서 처리합니다.

---

### 3.7 퀴즈 / 힌트

#### `GET /quiz-list?year={year}` - 연도별 퀴즈 목록 조회

**Request**

```typescript
// Headers
Authorization: Bearer <access_token>

// Query Params
year: number;                   // 2010-2024
```

**Response (200 OK)**

```typescript
{
  year: number;
  quizzes: Array<{
    quiz_id: string;
    question_number: number;
    question: string;
    options: string[];           // 4개 선택지
  }>;
}
```

---

#### `POST /quiz-answer` - 퀴즈 답변 제출

3문제 답변을 한 번에 제출하고 결과를 받습니다.

**Request**

```typescript
// Headers
Authorization: Bearer <access_token>
Content-Type: application/json

// Body
{
  session_id: string;
  answers: Array<{
    quiz_id: string;
    selected_option: number;    // 선택한 답 인덱스 (0-3)
  }>;
}
```

**Response (200 OK)**

```typescript
{
  results: Array<{
    quiz_id: string;
    is_correct: boolean;
    correct_option: number;
    explanation: string;
  }>;
  correct_count: number;        // 정답 개수 (0-3)
  reward: {
    hint_level: 0 | 1 | 2;     // 0: 미달, 1: 2문제 정답, 2: 3문제 정답
    hint: {
      hint_id: string;
      year: number;
      level: number;
      content: string;
    } | null;
  };
}
```

**보상 규칙**

| 정답 수 | 보상 |
|---------|------|
| 3문제 | 레벨 2 힌트 해금 |
| 2문제 | 레벨 1 힌트 해금 |
| 0-1문제 | 힌트 없음 |

---

#### `POST /hint-unlock` - 광고 시청으로 힌트 해금

광고 시청 완료 후 레벨 1 힌트를 해금합니다.

**Request**

```typescript
// Headers
Authorization: Bearer <access_token>
Content-Type: application/json

// Body
{
  session_id: string;
  year: number;
  method: 'ad';                 // 광고 시청
}
```

**Response (200 OK)**

```typescript
{
  hint: {
    hint_id: string;
    year: number;
    level: 1;
    content: string;
  };
}
```

**에러 응답**

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 해당 연도 힌트가 이미 해금됨 |
| 401 | 인증 실패 |

---

#### `GET /hints?session_id={session_id}` - 해금된 힌트 전체 조회

**Request**

```typescript
// Headers
Authorization: Bearer <access_token>

// Query Params
session_id: string;
```

**Response (200 OK)**

```typescript
{
  hints: Array<{
    year: number;
    level: number;
    content: string;
    unlock_method: 'quiz' | 'ad';
    unlocked_at: string;
  }>;
}
```

---

### 3.8 랭킹

#### `GET /rankings?page={page}&limit={limit}` - 전체 랭킹 조회

**Request**

```typescript
// Headers
Authorization: Bearer <access_token>

// Query Params
page: number;                   // 페이지 번호 (기본 1)
limit: number;                  // 페이지당 개수 (기본 20, 최대 100)
```

**Response (200 OK)**

```typescript
{
  rankings: Array<{
    rank_position: number;
    nickname: string;
    avatar_url: string | null;
    final_asset: number;
    total_return_rate: number;
    total_trades: number;
    completed_at: string;
  }>;
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    has_next: boolean;
  };
}
```

---

#### `GET /rankings/me?session_id={session_id}` - 내 랭킹 조회

**Request**

```typescript
// Headers
Authorization: Bearer <access_token>

// Query Params
session_id: string;
```

**Response (200 OK)**

```typescript
{
  rank_position: number;
  nickname: string;
  final_asset: number;
  total_return_rate: number;
  total_trades: number;
  yearly_summary: Array<{       // 연도별 결산 요약
    year: number;
    starting_asset: number;
    ending_asset: number;
    return_rate: number;
  }>;
  top_trades: Array<{           // 최고 수익 거래 Top 5
    stock_alias_code: string;
    category: string;
    trade_type: string;
    profit: number;
    return_rate: number;
  }>;
}
```

---

### 3.9 프로필

#### `POST /profile-setup` - 프로필 설정

최초 가입 또는 프로필 수정 시 닉네임을 설정합니다.

**Request**

```typescript
// Headers
Authorization: Bearer <access_token>
Content-Type: application/json

// Body
{
  nickname: string;             // 2-20자, 중복 불가
  avatar_url?: string;
}
```

**Response (200 OK)**

```typescript
{
  user_id: string;
  nickname: string;
  avatar_url: string | null;
}
```

**에러 응답**

| 상태 코드 | 설명 |
|-----------|------|
| 400 | 닉네임 유효성 검사 실패 (길이, 특수문자) |
| 409 | 닉네임 중복 |

---

#### `GET /profile` - 내 프로필 조회

**Request**

```typescript
// Headers
Authorization: Bearer <access_token>
```

**Response (200 OK)**

```typescript
{
  user_id: string;
  nickname: string;
  avatar_url: string | null;
  provider: string;
  game_stats: {
    total_games: number;
    completed_games: number;
    best_return_rate: number;
    best_rank: number;
  };
}
```

---

### 3.10 Realtime 채널

Supabase Realtime을 사용하여 게임 이벤트를 동기화합니다.

> **참고**: 주가 스트리밍은 클라이언트 사이드에서 처리하므로(3.6절), Realtime은 게임 이벤트 전달 용도로만 사용합니다.

#### `game:{session_id}:events` - 게임 이벤트 채널

거래 확인, 결산 완료, 게임 종료 등의 서버 이벤트를 수신합니다.

**수신 이벤트: `trade-confirmed`**

```typescript
{
  event: 'trade-confirmed';
  payload: {
    trade_id: string;
    stock_alias_code: string;
    trade_type: 'buy' | 'sell';
    quantity: number;
    price: number;
    cash_balance: number;
  };
}
```

**수신 이벤트: `settlement-complete`**

```typescript
{
  event: 'settlement-complete';
  payload: {
    year: number;
    ending_asset: number;
    return_rate: number;
  };
}
```

**수신 이벤트: `game-completed`**

```typescript
{
  event: 'game-completed';
  payload: {
    final_asset: number;
    total_return_rate: number;
    rank_position: number;
    stocks_revealed: Array<{    // 종목명 공개
      alias_code: string;
      real_name: string;
      category: string;
    }>;
  };
}
```

---

## 4. 구현 기능과 구현 방법

### 4.1 게임 플레이 구조

**핵심 기술**: `useFunnel` + Zustand + Supabase Realtime

게임은 매 연도마다 3단계 Funnel로 구성됩니다:

```
[HintPhase] → [TradingPhase] → [SettlementPhase]
     1월            2-11월           12월
```

**구현 방법**

```typescript
// useGameFunnel.ts - Funnel 기반 연도 사이클 관리
function useGameFunnel(sessionId: string) {
  const { step, setStep } = useFunnel<'hint' | 'trading' | 'settlement'>('hint');
  const gameState = useGameStore();

  // Realtime 이벤트에 따른 자동 전환
  useEffect(() => {
    const channel = supabase.channel(`game:${sessionId}:events`);

    channel.on('broadcast', { event: 'month-end' }, ({ payload }) => {
      if (payload.month === 1) setStep('trading');  // 1월 종료 → 트레이딩 시작
    });

    channel.on('broadcast', { event: 'year-end' }, () => {
      setStep('settlement');                        // 연말 → 결산 단계
    });

    channel.subscribe();
    return () => { channel.unsubscribe(); };
  }, [sessionId]);

  return { step, setStep };
}
```

**Zustand 게임 스토어**

```typescript
// stores/gameStore.ts
interface GameState {
  sessionId: string | null;
  currentYear: number;
  currentMonth: number;
  cashBalance: number;
  totalAsset: number;
  playbackSpeed: 1 | 2 | 5;
  isPlaying: boolean;
  portfolio: PortfolioHolding[];
  currentPrices: Record<string, StockPrice>;  // stock_id → 최신 가격
}

interface GameActions {
  setSession: (session: GameSession) => void;
  updatePrices: (prices: StockPrice[]) => void;
  updatePortfolio: (holdings: PortfolioHolding[]) => void;
  setPlaybackSpeed: (speed: 1 | 2 | 5) => void;
  advanceMonth: (month: number) => void;
  reset: () => void;
}
```

### 4.2 익명 종목 시스템

**핵심 기술**: `stocks` / `stock_secrets` 테이블 분리 + Edge Function `service_role` 접근 제어

**구현 방법**

- `stocks` 테이블: 공개 정보만 저장 (`alias_code`, `category`) → 클라이언트에서 직접 조회 가능 (RLS: public read)
- `stock_secrets` 테이블: 실명 정보 저장 (`real_name`, `ticker`) → RLS 정책 없음 (클라이언트 접근 불가)
- 게임 중 모든 API 응답에서 `alias_code`와 `category`만 반환
- 게임 완료(`status = 'completed'`) 시에만 Edge Function에서 `service_role`로 `stock_secrets` JOIN 후 `real_name` 반환

```sql
-- 게임 완료 시 종목 공개를 위한 보안 함수 (Edge Function에서 service_role로 호출)
CREATE OR REPLACE FUNCTION reveal_stock_names(p_session_id UUID)
RETURNS TABLE(alias_code VARCHAR, category VARCHAR, real_name VARCHAR) AS $$
DECLARE
  v_status VARCHAR;
BEGIN
  SELECT status INTO v_status FROM game_sessions WHERE id = p_session_id;

  IF v_status != 'completed' THEN
    RAISE EXCEPTION 'Game session is not completed';
  END IF;

  RETURN QUERY
    SELECT s.alias_code, s.category, ss.real_name
    FROM stocks s
    JOIN stock_secrets ss ON s.id = ss.stock_id
    ORDER BY s.alias_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**게임 종료 시 종목 공개 애니메이션**

```typescript
// components/StockRevealAnimation/index.tsx
// Motion의 AnimatePresence를 사용하여 순차적으로 종목명 공개
function StockRevealAnimation({ stocks }: { stocks: RevealedStock[] }) {
  return (
    <AnimatePresence>
      {stocks.map((stock, index) => (
        <motion.div
          key={stock.alias_code}
          initial={{ opacity: 0, rotateY: 180 }}
          animate={{ opacity: 1, rotateY: 0 }}
          transition={{ delay: index * 0.5, duration: 0.8, type: 'spring' }}
        >
          <StockCard
            aliasCode={stock.alias_code}
            realName={stock.real_name}
            category={stock.category}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
```

### 4.3 힌트 시스템

**핵심 기술**: 퀴즈 + 광고 → 포인트 → 힌트 해금

**Funnel 흐름**

```
[QuizStep] → [ResultStep] → [HintDisplayStep]
  3문제 풀기     결과 확인      힌트 표시
       ↘
   [AdWatchStep] → [HintDisplayStep]
     광고 시청       힌트 표시
```

**구현 방법**

```typescript
// pages/HintPhase/index.tsx
function HintPhase({ sessionId, year }: HintPhaseProps) {
  const { step, setStep } = useFunnel<'choice' | 'quiz' | 'ad' | 'result' | 'hint'>('choice');

  return (
    <>
      {step === 'choice' && (
        <HintChoiceScreen
          onSelectQuiz={() => setStep('quiz')}
          onSelectAd={() => setStep('ad')}
        />
      )}
      {step === 'quiz' && (
        <QuizScreen year={year} onComplete={() => setStep('result')} />
      )}
      {step === 'ad' && (
        <AdWatchScreen onComplete={() => setStep('hint')} />
      )}
      {step === 'result' && (
        <QuizResultScreen onContinue={() => setStep('hint')} />
      )}
      {step === 'hint' && (
        <HintDisplayScreen sessionId={sessionId} year={year} />
      )}
    </>
  );
}
```

### 4.4 실시간 차트 (클라이언트 사이드 재생)

**핵심 기술**: Lightweight Charts + 클라이언트 `setInterval` 기반 재생

> Edge Function은 60초 타임아웃 제한이 있으므로, 연도별 OHLCV 데이터를 한 번에 로드한 후 클라이언트에서 1일 1초 간격으로 순차 재생합니다.

**구현 방법**

```typescript
// hooks/useStockPlayback.ts
function useStockPlayback(prices: StockDailyPrice[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 5>(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentPrice = prices[currentIndex] ?? null;
  const displayedPrices = prices.slice(0, currentIndex + 1);
  const isCompleted = currentIndex >= prices.length - 1;

  const play = useCallback(() => {
    if (isCompleted) return;
    setIsPlaying(true);
  }, [isCompleted]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const changeSpeed = useCallback((newSpeed: 1 | 2 | 5) => {
    setSpeed(newSpeed);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= prices.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000 / speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, prices.length]);

  return { currentPrice, displayedPrices, currentIndex, isPlaying, speed, isCompleted, play, pause, changeSpeed };
}
```

```typescript
// components/StockChart/index.tsx
// useStockPlayback의 displayedPrices를 Lightweight Charts에 연동
function StockChart({ prices }: { prices: StockDailyPrice[] }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: { background: { color: '#1a1a2e' }, textColor: '#e0e0e0' },
      grid: { vertLines: { color: '#2a2a3e' }, horzLines: { color: '#2a2a3e' } },
      crosshair: { mode: CrosshairMode.Normal },
      timeScale: { timeVisible: false, borderColor: '#2a2a3e' },
    });

    seriesRef.current = chartRef.current.addLineSeries({
      color: '#00d4aa',
      lineWidth: 2,
    });

    return () => { chartRef.current?.remove(); };
  }, []);

  useEffect(() => {
    if (!seriesRef.current) return;
    seriesRef.current.setData(
      prices.map((p) => ({ time: p.date, value: p.close }))
    );
  }, [prices]);

  return <div ref={chartContainerRef} />;
}
```

**재생 속도 제어**

클라이언트 `setInterval` 기반으로 속도를 제어합니다:

| 배속 | 1일 데이터 간격 | 1개월(~22거래일) 소요 시간 |
|------|---------------|--------------------------|
| 1x | 1000ms | ~22초 |
| 2x | 500ms | ~11초 |
| 5x | 200ms | ~4.4초 |

### 4.5 블러 차트 미리보기

**핵심 기술**: Lightweight Charts AreaSeries + CSS `filter: blur()` + `blur_events` 테이블

> README 기준 "3개월 기간의 흐름"을 미리보기로 제공합니다. `blur_events` 테이블의 `preview_months`에 미리보기 대상 월(3개)을 지정합니다.

**구현 방법**

```typescript
// hooks/useBlurChart.ts
function useBlurChart(sessionId: string, stockId: string, year: number) {
  return useQuery({
    queryKey: QUERY_KEY.blurChart(sessionId, stockId, year),
    queryFn: () =>
      supabase.functions.invoke('stock-blur-preview', {
        body: { session_id: sessionId, stock_id: stockId, year },
      }),
    select: (res) => res.data as BlurChartData,
  });
}

interface BlurChartData {
  stock_id: string;
  alias_code: string;
  year: number;
  preview_months: number[];  // e.g. [1, 2, 3]
  daily_closes: Array<{ date: string; close: number }>;
  is_unlocked: boolean;
}
```

```typescript
// components/BlurChart/index.tsx
function BlurChart({ data, isUnlocked }: BlurChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !data) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 200,
      handleScroll: false,
      handleScale: false,
      layout: { background: { color: 'transparent' }, textColor: '#888' },
      timeScale: { visible: false },
      rightPriceScale: { visible: false },
      crosshair: { mode: CrosshairMode.Hidden },
    });

    const areaSeries = chart.addAreaSeries({
      lineColor: '#4a90d9',
      topColor: 'rgba(74, 144, 217, 0.4)',
      bottomColor: 'rgba(74, 144, 217, 0.0)',
      lineWidth: 2,
    });

    // 3개월 일별 종가 데이터
    areaSeries.setData(
      data.daily_closes.map((d) => ({ time: d.date, value: d.close }))
    );

    return () => chart.remove();
  }, [data]);

  return (
    <S.BlurChartWrapper isUnlocked={isUnlocked}>
      <div ref={chartContainerRef} />
      {!isUnlocked && (
        <S.BlurOverlay>
          <LockIcon />
          <span>블러 차트를 해금하세요</span>
        </S.BlurOverlay>
      )}
    </S.BlurChartWrapper>
  );
}

// BlurChart.styles.ts
export const BlurChartWrapper = styled.div<{ isUnlocked: boolean }>`
  position: relative;
  border-radius: 12px;
  overflow: hidden;

  > div:first-of-type {
    filter: ${({ isUnlocked }) => (isUnlocked ? 'none' : 'blur(8px)')};
    pointer-events: ${({ isUnlocked }) => (isUnlocked ? 'auto' : 'none')};
    transition: filter 0.5s ease;
  }
`;
```

### 4.6 포트폴리오 / 트레이딩

**핵심 기술**: React Hook Form + useMutation + Zustand

**매수/매도 폼**

```typescript
// components/TradeForm/index.tsx
interface TradeFormData {
  quantity: number;
}

function TradeForm({ stockId, tradeType, currentPrice, maxQuantity }: TradeFormProps) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<TradeFormData>();

  const quantity = watch('quantity', 0);
  const totalAmount = quantity * currentPrice;

  const tradeMutation = useMutation({
    mutationFn: (data: TradeFormData) =>
      executeTradeAPI({
        session_id: sessionId,
        stock_id: stockId,
        trade_type: tradeType,
        quantity: data.quantity,
      }),
    onSuccess: (result) => {
      // Zustand 스토어 업데이트
      gameStore.updatePortfolio(result.updated_holding);
      gameStore.setCashBalance(result.updated_balance.cash_balance);
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => tradeMutation.mutate(data))}>
      <Input
        type="number"
        {...register('quantity', {
          required: '수량을 입력하세요',
          min: { value: 1, message: '1주 이상 입력하세요' },
          max: { value: maxQuantity, message: `최대 ${maxQuantity}주까지 가능합니다` },
        })}
        placeholder="수량"
      />
      {errors.quantity && <ErrorText>{errors.quantity.message}</ErrorText>}

      <TotalAmountDisplay>
        예상 {tradeType === 'buy' ? '매수' : '매도'} 금액: {totalAmount.toLocaleString()}원
      </TotalAmountDisplay>

      <Button
        type="submit"
        variant={tradeType === 'buy' ? 'primary' : 'secondary'}
        disabled={tradeMutation.isPending}
      >
        {tradeType === 'buy' ? '매수' : '매도'}
      </Button>
    </form>
  );
}
```

### 4.7 랭킹 시스템

**핵심 기술**: TanStack Query `useInfiniteQuery`

**구현 방법**

```typescript
// hooks/useRankings.ts
function useRankings(limit = 20) {
  return useInfiniteQuery({
    queryKey: ['rankings'],
    queryFn: ({ pageParam = 1 }) =>
      fetchRankingsAPI({ page: pageParam, limit }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_next ? lastPage.pagination.current_page + 1 : undefined,
    initialPageParam: 1,
  });
}

// pages/RankingPage/index.tsx
function RankingPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useRankings();
  const observerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer로 무한 스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const rankings = data?.pages.flatMap((page) => page.rankings) ?? [];

  return (
    <S.RankingList>
      {rankings.map((rank) => (
        <RankingItem key={rank.rank_position} {...rank} />
      ))}
      <div ref={observerRef}>
        {isFetchingNextPage && <Spinner />}
      </div>
    </S.RankingList>
  );
}
```

### 4.8 게임 튜토리얼

**핵심 기술**: `@cllaude99/ui` Dialog + Carousel 패턴

**구현 방법**

```typescript
// components/GameTutorial/index.tsx
const TUTORIAL_STEPS = [
  { title: '게임 소개', content: '2010~2024년 한국 주식 시뮬레이션에 오신 것을 환영합니다!' },
  { title: '익명 종목', content: '10개 종목은 알파벳 코드로만 표시됩니다.' },
  { title: '힌트 시스템', content: '매년 1월에 퀴즈를 풀거나 광고를 보고 힌트를 얻으세요.' },
  { title: '투자 방법', content: '2~11월 동안 실시간 차트를 보며 매수/매도하세요.' },
  { title: '블러 차트', content: '2년마다 블러 차트로 연간 추세를 미리 볼 수 있습니다.' },
  { title: '연말 결산', content: '12월 31일에 자동 결산되고 자산이 다음 해로 이월됩니다.' },
] as const;

function GameTutorial({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  return (
    <Dialog open onClose={onComplete}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <S.TutorialStep>
            <h2>{TUTORIAL_STEPS[currentStep].title}</h2>
            <p>{TUTORIAL_STEPS[currentStep].content}</p>
          </S.TutorialStep>
        </motion.div>
      </AnimatePresence>

      <S.StepIndicator>
        {TUTORIAL_STEPS.map((_, i) => (
          <S.Dot key={i} active={i === currentStep} />
        ))}
      </S.StepIndicator>

      <S.ButtonGroup>
        {currentStep > 0 && (
          <Button variant="secondary" onClick={() => setCurrentStep((s) => s - 1)}>
            이전
          </Button>
        )}
        <Button onClick={isLastStep ? onComplete : () => setCurrentStep((s) => s + 1)}>
          {isLastStep ? '시작하기' : '다음'}
        </Button>
      </S.ButtonGroup>
    </Dialog>
  );
}
```

### 4.9 파일 구조 설계

```
apps/web/src/
├── pages/
│   ├── HomePage/                    # 메인 페이지 (게임 시작/계속)
│   │   ├── index.tsx
│   │   └── HomePage.styles.ts
│   ├── GamePage/                    # 게임 메인 페이지
│   │   ├── index.tsx
│   │   └── GamePage.styles.ts
│   ├── HintPhasePage/               # 1월 힌트 단계
│   │   ├── index.tsx
│   │   ├── HintPhasePage.styles.ts
│   │   ├── QuizScreen.tsx
│   │   ├── AdWatchScreen.tsx
│   │   ├── QuizResultScreen.tsx
│   │   └── HintDisplayScreen.tsx
│   ├── TradingPhasePage/            # 2-11월 트레이딩 단계
│   │   ├── index.tsx
│   │   ├── TradingPhasePage.styles.ts
│   │   ├── ChartPanel.tsx
│   │   ├── PortfolioPanel.tsx
│   │   └── TradePanel.tsx
│   ├── SettlementPage/              # 12월 결산 단계
│   │   ├── index.tsx
│   │   └── SettlementPage.styles.ts
│   ├── GameCompletePage/            # 게임 완료 (종목 공개)
│   │   ├── index.tsx
│   │   └── GameCompletePage.styles.ts
│   ├── RankingPage/                 # 랭킹 페이지
│   │   ├── index.tsx
│   │   └── RankingPage.styles.ts
│   ├── ProfilePage/                 # 프로필 페이지
│   │   ├── index.tsx
│   │   └── ProfilePage.styles.ts
│   └── AuthCallbackPage/           # OAuth 콜백 처리
│       └── index.tsx
│
├── components/
│   ├── StockChart/                  # Lightweight Charts 래퍼
│   │   ├── index.tsx
│   │   └── StockChart.styles.ts
│   ├── BlurChart/                   # 블러 차트 미리보기
│   │   ├── index.tsx
│   │   └── BlurChart.styles.ts
│   ├── TradeForm/                   # 매수/매도 폼
│   │   ├── index.tsx
│   │   └── TradeForm.styles.ts
│   ├── PortfolioDashboard/          # 포트폴리오 대시보드
│   │   ├── index.tsx
│   │   └── PortfolioDashboard.styles.ts
│   ├── StockList/                   # 종목 리스트 (탭 전환)
│   │   ├── index.tsx
│   │   └── StockList.styles.ts
│   ├── StockRevealAnimation/        # 종목명 공개 애니메이션
│   │   ├── index.tsx
│   │   └── StockRevealAnimation.styles.ts
│   ├── GameTutorial/                # 온보딩 튜토리얼
│   │   ├── index.tsx
│   │   └── GameTutorial.styles.ts
│   ├── PlaybackControls/            # 재생 속도 제어 UI
│   │   ├── index.tsx
│   │   └── PlaybackControls.styles.ts
│   ├── RankingItem/                 # 랭킹 리스트 아이템
│   │   ├── index.tsx
│   │   └── RankingItem.styles.ts
│   └── YearTimeline/                # 연도별 타임라인 표시
│       ├── index.tsx
│       └── YearTimeline.styles.ts
│
├── hooks/
│   ├── useGameFunnel.ts             # 게임 Funnel 관리
│   ├── useStockPlayback.ts           # 클라이언트 사이드 주가 재생
│   ├── useRealtimeEvents.ts         # 게임 이벤트 구독 (Supabase Realtime)
│   ├── useTrade.ts                  # 매수/매도 mutation
│   ├── useGameSession.ts            # 게임 세션 CRUD
│   ├── useRankings.ts               # 랭킹 무한스크롤
│   ├── useQuiz.ts                   # 퀴즈 관련 로직
│   └── useBlurChart.ts              # 블러 차트 데이터
│
├── stores/
│   ├── gameStore.ts                 # 게임 상태 (Zustand)
│   └── uiStore.ts                   # UI 상태 (모달, 사이드바 등)
│
├── apis/
│   ├── game.ts                      # 게임 관련 API 함수
│   ├── trade.ts                     # 거래 관련 API 함수
│   ├── stock.ts                     # 주식 데이터 API 함수
│   ├── quiz.ts                      # 퀴즈/힌트 API 함수
│   ├── ranking.ts                   # 랭킹 API 함수
│   ├── profile.ts                   # 프로필 API 함수
│   └── supabaseClient.ts            # Supabase 클라이언트 설정
│
├── constants/
│   ├── game.ts                      # 게임 관련 상수 (초기 시드머니, 연도 범위 등)
│   ├── path.ts                      # 라우팅 경로
│   └── queryKeys.ts                 # TanStack Query 키
│
└── types/
    ├── game.ts                      # 게임 관련 타입
    ├── stock.ts                     # 주식 관련 타입
    ├── trade.ts                     # 거래 관련 타입
    └── ranking.ts                   # 랭킹 관련 타입
```

---

## 5. 기간별 끝내야하는 작업

전체 기간: **6주 (5 Sprint)**

### Sprint 1 - 데이터 수집 + 차트 엔진 (1주)

#### Day 1-2: 프로젝트 셋업 + DB 설계

**작업 내용**

- Supabase 프로젝트 생성 및 Auth 설정 (Google, Kakao OAuth)
- DB 스키마 마이그레이션 적용 (`stocks`, `stock_secrets`, `stock_daily_prices`, `game_sessions`, `portfolio_holdings`, `trade_history`, `yearly_settlements`, `quizzes`, `hints`, `blur_events`, `user_hint_unlocks`, `user_quiz_answers`, `rankings`, `user_profiles`)
- RLS 정책 전체 적용
- `supabaseClient.ts` 설정
- Zustand 게임 스토어 (`gameStore.ts`, `uiStore.ts`) 설계 및 구현
- 라우팅 설정 (`path.ts`, `RouteProvider.tsx`)
- TanStack Query 키 설계 (`queryKeys.ts`)

**산출물**

- DB ERD 완성
- Supabase 프로젝트 동작 확인
- 프론트엔드 기본 구조 완성

#### Day 3-4: 주식 데이터 수집 + 적재

**작업 내용**

- 종목 선정 (카테고리 분산: IT 2, 엔터 2, 바이오 1, 식품 1, 뷰티 1, 화학 1, 조선 1, 금융 1)
- `seed-stock-data` Edge Function 구현 및 배포
  - Yahoo Finance API에서 10개 종목 2010-2024년 OHLCV 데이터 fetch
  - `stocks` 테이블에 종목 마스터 INSERT (alias_code A~J 매핑)
  - `stock_daily_prices` 테이블에 일별 시세 배치 INSERT
- Edge Function 실행하여 데이터 적재
- `execute_sql`로 데이터 정합성 검증 (거래일 수, 결측치, 이상치)

**산출물**

- `seed-stock-data` Edge Function 배포 완료
- 10개 종목 데이터 적재 완료
- 데이터 품질 검증 (SQL 쿼리로 확인)

#### Day 5-7: Lightweight Charts 통합 + 클라이언트 재생

**작업 내용**

- Lightweight Charts 설치 및 `StockChart` 컴포넌트 구현
- 목업 데이터로 1개 종목 라인 차트 렌더링
- `useStockPlayback` 훅 구현 (클라이언트 `setInterval` 기반 1일 1초 재생)
- `PlaybackControls` 컴포넌트 (재생/일시정지/1x/2x/5x)
- `stock-prices` Edge Function 구현 (연도별 OHLCV 데이터 일괄 조회)
- 1초 간격 차트 순차 업데이트 검증

**산출물**

- 1개 종목 클라이언트 재생 차트 동작
- 재생 속도 제어 기능

---

### Sprint 2 - 트레이딩 시스템 + 연도 사이클 (1.5주)

#### Day 1-3: 매수/매도 시스템

**작업 내용**

- `trade-execute` Edge Function 구현 (잔액/보유량 검증, 거래 체결, DB 업데이트)
- `TradeForm` 컴포넌트 (React Hook Form 기반 매수/매도 입력)
- `useTrade` 훅 (useMutation + 낙관적 업데이트)
- `PortfolioDashboard` 컴포넌트 (현금, 주식 평가액, 총자산, 보유 종목 수익률)
- `game:{session_id}:events` 채널 구독 및 `trade-confirmed` 이벤트 처리

**산출물**

- 매수/매도 기능 완성
- 포트폴리오 실시간 업데이트

#### Day 4-6: 연도 사이클 + Funnel

**작업 내용**

- `game-advance-year` Edge Function 구현 (자동 결산, 연도 이월)
- `useGameFunnel` 훅 (HintPhase → TradingPhase → SettlementPhase)
- `SettlementPage` 구현 (결산 결과 표시, 연도별 수익률)
- `YearTimeline` 컴포넌트 (2010-2024 타임라인 진행 상황)
- `stock-history` Edge Function 구현 (특정 종목 연도별 데이터 조회)
- `month-end`, `year-end` Realtime 이벤트 처리

**산출물**

- 연도 자동 이월 시스템 완성
- Funnel 기반 게임 흐름

#### Day 7-8: 게임 관리 API + 인증

**작업 내용**

- `game-create` Edge Function 구현
- `game-state` Edge Function 구현
- `game-abandon` Edge Function 구현
- `profile-setup`, `profile` Edge Function 구현
- OAuth 로그인 흐름 + `AuthCallbackPage` 구현
- `HomePage` (게임 시작/이어하기 분기)

**산출물**

- 게임 생성부터 포기까지 전체 흐름
- 로그인/프로필 설정 완성

---

### Sprint 3 - 힌트 시스템 (1주)

#### Day 1-3: 퀴즈 시스템

**작업 내용**

- `quiz-list` Edge Function 구현
- `quiz-answer` Edge Function 구현 (정답 검증, 힌트 해금 로직)
- 2010-2024년 각 연도별 퀴즈 3문제 데이터 작성 및 적재
- 2010-2024년 각 연도별 레벨 1, 레벨 2 힌트 데이터 작성 및 적재
- `QuizScreen` 컴포넌트 (3문제 순차 표시, 선택지 UI)
- `QuizResultScreen` 컴포넌트 (정답/오답 표시, 해설)
- `useQuiz` 훅

**산출물**

- 퀴즈 풀기 기능 완성
- 퀴즈 데이터 전체 적재

#### Day 4-5: 광고 시청 + 힌트 표시

**작업 내용**

- `hint-unlock` Edge Function 구현
- `hints` Edge Function 구현 (해금된 힌트 전체 조회)
- `AdWatchScreen` 컴포넌트 (30초 타이머 + 광고 영역)
- `HintDisplayScreen` 컴포넌트 (레벨별 힌트 카드 UI)
- `HintChoiceScreen` 컴포넌트 (퀴즈 vs 광고 선택)
- `HintPhasePage` Funnel 조합

**산출물**

- 힌트 시스템 전체 완성
- 레벨별 힌트 표시

#### Day 6-7: HintPhase ↔ TradingPhase 연결

**작업 내용**

- 1월 진입 시 자동으로 HintPhase 표시
- 힌트 획득 후 TradingPhase 자동 전환
- 이전 연도 힌트 히스토리 조회 UI
- 게임 튜토리얼 (`GameTutorial` 컴포넌트, 첫 게임 시작 시 표시)

**산출물**

- 힌트 → 트레이딩 자연스러운 전환
- 온보딩 튜토리얼

---

### Sprint 4 - 멀티 종목 + 블러 차트 (1.5주)

#### Day 1-4: 10개 종목 멀티 차트

**작업 내용**

- `StockList` 컴포넌트 (10개 종목 탭 전환)
- 종목 탭 클릭 시 차트 데이터 전환
- 10개 종목 클라이언트 재생 처리 (`useStockPlayback` 확장)
- 종목별 현재가 + 등락률 실시간 표시
- 종목 비교 기능 (최대 3개 차트 동시 표시)
- `stock-prices`, `stock-history` Edge Function 구현

**산출물**

- 10개 종목 완전 구현
- 종목 비교 기능

#### Day 5-7: 블러 차트 시스템

**작업 내용**

- `stock-blur-preview` Edge Function 구현
- `BlurChart` 컴포넌트 (AreaSeries + CSS blur)
- 블러 차트 해금 이벤트 (2012, 2014, 2016, 2018, 2020, 2022, 2024년)
- 블러 차트 해금 조건 (퀴즈/광고) 처리
- `useBlurChart` 훅
- 블러 해금 애니메이션 (blur → clear 트랜지션)

**산출물**

- 블러 차트 기능 완성
- 블러 해금 애니메이션

#### Day 8-10: UI 폴리시 + 통합 테스트

**작업 내용**

- 전체 게임 흐름 통합 테스트 (2010 → 2024 한 사이클)
- 반응형 레이아웃 조정
- 로딩 상태, 에러 상태 처리
- Sentry 에러 추적 연동
- 게임 중간 저장/복원 검증

**산출물**

- 통합 테스트 완료
- 에러 추적 설정

---

### Sprint 5 - 랭킹 + 게임 완성 + 배포 (1주)

#### Day 1-3: 랭킹 시스템 + 게임 완료

**작업 내용**

- `rankings` Edge Function 구현 (페이지네이션, 정렬)
- `rankings/me` Edge Function 구현 (개인 랭킹 + 연도별 요약)
- `RankingPage` 구현 (무한 스크롤, `useRankings` 훅)
- `RankingItem` 컴포넌트
- `GameCompletePage` 구현 (최종 자산, 수익률, 순위 표시)
- `StockRevealAnimation` 구현 (종목명 순차 공개 애니메이션)
- `game-completed` Realtime 이벤트에서 `stocks_revealed` 데이터 처리

**산출물**

- 랭킹 시스템 완성
- 게임 종료 화면 + 종목 공개

#### Day 4-5: 투자 히스토리 + 최종 폴리시

**작업 내용**

- 투자 히스토리 리플레이 (연도별 거래 내역, 수익률 차트)
- 게임 결과 공유 기능 (SNS 공유 링크)
- 전체 UI 폴리시 (애니메이션, 트랜지션, 마이크로인터랙션)
- 접근성 검수 (키보드 네비게이션, 스크린리더)
- Lighthouse 성능 측정 및 최적화

**산출물**

- 투자 히스토리 리플레이
- UI 최종 완성

#### Day 6-7: 배포 + QA

**작업 내용**

- Vercel 배포 설정 (환경변수, 도메인)
- E2E 테스트 (Playwright) - 주요 게임 흐름
- 단위 테스트 (Jest) - 핵심 비즈니스 로직 (거래 계산, 수익률 계산)
- 크로스 브라우저 테스트 (Chrome, Safari, Firefox)
- 최종 QA 및 버그 수정
- 프로덕션 배포

**산출물**

- 완성된 게임 (프로덕션 배포)
- E2E / 단위 테스트 코드
- 배포 URL
