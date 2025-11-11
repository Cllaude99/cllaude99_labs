## 목차

1. [Traders](#프로젝트-1-traders)
2. [Sketch](#프로젝트-2-sketch)

---

# Traders

## 📌 프로젝트 소개

**"과거로 돌아가 주식 투자를 다시 해볼 수 있다면?"**

2010년부터 2024년까지의 실제 한국 주식 데이터를 기반으로, 과거 시점으로 돌아가 투자 결정을 내리고 결과를 확인하는 **실시간 주식 시뮬레이션 게임**입니다. 주식 종목명은 비공개로 진행되며, 각 연도의 경제 뉴스와 힌트를 활용해 15년간의 투자 여정을 완주하는 것이 목표입니다.

---

## 🎮 게임 플레이 로직

### 게임 진행 구조

**1. 게임 시작 (2010년 1월)**

- 초기 시드머니 1000만원 지급
- 10개의 익명화된 한국 주식 종목 제공 (엔터, IT, 바이오, 식품, 뷰티, 화학, 조선 등 다양한 분야)
- 각 종목은 알파벳 코드로만 표시 (예 A, B, C...) - 실제 기업명은 비공개

**2. 연도별 사이클 (매년 1월 ~ 12월)**

**① 1월 정보 획득 단계**

```
매년 1월 1일, 플레이어는 두 가지 방법으로 정보를 얻을 수 있습니다.

[방법 1] 퀴즈 풀기 (추천)
- 경제 관련 퀴즈 3문제 제시 (경제 용어, 증권 용어 등)
- 정답 개수에 따라 보상 차등 지급
  * 3문제 정답: 레벨 2 힌트 (구체적인 경제 정보)
  * 2문제 정답: 레벨 1 힌트 (일반적인 사회 이슈)
  * 1문제 이하: 힌트 없음

[방법 2] 광고 시청
- 30초 광고 시청 시 무조건 레벨 1 힌트 획득

[힌트 레벨 설명]
• 레벨 1 (일반 정보)
  - "이 해에는 스마트폰 보급이 확대되었습니다"
  - "전세계적으로 헬스케어에 대한 관심이 증가했습니다"

• 레벨 2 (구체적 정보)
  - "삼성전자가 갤럭시S 시리즈를 출시하며 IT 업종이 급성장했습니다"
  - "메르스 사태로 인해 바이오/제약 업종이 주목받았습니다"
```

**② 2월 ~ 11월 투자 진행**

- 실시간 차트로 주가 변동 확인 (1개월 = 30초~1분으로 압축 재생)
- 언제든지 매수/매도 가능
- 포트폴리오 실시간 수익률 확인
- 속도 조절 가능 (1배속, 2배속, 5배속)

**③ 12월 31일 결산**

- 12월 31일 23시59분까지 모든 투자 결정 완료 필수
- 보유 중인 주식은 자동으로 12월 31일 종가에 매도
- 최종 자산 = 현금 + 주식 평가액
- 수익률 계산 및 전체 유저 랭킹 업데이트

**3. 다음 연도 시작 (예 2011년 1월)**

- 전년도 최종 자산이 새로운 시드머니가 됨
- 예시 2010년에 1.2억을 만들었다면 → 2011년 시드머니는 1.2억

**4. 특별 이벤트 블러 차트 미리보기 (2년마다)**

```
2012년, 2014년, 2016년, 2018년, 2020년, 2022년, 2024년

매 짝수 연도 1월에 특별 이벤트 발생
- 퀴즈를 맞추거나 광고를 시청하면 "블러 차트" 획득 가능
- 블러 차트: 해당 연도 1월 ~ 12월의 주가 흐름을 중 3개월의 기간동안의 주식 흐름을 보여줌. 즉, 기본적으로는 차트가 블러처리되어 있지만, 블러 차트 아이템을 사용하여 3개월 동안의 흐름을 볼 수 있는 것임
- 따라서 전체적인 상승/하락 추세는 파악 가능하지만 정확한 수치는 알 수 없음
- 장기 투자 전략 수립에 유용
```

**5. 게임 종료 (2024년 12월 31일)**

- 15년간의 투자 여정 완료
- 최종 수익률 계산
- 전체 랭킹 확인
- **종목명 공개** 이제서야 A, B, C가 어떤 기업이었는지 밝혀짐
- 연도별 투자 히스토리 리플레이 가능

---

## ✨ 핵심 기능 상세

### 1. 익명 종목 시스템

**구현 방법**

```typescript
// 종목 데이터 구조
interface Stock {
  code: string; // 'A', 'B', 'C'... (표시용)
  category: string; // '엔터', 'IT', '바이오' 등
  realName: string; // 실제 기업명 (암호화 저장, 게임 종료 시 공개)
  prices: StockPrice[]; // 2010-2024 일별 주가 데이터
}

// 10개 종목 예시 (이미지 참고)
const stockCategories = {
  엔터: ['A', 'B'], // 20,000원, 3,000원
  IT: ['C', 'D'], // 60,000원, 300,000원
  바이오: ['E', 'F'], // 50,000원, 2,000원
  식품: ['G'], // 30,000원
  뷰티: ['H'], // 100,000원
  화학: ['I'], // 40,000원
  조선: ['J'], // 250,000원
};
```

**화면 구성**

- 종목 리스트 `[A 엔터] [B 엔터] [C IT] [D IT]...`
- 현재가만 표시, 기업명은 `???`로 표시
- 게임 종료 후 `A 엔터 (삼성전자)` 처럼 실명 공개

---

### 2. 힌트 시스템 (매년 1월)

**UI 흐름도**

```
[1월 1일 시작]
      ↓
[퀴즈 풀기] ← → [광고 보기]
      ↓              ↓
  [3문제]        [30초 광고]
      ↓              ↓
[채점 결과]      [레벨1 획득]
      ↓
[레벨1/2 힌트 표시]
      ↓
[2월로 진행]
```

**구현 방법**

```typescript
// 퀴즈 데이터 구조
interface YearlyQuiz {
  year: number;
  questions: [
    {
      question: '2010년 대한민국에서 개최된 국제 행사는?';
      options: ['올림픽', 'G20 정상회의', '월드컵', '아시안게임'];
      answer: 1;
      level1Hint: '이 해 글로벌 경제 회복에 대한 기대감이 높았습니다.';
      level2Hint: 'G20 정상회의 개최로 IT 인프라 투자가 급증했습니다.';
    },
    // ... 2문제 더
  ];
}

// 힌트 표시 로직
function displayHint(correctCount: number) {
  if (correctCount >= 3) {
    return { level: 2, hint: quiz.level2Hint };
  } else if (correctCount >= 1) {
    return { level: 1, hint: quiz.level1Hint };
  } else {
    return { level: 0, hint: '힌트 없음' };
  }
}
```

---

### 3. 실시간 차트 시스템

**차트 구성**

```
┌─────────────────────────────────────────┐
│  [A 엔터]  현재가 21,500원 (+7.5%) │
├─────────────────────────────────────────┤
│                                         │
│      📈 라인 차트 (1년치)               │
│                                         │
│   25,000 ┤     ╱╲                      │
│   20,000 ┤   ╱   ╲╱                    │
│   15,000 ┤ ╱                            │
│   10,000 ┴─────────────────────────     │
│         1월  3월  6월  9월  12월       │
│                                         │
├─────────────────────────────────────────┤
│  [속도] 1x  2x  5x                      │
│  [현재] 2010년 6월 15일                 │
└─────────────────────────────────────────┘
```

**구현 기술**

- **라이브러리** Lightweight Charts (TradingView)
- **실시간 업데이트** WebSocket으로 1일치 데이터를 0.1초마다 전송
- **데이터 압축** 1개월(30일) → 30초 재생 (1일 = 1초)

---

### 4. 블러 차트 미리보기 (2년마다)

**UI 예시**

```
┌─────────────────────────────────────────┐
│  🎁 2012년 블러 차트 획득!              │
├─────────────────────────────────────────┤
│  [A 엔터] 1년 추세 미리보기             │
│                                         │
│      📊 블러 처리된 차트                 │
│                                         │
│   30,000 ┤    ░░░░                     │
│   25,000 ┤  ░░    ░░                   │
│   20,000 ┤░░        ░░                 │
│   15,000 ┴─────────────────────────     │
│         1월  3월  6월  9월  12월       │
│                                         │
│  💡 전반적으로 상승 추세가 보입니다     │
└─────────────────────────────────────────┘
```

**구현 방법**

```typescript
// Canvas 블러 효과
function applyBlurEffect(chart: HTMLCanvasElement) {
  const ctx = chart.getContext('2d');
  ctx.filter = 'blur(8px)'; // 블러 강도 조절
  // 추세선만 남기고 세부 데이터는 숨김
}
```

---

### 5. 포트폴리오 & 거래 시스템

**UI 레이아웃**

```
┌─────────────────────────────────────────┐
│  📊 내 포트폴리오 (2010년 6월)          │
├─────────────────────────────────────────┤
│  💰 현금 50,000,000원                  │
│  📈 주식 60,000,000원                  │
│  💎 총자산 110,000,000원 (+10%)        │
├─────────────────────────────────────────┤
│  보유 종목                               │
│  ┌──────────────────────────────────┐   │
│  │ A 엔터   50주   +15%   10,000,000│   │
│  │ C IT     10주   +20%   12,000,000│   │
│  │ E 바이오 100주  -5%    4,750,000 │   │
│  └──────────────────────────────────┘   │
│                                         │
│  [매수] [매도] [포트폴리오 분석]        │
└─────────────────────────────────────────┘
```

**거래 프로세스**

```typescript
// 매수 흐름
function buyStock(stockCode: string, quantity: number) {
  const currentPrice = getRealtimePrice(stockCode);
  const totalCost = currentPrice * quantity;

  if (userCash < totalCost) {
    alert('잔액 부족');
    return;
  }

  // 거래 체결
  updatePortfolio({
    cash: userCash - totalCost,
    stocks: [
      ...userStocks,
      { code: stockCode, quantity, buyPrice: currentPrice },
    ],
  });

  // Realtime 동기화
  supabase.channel(`portfolio_${userId}`).send({
    type: 'BUY',
    payload: { stockCode, quantity, price: currentPrice },
  });
}
```

---

### 6. 랭킹 시스템

**랭킹 화면**

```
┌─────────────────────────────────────────┐
│  🏆 전체 랭킹 (2024년 12월 기준)        │
├─────────────────────────────────────────┤
│  순위  닉네임      최종자산    수익률   │
│  ──────────────────────────────────────  │
│  🥇 1   워렌버핏   850억원     +84900%  │
│  🥈 2   주식왕     420억원     +41900%  │
│  🥉 3   투자천재   310억원     +30900%  │
│   4   당신       250억원     +24900%  │
│   5   개미탈출    180억원     +17900%  │
├─────────────────────────────────────────┤
│  [연도별 랭킹] [수익률 분석]            │
└─────────────────────────────────────────┘
```

**구현**

```typescript
// Supabase에서 실시간 랭킹 조회
const { data: rankings } = await supabase
  .from('rankings')
  .select('*')
  .order('final_asset', { ascending: false })
  .limit(100);
```

---

### 7. 게임 튜토리얼

**온보딩 플로우**

```
[화면 1] 게임 소개
"과거로 돌아가 주식 투자를 해보세요!"

[화면 2] 종목 설명
"10개의 익명 종목이 제공됩니다. 이름은 게임 종료 후 공개!"

[화면 3] 힌트 시스템
"매년 1월, 퀴즈를 풀어 힌트를 획득하세요!"

[화면 4] 투자 방법
"차트를 보고 매수/매도 타이밍을 잡으세요"

[화면 5] 블러 차트
"2년마다 1년치 추세를 미리 볼 수 있어요"

[화면 6] 연말 결산
"12월 31일까지 투자를 완료하세요"

[시작하기]
```

---

## 🛠 기술 스택

### Frontend

- **프레임워크** React 18.2 + TypeScript 5.0 + Vite 4.0
- **상태 관리**
  - Zustand 4.4 (게임 상태, 포트폴리오)
  - TanStack Query 5.0 (서버 데이터 캐싱)
- **차트** Lightweight Charts 4.0 (TradingView 공식 라이브러리)
- **실시간 통신** Supabase Realtime (WebSocket 기반)
- **스타일링** Emotion 11.11 (CSS-in-JS)
- **애니메이션** Framer Motion 10.0
- **라우팅** React Router DOM 6.20

### Backend (BaaS)

- **Supabase**
  - Database PostgreSQL 15
  - Realtime WebSocket 주가 스트리밍
  - Auth 소셜 로그인 (Google, Kakao)
  - Storage 뉴스 이미지, 차트 캐시
  - Edge Functions Deno 기반 API

### 데이터 소스

- **한국 주식 데이터**
  - KRX (한국거래소) 공개 API
  - 또는 FinanceDataReader (Python 라이브러리로 수집)
  - 2010-2024년 일별 OHLCV 데이터

### DevOps

- **배포** Vercel (자동 배포)
- **모니터링** Sentry (에러 추적)
- **테스트** Playwright (E2E), Jest (단위)

---

## 🎨 MVP (Minimum Viable Product)

### Phase 1 핵심 게임 루프 (3주)

**Week 1-2 기본 게임 시스템**

- [ ] 10개 익명 종목 데이터 로딩 (2010년 시작)
- [ ] 1개 종목 실시간 차트 렌더링
- [ ] 시간 흐름 제어 (재생/일시정지/속도 조절)
- [ ] 매수/매도 기본 기능
- [ ] 포트폴리오 표시 (현금, 주식, 총자산)
- [ ] 연말 자동 결산 (12월 31일 → 다음 해 1월)

**Week 3 힌트 시스템**

- [ ] 1월 퀴즈 UI
- [ ] 퀴즈 채점 및 힌트 표시
- [ ] 광고 시청 기능 (또는 버튼 클릭으로 대체)
- [ ] 레벨1/2 힌트 DB 구축 (2010-2024)

**산출물**

- 1개 종목으로 2010-2024 플레이 가능
- 매년 1월 힌트 획득 가능
- 연말 자동 결산 및 시드머니 이월

---

### Phase 2 멀티 종목 & 블러 차트 (2주)

**Week 4 멀티 종목**

- [ ] 10개 종목 차트 동시 표시 (탭 전환)
- [ ] 종목 비교 기능 (최대 3개)
- [ ] 종목 검색 (카테고리별 필터)
- [ ] 거래 내역 히스토리

**Week 5 블러 차트**

- [ ] 2년마다 블러 차트 이벤트
- [ ] Canvas 블러 효과 구현
- [ ] 블러 차트 저장 및 재확인 기능

**산출물**

- 10개 종목 완전 구현
- 블러 차트 미리보기 기능

---

### Phase 3 랭킹 & 완성도 (1주)

**Week 6 랭킹 & 마무리**

- [ ] 랭킹 시스템 (실시간 업데이트)
- [ ] 게임 종료 후 종목명 공개
- [ ] 투자 히스토리 리플레이
- [ ] 튜토리얼 구현
- [ ] 반응형 디자인
- [ ] E2E 테스트

**산출물**

- 완성된 게임 (Vercel 배포)
- 랭킹 시스템 작동

---

## 📅 상세 스프린트 계획 (총 6주)

### Sprint 1 데이터 수집 & 차트 엔진 (1주)

#### 목표

한국 주식 10개 종목의 2010-2024 데이터 수집 및 실시간 차트 렌더링

#### FE 작업

- [ ] Vite + React + TypeScript 프로젝트 셋업
- [ ] Lightweight Charts 통합
- [ ] 목업 데이터로 1개 종목 차트 렌더링
- [ ] 시간 흐름 제어 UI (재생/일시정지/1x/2x/5x)
- [ ] Zustand 스토어 설계

  ```typescript
  // stores/gameStore.ts
  interface GameState {
    currentYear: number;
    currentMonth: number;
    currentDay: number;
    playSpeed: 1 | 2 | 5;
    isPlaying: boolean;
  }

  // stores/portfolioStore.ts
  interface PortfolioState {
    cash: number;
    stocks: { code: string; quantity: number; buyPrice: number }[];
    totalAsset: number;
  }
  ```

#### BE 작업

- [ ] Supabase 프로젝트 생성
- [ ] DB 스키마 설계

  ```sql
  -- stocks 테이블 (종목 정보)
  CREATE TABLE stocks (
    code TEXT PRIMARY KEY,         -- 'A', 'B', 'C'...
    category TEXT NOT NULL,        -- '엔터', 'IT'...
    real_name TEXT NOT NULL,       -- 실제 기업명 (암호화)
    initial_price INTEGER NOT NULL -- 2010년 1월 1일 가격
  );

  -- stock_prices 테이블 (일별 주가)
  CREATE TABLE stock_prices (
    id BIGSERIAL PRIMARY KEY,
    stock_code TEXT REFERENCES stocks(code),
    date DATE NOT NULL,
    open_price INTEGER NOT NULL,
    high_price INTEGER NOT NULL,
    low_price INTEGER NOT NULL,
    close_price INTEGER NOT NULL,
    volume BIGINT NOT NULL
  );
  CREATE INDEX idx_stock_date ON stock_prices(stock_code, date);

  -- users 테이블
  CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    nickname TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );

  -- game_progress 테이블 (게임 진행 상황)
  CREATE TABLE game_progress (
    user_id UUID REFERENCES users(id),
    current_year INTEGER NOT NULL,
    current_month INTEGER NOT NULL,
    seed_money BIGINT NOT NULL,
    PRIMARY KEY (user_id)
  );

  -- portfolios 테이블 (포트폴리오)
  CREATE TABLE portfolios (
    user_id UUID REFERENCES users(id),
    stock_code TEXT REFERENCES stocks(code),
    quantity INTEGER NOT NULL,
    avg_buy_price INTEGER NOT NULL,
    PRIMARY KEY (user_id, stock_code)
  );

  -- transactions 테이블 (거래 내역)
  CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    stock_code TEXT REFERENCES stocks(code),
    type TEXT NOT NULL,           -- 'BUY' or 'SELL'
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    trade_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );
  ```

- [ ] 한국 주식 10개 종목 데이터 수집

  ```python
  # data_collection.py
  import FinanceDataReader as fdr
  import pandas as pd

  stocks = {
      'A': '035420',  # 네이버 (IT)
      'B': '035720',  # 카카오 (IT)
      'C': '005930',  # 삼성전자 (IT)
      # ... 7개 더
  }

  for code, krx_code in stocks.items():
      df = fdr.DataReader(krx_code, '2010-01-01', '2024-12-31')
      # Supabase에 적재
  ```

- [ ] Supabase Auth 설정

#### 산출물

- DB ERD 문서
- 10개 종목 데이터 적재 완료
- 1개 종목 실시간 차트 동작

---

### Sprint 2 매매 시스템 & 연도 사이클 (1.5주)

#### 목표

매수/매도 기능 및 연도별 자동 이월 시스템

#### FE 작업

- [ ] 매수/매도 모달 UI
  ```tsx
  <BuyModal
    stockCode="A"
    currentPrice={21500}
    maxQuantity={calculateMaxQuantity(cash, price)}
    onBuy={(quantity) => executeBuy('A', quantity)}
  />
  ```
- [ ] 포트폴리오 대시보드
- [ ] 실시간 수익률 계산
  ```typescript
  function calculateReturn(portfolio: Portfolio) {
    const stockValue = portfolio.stocks.reduce((sum, stock) => {
      const currentPrice = getRealtimePrice(stock.code);
      return sum + stock.quantity * currentPrice;
    }, 0);
    return {
      totalAsset: portfolio.cash + stockValue,
      returnRate: (stockValue / initialInvestment - 1) * 100,
    };
  }
  ```
- [ ] 12월 31일 자동 결산 로직

  ```typescript
  function handleYearEnd() {
    // 1. 모든 보유 주식 강제 매도
    const allStocks = portfolio.stocks;
    allStocks.forEach((stock) => {
      const price = getPrice(stock.code, '2010-12-31');
      sellStock(stock.code, stock.quantity, price);
    });

    // 2. 최종 자산 계산
    const finalAsset = portfolio.cash;

    // 3. 다음 해로 이월
    startNewYear(2011, finalAsset);
  }
  ```

#### BE 작업

- [ ] 거래 API (Edge Functions)

  ```typescript
  // supabase/functions/trade-buy/index.ts
  export async function buyStock(req: Request) {
    const { userId, stockCode, quantity, price } = await req.json();

    // 1. 잔액 확인
    const user = await getUserPortfolio(userId);
    if (user.cash < quantity * price) {
      return new Response('Insufficient funds', { status: 400 });
    }

    // 2. 거래 체결
    await supabase.from('portfolios').upsert({
      user_id: userId,
      stock_code: stockCode,
      quantity: quantity,
      avg_buy_price: price,
    });

    // 3. 현금 차감
    await updateUserCash(userId, user.cash - quantity * price);

    // 4. 거래 내역 저장
    await saveTransaction(userId, stockCode, 'BUY', quantity, price);

    return new Response('Success', { status: 200 });
  }
  ```

- [ ] 실시간 주가 스트리밍 Edge Function

  ```typescript
  // supabase/functions/stream-price/index.ts
  export async function streamStockPrice(userId: string, year: number) {
    const channel = supabase.channel(`price_${userId}`);

    // 1일치 데이터를 1초에 하나씩 전송
    for (let day = 1; day <= 365; day++) {
      const prices = await getStockPrices(year, day);
      channel.send({
        type: 'PRICE_UPDATE',
        payload: prices,
      });
      await sleep(1000 / playSpeed); // 속도 조절
    }
  }
  ```

#### 산출물

- 매매 기능 완성
- 연도 자동 이월 시스템

---

### Sprint 3 힌트 시스템 (1주)

#### 목표

1월 퀴즈 및 힌트 획득 시스템

#### FE 작업

- [ ] 1월 진입 시 퀴즈 모달 표시

  ```tsx
  <QuizModal
    year={2010}
    questions={[
      {
        q: '2010년 한국에서 개최된 국제 행사는?',
        options: ['올림픽', 'G20', '월드컵', '아시안게임'],
        answer: 1,
      },
      // ... 2문제 더
    ]}
    onComplete={(score) => {
      if (score >= 3) showHint('level2');
      else if (score >= 1) showHint('level1');
    }}
  />
  ```

- [ ] 광고 시청 버튼 (또는 타이머)

  ```tsx
  <AdButton
    onClick={() => {
      playAd(30); // 30초
      onAdComplete(() => showHint('level1'));
    }}
  />
  ```

- [ ] 힌트 표시 UI
  ```tsx
  <HintBox level={2}>
    <h3>2010년 경제 힌트 (레벨 2)</h3>
    <p>G20 정상회의 개최로 IT 인프라 투자가 급증했습니다.</p>
    <p>삼성, LG 등 대형 IT 기업들이 큰 성장을 이뤘습니다.</p>
  </HintBox>
  ```

#### BE 작업

- [ ] 퀴즈 DB 구축

  ```sql
  CREATE TABLE yearly_quizzes (
    year INTEGER PRIMARY KEY,
    questions JSONB NOT NULL, -- 3개 문제
    level1_hint TEXT NOT NULL,
    level2_hint TEXT NOT NULL
  );

  -- 예시 데이터
  INSERT INTO yearly_quizzes VALUES (
    2010,
    '[
      {
        "question": "2010년 한국에서 개최된 국제 행사는?",
        "options": ["올림픽", "G20", "월드컵", "아시안게임"],
        "answer": 1
      },
      ...
    ]',
    '이 해 글로벌 경제 회복에 대한 기대감이 높았습니다.',
    'G20 정상회의 개최로 IT 인프라 투자가 급증했습니다.'
  );
  ```

#### 산출물

- 퀴즈 시스템 완성
- 레벨별 힌트 표시

---

### Sprint 4 멀티 종목 & 블러 차트 (1.5주)

#### 목표

10개 종목 차트 및 블러 미리보기

#### FE 작업

- [ ] 종목 탭 전환 UI

  ```tsx
  <StockTabs>
    {stocks.map(stock => (
      <Tab key={stock.code} onClick={() => setActiveStock(stock.code)}>
        {stock.code} {stock.category}
      </Tab>
    ))}
  </StockTabs>
  <Chart stockCode={activeStock} />
  ```

- [ ] 종목 비교 (최대 3개)

  ```tsx
  <CompareChart stocks={['A', 'C', 'E']} />
  ```

- [ ] 블러 차트 구현

  ```typescript
  function BlurChart({ stockCode, year }: Props) {
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      const ctx = canvas.current?.getContext('2d');
      if (!ctx) return;

      // 1년치 데이터 로드
      const prices = await fetchPrices(stockCode, year);

      // 차트 그리기
      drawChart(ctx, prices);

      // 블러 효과 적용
      ctx.filter = 'blur(10px)';
    }, [stockCode, year]);

    return <canvas ref={canvas} />;
  }
  ```

#### BE 작업

- [ ] 블러 차트 이벤트 데이터

  ```sql
  CREATE TABLE blur_events (
    year INTEGER PRIMARY KEY,
    description TEXT
  );

  INSERT INTO blur_events VALUES
    (2012, '블러 차트로 2012년 추세를 미리 확인하세요!'),
    (2014, '블러 차트로 2014년 추세를 미리 확인하세요!'),
    ...;
  ```

#### 산출물

- 10개 종목 완전 구현
- 블러 차트 기능

---

### Sprint 5 랭킹 & 게임 종료 (1주)

#### 목표

랭킹 시스템 및 종목명 공개

#### FE 작업

- [ ] 랭킹 페이지

  ```tsx
  <RankingPage>
    <RankingTable>
      {rankings.map((user, idx) => (
        <RankingRow rank={idx + 1} user={user} />
      ))}
    </RankingTable>
  </RankingPage>
  ```

- [ ] 게임 종료 화면

  ```tsx
  <GameEndScreen>
    <h1>축하합니다! 15년 투자 완주!</h1>
    <FinalScore>최종 자산: 250억원 (+24900%)</FinalScore>
    <StockReveal>
      <p>A 엔터 = 삼성전자</p>
      <p>B 엔터 = 카카오</p>
      ...
    </StockReveal>
    <ReplayButton />
  </GameEndScreen>
  ```

- [ ] 투자 히스토리 리플레이
  ```tsx
  <HistoryReplay>
    <Timeline years={[2010, 2011, ..., 2024]}>
      {years.map(year => (
        <YearCard
          year={year}
          trades={getTradesByYear(year)}
          return={getReturnByYear(year)}
        />
      ))}
    </Timeline>
  </HistoryReplay>
  ```

#### BE 작업

- [ ] 랭킹 API

  ```typescript
  export async function getRankings() {
    const { data } = await supabase
      .from('game_progress')
      .select('user_id, users(nickname), seed_money')
      .order('seed_money', { ascending: false })
      .limit(100);

    return data.map((row, idx) => ({
      rank: idx + 1,
      nickname: row.users.nickname,
      finalAsset: row.seed_money,
      returnRate: (row.seed_money / 100_000_000 - 1) * 100,
    }));
  }
  ```

- [ ] 종목명 복호화 로직

  ```typescript
  export async function revealStockNames(userId: string) {
    // 게임 완료 확인
    const progress = await getUserProgress(userId);
    if (progress.current_year < 2024) {
      return new Response('Game not completed', { status: 403 });
    }

    // 종목명 공개
    const stocks = await supabase
      .from('stocks')
      .select('code, real_name')
      .order('code');

    return stocks;
  }
  ```

#### 산출물

- 랭킹 시스템
- 게임 종료 화면
- 종목명 공개

---

## 🎯 기대 효과

### 기술적 학습

- **실시간 통신**: WebSocket 기반 데이터 스트리밍 구현 경험
- **금융 차트**: 시계열 데이터 시각화 및 최적화 기술 습득
- **복잡한 상태 관리**: 게임 진행, 포트폴리오, 거래 내역 등 다층 상태 관리
- **대용량 데이터 처리**: 15년치 일별 주가 데이터 효율적 처리
- **BaaS 활용**: Supabase를 활용한 빠른 백엔드 구축 경험

주식, 차트, 포트폴리오 등 금융 용어와 개념 이해하고 다소 복잡하게 느껴질 수 있는 금융 서비스를 재미있게 만들어 보고자함.

---

# Sketch

## 📌 프로젝트 소개

**"원격 팀원들과 실시간으로 함께 그리며 소통하는 무한 캔버스"**

여러 사용자가 동시에 같은 캔버스에 접속하여 도형을 그리고, 텍스트를 입력하며, 실시간으로 아이디어를 시각화할 수 있는 **실시간 협업 화이트보드** 서비스입니다.

---

## 🎯 프로젝트 목적

**"왜 만드는가?"**

이 프로젝트는 **"간편하면서도 강력한 실시간 협업"**을 목표로, 누구나 쉽게 접속해서 함께 그림을 그리고 아이디어를 정리할 수 있는 도구를 만들고자 합니다. 동시에 CRDT(Conflict-free Replicated Data Type) 알고리즘 학습, Canvas API를 활용한 고성능 렌더링, 그리고 다중 사용자 동시성 제어 등 핀테크를 포함한 모든 실시간 서비스에 필요한 핵심 기술을 경험하고자 합니다. 또한 웹에서의 동작 뿐만 아니라 태블릿의 터치 펜슬등에도 부드럽게 대응할 수 있도록 합니다.

---

## 🔍 기존 서비스 분석

### Excalidraw 핵심 기능 분석

**1. 손그림 스타일 렌더링**

- **특징** 모든 도형이 손으로 그린 것처럼 자연스러운 선으로 표현
- **구현** rough.js 라이브러리 사용
- **적용 여부** ✅ 적용 (차별화 포인트)

**2. 간단한 도형 도구**

- 사각형, 원, 다이아몬드, 화살표, 선, 자유 곡선, 텍스트
- **적용 여부** ✅ 적용 (기본 도형 세트)

**3. 다중 선택 및 그룹화**

- Shift + 클릭으로 여러 도형 선택
- Ctrl + G로 그룹화
- **적용 여부** ✅ 적용

**4. 라이브러리 (템플릿)**

- 자주 사용하는 도형을 저장해두고 재사용
- **적용 여부** 🔺 Phase 2에서 추가

**5. 협업 기능**

- 실시간 커서 공유
- 다른 사용자가 선택한 도형 하이라이트
- **적용 여부** ✅ 적용 (핵심 기능)

---

### FigJam 핵심 기능 분석

**1. 스티커 노트**

- 다양한 색상의 포스트잇
- **적용 여부** ✅ 적용 (텍스트 박스로 구현)

**2. 이모지 및 스탬프**

- 빠른 피드백을 위한 이모지 반응
- **적용 여부** 🔺 Phase 2에서 추가

**3. 타이머 및 투표**

- 회의 진행을 위한 도구들
- **적용 여부** ❌ 제외 (범위 축소)

**4. 음성/비디오 채팅**

- 캔버스 내에서 바로 통화 가능
- **적용 여부** 🔺 Phase 3 (선택적)

**5. AI 자동 정리**

- AI가 브레인스토밍 내용을 요약
- **적용 여부** ❌ 제외 (범위 축소)

---

### Figma 핵심 기능 분석

**1. 벡터 편집 도구**

- 펜 도구, 패스 편집, 불린 연산
- **적용 여부** ❌ 제외 (너무 복잡)

**2. 컴포넌트 시스템**

- 재사용 가능한 UI 컴포넌트
- **적용 여부** 🔺 Phase 3 (템플릿으로 단순화)

**3. 프로토타이핑**

- 화면 간 인터랙션 정의
- **적용 여부** ❌ 제외

**4. 플러그인 생태계**

- 서드파티 플러그인 지원
- **적용 여부** ❌ MVP에서 제외

**5. 실시간 협업 (최우선 벤치마크)**

- 여러 명이 동시에 작업 가능
- 각자의 커서가 보임
- 충돌 없이 자동 병합
- **적용 여부** ✅ 최우선 적용 (핵심 목표)

---

## ✨ 구현할 핵심 기능

### 1. 무한 캔버스 시스템

**기능 설명**

- 사용자는 상하좌우 어디로든 자유롭게 이동 가능
- 마우스 휠로 확대/축소
- 미니맵으로 전체 구조 파악

**구현 스케치**

```typescript
// Canvas 좌표 변환
interface Viewport {
  x: number; // 캔버스 중심 X 좌표
  y: number; // 캔버스 중심 Y 좌표
  zoom: number; // 확대 비율 (0.1 ~ 5.0)
}

function screenToCanvas(screenX: number, screenY: number, viewport: Viewport) {
  return {
    x: (screenX - window.innerWidth / 2) / viewport.zoom + viewport.x,
    y: (screenY - window.innerHeight / 2) / viewport.zoom + viewport.y,
  };
}

// 팬 기능
function handleMouseDrag(dx: number, dy: number) {
  viewport.x -= dx / viewport.zoom;
  viewport.y -= dy / viewport.zoom;
  redrawCanvas();
}

// 줌 기능
function handleWheel(delta: number) {
  const zoomSpeed = 0.001;
  viewport.zoom *= 1 - delta * zoomSpeed;
  viewport.zoom = Math.max(0.1, Math.min(5.0, viewport.zoom));
  redrawCanvas();
}
```

---

### 2. 도형 그리기 도구

**구현할 도형**

1. **사각형** (기본 도형)
2. **원** (기본 도형)
3. **삼각형** (기본 도형)
4. **다이아몬드** (Excalidraw 스타일)
5. **선** (연결선)
6. **화살표** (단방향/양방향)
7. **자유 곡선** (펜 도구)
8. **텍스트 박스** (스티커 노트)

**구현 스케치 (사각형 예시)**

```typescript
// 도형 데이터 구조
interface Shape {
  id: string;
  type: 'rectangle' | 'circle' | 'arrow' | 'text' | ...;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  roughness: number; // 손그림 느낌 강도 (0~10)
}

// React-Konva로 사각형 그리기
function Rectangle({ shape }: { shape: Shape }) {
  return (
    <Rect
      x={shape.x}
      y={shape.y}
      width={shape.width}
      height={shape.height}
      fill={shape.fill}
      stroke={shape.stroke}
      strokeWidth={shape.strokeWidth}
      draggable
      onClick={() => selectShape(shape.id)}
    />
  );
}

// 사각형 그리기 모드
function startDrawingRectangle(startX: number, startY: number) {
  const newShape: Shape = {
    id: generateId(),
    type: 'rectangle',
    x: startX,
    y: startY,
    width: 0,
    height: 0,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 2,
    roughness: 2 // rough.js 효과
  };

  addShape(newShape);
  setDrawingShape(newShape.id);
}

function updateDrawingRectangle(currentX: number, currentY: number) {
  const shape = getShape(drawingShapeId);
  shape.width = currentX - shape.x;
  shape.height = currentY - shape.y;
  updateShape(shape);
}
```

**손그림 스타일 (rough.js)**

```typescript
import rough from 'roughjs';

function drawRoughRectangle(ctx: CanvasRenderingContext2D, shape: Shape) {
  const rc = rough.canvas(ctx.canvas);

  rc.rectangle(shape.x, shape.y, shape.width, shape.height, {
    fill: shape.fill,
    stroke: shape.stroke,
    strokeWidth: shape.strokeWidth,
    roughness: shape.roughness, // 손그림 느낌
    bowing: 1, // 선 휘어짐
  });
}
```

---

### 3. 실시간 협업 엔진 (CRDT)

**기능 설명**

- 여러 사용자가 동시에 도형을 추가/수정/삭제 가능
- 충돌 발생 시 자동으로 병합 (Last Write Wins 또는 CRDT)
- 각 사용자의 커서 위치를 실시간으로 표시

**구현 스케치 (Liveblocks)**

```typescript
// Liveblocks Provider 설정
import { LiveblocksProvider, RoomProvider } from '@liveblocks/react';

function App() {
  return (
    <LiveblocksProvider publicApiKey="pk_...">
      <RoomProvider id={roomId}>
        <Canvas />
      </RoomProvider>
    </LiveblocksProvider>
  );
}

// 공유 상태 (Liveblocks Storage)
import { useMutation, useStorage } from '@liveblocks/react';

function Canvas() {
  // 모든 도형을 Liveblocks에 저장
  const shapes = useStorage((root) => root.shapes);

  // 도형 추가 (자동 동기화)
  const addShape = useMutation(({ storage }, shape: Shape) => {
    storage.get('shapes').push(shape);
  }, []);

  // 도형 수정 (자동 동기화)
  const updateShape = useMutation(({ storage }, id: string, updates: Partial<Shape>) => {
    const shapes = storage.get('shapes');
    const shape = shapes.find(s => s.id === id);
    if (shape) {
      Object.assign(shape, updates);
    }
  }, []);

  return (
    <Stage>
      <Layer>
        {shapes.map(shape => (
          <Shape key={shape.id} data={shape} />
        ))}
      </Layer>
    </Stage>
  );
}
```

**실시간 커서 공유**

```typescript
import { useMyPresence, useOthers } from '@liveblocks/react';

function Cursors() {
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();

  // 내 커서 위치 브로드캐스트
  function handleMouseMove(e: MouseEvent) {
    const { x, y } = screenToCanvas(e.clientX, e.clientY, viewport);
    updateMyPresence({ cursor: { x, y } });
  }

  // 다른 사용자 커서 렌더링
  return (
    <>
      {others.map(user => (
        <Cursor
          key={user.id}
          x={user.presence.cursor.x}
          y={user.presence.cursor.y}
          name={user.info.name}
          color={user.info.color}
        />
      ))}
    </>
  );
}

// 커서 컴포넌트
function Cursor({ x, y, name, color }: CursorProps) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 커서 아이콘 */}
      <path d="M0,0 L0,20 L5,15 L10,25 L13,23 L8,13 L15,13 Z" fill={color} />
      {/* 이름 표시 */}
      <text x={20} y={5} fill={color} fontSize={12}>
        {name}
      </text>
    </g>
  );
}
```

---

### 4. 선택 및 변형 도구

**기능**

- 클릭으로 도형 선택
- 핸들 드래그로 크기 조절
- 회전 핸들로 회전
- 다중 선택 (Shift + 클릭)
- 그룹화 (Ctrl + G)

**구현 스케치**

```typescript
import { Transformer } from 'react-konva';

function SelectablShape({ shape }: { shape: Shape }) {
  const shapeRef = useRef<Konva.Shape>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const isSelected = useSelectedShapes().includes(shape.id);

  useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Rect
        ref={shapeRef}
        {...shape}
        draggable
        onClick={() => selectShape(shape.id)}
        onDragEnd={(e) => {
          updateShape(shape.id, {
            x: e.target.x(),
            y: e.target.y()
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          updateShape(shape.id, {
            x: node.x(),
            y: node.y(),
            width: node.width() * node.scaleX(),
            height: node.height() * node.scaleY(),
            rotation: node.rotation()
          });
        }}
      />
      {isSelected && <Transformer ref={transformerRef} />}
    </>
  );
}
```

---

### 5. 저장 및 공유

**기능**

1. **자동 저장**: 변경사항이 Liveblocks에 자동 저장
2. **내보내기**: PNG, SVG, JSON 형식으로 다운로드
3. **공유 링크**: URL 공유로 즉시 협업 가능
4. **권한 관리**: 읽기 전용 / 편집 가능 링크 생성

**구현 스케치**

```typescript
// PNG 내보내기
function exportToPNG() {
  const stage = stageRef.current;
  const dataURL = stage.toDataURL({ pixelRatio: 2 });

  const link = document.createElement('a');
  link.download = 'liveboard.png';
  link.href = dataURL;
  link.click();
}

// 공유 링크 생성
function createShareLink(permission: 'read' | 'edit') {
  const roomId = generateRoomId();
  const url = `${window.location.origin}/board/${roomId}?permission=${permission}`;

  navigator.clipboard.writeText(url);
  toast.success('링크가 복사되었습니다!');
}
```

---

### 6. 추가 기능

**① 댓글 시스템**

```typescript
// 도형에 댓글 달기
interface Comment {
  id: string;
  shapeId: string;
  userId: string;
  userName: string;
  text: string;
  x: number; // 댓글 위치
  y: number;
  createdAt: Date;
}

function CommentMarker({ comment }: { comment: Comment }) {
  return (
    <Circle
      x={comment.x}
      y={comment.y}
      radius={10}
      fill="#ff6b6b"
      onClick={() => openCommentThread(comment.id)}
    />
  );
}
```

**② 템플릿 라이브러리**

```typescript
// 자주 사용하는 다이어그램 템플릿
const templates = [
  {
    id: 'flowchart',
    name: '플로우차트',
    thumbnail: '/templates/flowchart.png',
    shapes: [ /* 미리 정의된 도형들 */ ]
  },
  {
    id: 'mindmap',
    name: '마인드맵',
    thumbnail: '/templates/mindmap.png',
    shapes: [ /* ... */ ]
  }
];

function TemplateGallery() {
  return (
    <div>
      {templates.map(template => (
        <TemplateCard
          key={template.id}
          template={template}
          onClick={() => loadTemplate(template)}
        />
      ))}
    </div>
  );
}
```

**③ 실행 취소/다시 실행**

```typescript
// Liveblocks History API 사용
import { useHistory } from '@liveblocks/react';

function UndoRedo() {
  const { undo, redo, canUndo, canRedo } = useHistory();

  return (
    <>
      <button onClick={undo} disabled={!canUndo}>
        ⏪ 실행 취소
      </button>
      <button onClick={redo} disabled={!canRedo}>
        ⏩ 다시 실행
      </button>
    </>
  );
}
```

---

## 🛠 기술 스택

### Frontend

- **프레임워크** React 18.2 + TypeScript 5.0 + Vite 4.0
- **상태 관리**
  - Zustand 4.4 (로컬 UI 상태)
  - Liveblocks 1.8 (공유 캔버스 상태)
- **캔버스 렌더링**
  - React-Konva 18.2 (Canvas 추상화 레이어)
  - rough.js 4.6 (손그림 스타일)
- **스타일링** Emotion 11.11
- **라우팅** React Router DOM 6.20

### Backend (BaaS)

- **Liveblocks** (추천)

  - Realtime Collaboration (CRDT 기반)
  - Presence API (커서, 온라인 상태)
  - Storage API (영구 저장)
  - 무료 플랜 100 MAU (Monthly Active Users)

- **대안 Supabase**
  - Realtime (WebSocket)
  - Storage (이미지 저장)
  - Auth (로그인)

### DevOps

- **배포** Vercel
- **모니터링** Sentry
- **테스트** Playwright

---

## 🎨 MVP

### Phase 1 기본 캔버스 (1.5주)

- [ ] 무한 캔버스 (팬/줌)
- [ ] 사각형, 원, 선 그리기
- [ ] 도형 선택 및 이동
- [ ] 색상/스타일 변경
- [ ] 로컬 저장 (LocalStorage)

### Phase 2 실시간 협업 (1.5주)

- [ ] Liveblocks 통합
- [ ] 실시간 도형 동기화
- [ ] 커서 공유
- [ ] 온라인 사용자 목록
- [ ] 충돌 해결 테스트

### Phase 3 완성도 (1주)

- [ ] 텍스트, 화살표, 자유 곡선
- [ ] PNG 내보내기
- [ ] 공유 링크 생성
- [ ] 튜토리얼

---

## 📅 스프린트 계획 (총 4주)

### Sprint 1 캔버스 엔진 (1.5주)

**목표** 로컬 화이트보드 완성

**FE 작업**

- [ ] React-Konva 셋업
- [ ] 무한 캔버스 구현
- [ ] 팬/줌 기능
- [ ] 사각형/원 그리기
- [ ] 선택 및 이동
- [ ] Transformer (크기/회전)
- [ ] 스타일 패널

**산출물** 로컬 화이트보드

---

### Sprint 2 실시간 협업 (1.5주)

**목표** 멀티플레이어 동기화

**FE 작업**

- [ ] Liveblocks Provider 설정
- [ ] LiveList로 도형 상태 관리
- [ ] 실시간 CRUD 테스트
- [ ] Presence API 커서 공유
- [ ] 온라인 사용자 아바타
- [ ] 충돌 해결 시나리오 테스트

**산출물** 2명 이상 협업 가능

---

### Sprint 3 고급 기능 (1주)

**목표** 실용성 향상

**FE 작업**

- [ ] 텍스트 도구
- [ ] 자유 곡선 (perfect-freehand)
- [ ] 화살표
- [ ] 그룹화
- [ ] Undo/Redo
- [ ] PNG 내보내기
- [ ] 공유 링크 UI

**산출물** MVP 완성

---

## 🎯 기대 효과

### 기술적 학습

- **CRDT 알고리즘**: 분산 시스템 충돌 해결
- **Canvas API**: 고성능 그래픽 렌더링
- **실시간 아키텍처**: WebSocket 기반 동기화
- **동시성 제어**: 다중 사용자 환경 데이터 정합성

---

## 📚 참고 자료

### Traders

- [Lightweight Charts](https://tradingview.github.io/lightweight-charts/)
- [FinanceDataReader](https://github.com/FinanceData/FinanceDataReader)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [KRX 한국거래소](http://data.krx.co.kr/)

### Sketch

- [Liveblocks](https://liveblocks.io/docs)
- [React-Konva](https://konvajs.org/docs/react/)
- [rough.js](https://roughjs.com/)
- [perfect-freehand](https://github.com/steveruizok/perfect-freehand)
- [Excalidraw 오픈소스](https://github.com/excalidraw/excalidraw)

---
