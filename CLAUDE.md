# CLAUDE.md

Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드 파일입니다.

## 📖 목차

1. [핵심 원칙](#핵심-원칙)
2. [프로젝트 개요](#프로젝트-개요)
3. [개발 명령어](#개발-명령어)
4. [기술 스택 & 아키텍처](#기술-스택--아키텍처)
5. [Claude Code 커스텀 커맨드](#claude-code-커스텀-커맨드)
6. [중요한 개발 규칙](#중요한-개발-규칙)
7. [코드 작성 가이드라인](#코드-작성-가이드라인)
8. [파일 구조 패턴](#파일-구조-패턴)

---

## 핵심 원칙

### ✅ 기본 규칙

- **모든 응답과 코멘트는 한국어로 작성**
- **코드 수정 시 기존 패턴과 규칙을 따라야 함**
- **타입 안전성을 최우선으로 고려**
- **pnpm을 패키지 매니저로 사용 (workspace 지원)**

### ✅ 작업 전후 필수 검증사항

#### 작업 전 확인사항

1. **린트 & 타입 검사**: `pnpm lint`, `pnpm type-check` 실행
2. **기존 컴포넌트 패턴**: 유사한 컴포넌트의 구조와 네이밍 확인
3. **Import 순서**: ESLint 설정에 따른 자동 정렬 순서 준수
4. **의존성 확인**: 새로운 라이브러리 사용 전 기존 사용 여부 확인

#### 작업 후 자동 검증 프로세스

1. **즉시 검증**: 파일 수정 직후 자동으로 lint → type-check → build 실행
2. **자동 수정 시도**: ESLint로 수정 가능한 오류는 `--fix` 옵션으로 자동 수정
3. **반복 검증**: 수정 후 재검증 (최대 3회까지 시도)
4. **에러 보고**: 자동 수정 불가능한 경우 명확한 에러 메시지와 해결 가이드 제공

---

## 프로젝트 개요

**Turborepo 모노레포** 구조의 React 웹 애플리케이션 프로젝트

```
claude_code/
├── apps/
│   ├── web/              # 메인 웹 애플리케이션 (Vite + React)
│   ├── devblog/          # 개발 블로그 (Next.js 15)
│   └── admin/            # 관리자 페이지
└── packages/
    ├── ui/               # UI 컴포넌트 라이브러리
    ├── apis/             # API 관련 유틸리티 및 React Query 설정
    ├── icon/             # SVG 아이콘 컴포넌트 라이브러리
    └── config/           # 설정 파일 통합 관리
        ├── eslint/       # 공유 ESLint 설정
        └── typescript/   # 공유 TypeScript 설정
```

### 패키지 의존성

- `apps/web` → `@cllaude99/ui`, `@cllaude99/apis`, `@cllaude99/icon` 사용
- `apps/devblog` → Next.js 기반 독립 실행형 블로그
- 모든 패키지 → `@cllaude99/eslint-config`, `@cllaude99/typescript-config` 공유

---

## 개발 명령어

### 루트 레벨 명령어 (pnpm)

```bash
pnpm dev          # 모든 패키지 개발 모드 실행
pnpm build        # 모든 패키지 빌드
pnpm lint         # 모든 패키지 린트 검사
pnpm type-check   # 모든 패키지 타입 검사
pnpm format       # Prettier로 코드 포매팅
```

### 웹 애플리케이션 (apps/web)

```bash
cd apps/web
pnpm dev          # 개발 서버 실행 (포트 3000)
pnpm build        # 프로덕션 빌드 (TypeScript 컴파일 + Vite 빌드)
pnpm preview      # 빌드된 애플리케이션 미리보기
pnpm lint         # ESLint 검사
pnpm type-check   # TypeScript 타입 검사
pnpm test         # 단위 테스트 실행 (Jest)
pnpm test:watch   # 테스트 감시 모드
pnpm test:coverage # 테스트 커버리지 확인
pnpm test:e2e     # E2E 테스트 실행 (Playwright)
pnpm test:e2e:ui  # E2E 테스트 UI 모드
```

### 개발 블로그 (apps/devblog)

```bash
cd apps/devblog
pnpm dev          # 개발 서버 실행 (포트 3001)
pnpm build        # 프로덕션 빌드 (Next.js)
pnpm start        # 프로덕션 서버 시작
pnpm lint         # ESLint 검사
pnpm type-check   # TypeScript 타입 검사
```

---

## 기술 스택 & 아키텍처

### 메인 웹 애플리케이션 (apps/web)

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Emotion (CSS-in-JS)
- **Routing**: React Router DOM v7
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios with interceptors
- **Animation**: Motion (Framer Motion)
- **Error Handling**: React Error Boundary
- **Testing**: Jest + Testing Library + Playwright

### 개발 블로그 (apps/devblog)

- **Framework**: Next.js 15 + TypeScript
- **Styling**: Tailwind CSS + @tailwindcss/typography
- **Theme**: next-themes (다크모드 지원)
- **Content**: Markdown + gray-matter + react-markdown
- **Syntax Highlighting**: rehype-highlight
- **Comments**: @giscus/react
- **Diagram**: Mermaid
- **Icons**: lucide-react, react-icons

### 아키텍처 패턴

- **디자인 시스템**: `breakpoints`, `palette`, `typography`, `theme` 모듈
- **인증**: JWT (Access Token + Refresh Token), localStorage 저장
- **API 에러 처리**: 402 상태 코드로 토큰 만료 처리, 자동 갱신
- **라우팅**: `PrivateRoute`, `PublicRoute`로 인증 기반 라우팅
- **컴포넌트**: Funnel Pattern (`useFunnel` 훅)으로 단계별 UI

### 디렉토리별 역할

- **`packages/ui`**: 재사용 가능한 UI 컴포넌트와 디자인 시스템
- **`packages/apis`**: API 호출, React Query 설정, HTTP 인터셉터
- **`packages/icon`**: SVG 기반 아이콘 컴포넌트 라이브러리
- **`packages/config`**: ESLint와 TypeScript 설정 통합 관리
- **`apps/web`**: 메인 웹 애플리케이션, UI와 API 패키지 조합
- **`apps/devblog`**: Next.js 15 기반 개발 블로그 (독립 실행형)
- **`apps/admin`**: 관리자 페이지 (개발 예정)

### 테스트 환경

- **단위 테스트**: Jest + Testing Library (React 컴포넌트, 훅, 유틸리티)
- **E2E 테스트**: Playwright (브라우저 자동화, 통합 테스트)
- **테스트 구조**: `src/test/unit/`, `src/test/e2e/` 폴더 분리
- **설정 파일**: `jest.config.js`, `playwright.config.ts`, `setupTests.ts`

---

## Claude Code 커스텀 커맨드

프로젝트에는 개발 워크플로우를 자동화하기 위한 Claude Code 커스텀 커맨드들이 `.claude/commands/` 디렉토리에 정의되어 있습니다.

### 사용 가능한 커맨드

#### /commit

스마트 커밋 메시지 생성 및 커밋 자동화

```bash
/commit
```

**주요 기능:**

- Git 변경사항 자동 분석 및 스테이징
- Conventional Commit 형식으로 메시지 자동 생성 (feat, fix, refactor, design, docs, test, chore)
- 한국어 커밋 메시지 생성
- 자동 커밋 실행

#### /pr

Pull Request 메시지 자동 생성

```bash
/pr
```

**주요 기능:**

- 현재 브랜치의 변경사항 분석
- PR 템플릿 기반 설명 자동 생성
- 체크리스트 및 테스트 계획 포함
- GitHub CLI 연동 (선택적)

#### /test

테스트 코드 자동 생성

```bash
/test <파일경로>
/test src/components/Button/index.tsx
/test src/hooks/useUser.ts
```

**주요 기능:**

- 지정된 파일 분석 후 단위 테스트 및 E2E 테스트 코드 생성
- Jest + Testing Library 기반 단위 테스트
- Playwright 기반 E2E 테스트
- 컴포넌트, 훅, 유틸리티 함수별 최적화된 테스트 패턴

**생성되는 테스트 구조:**

```
apps/web/src/test/
├── unit/                    # 단위 테스트
│   ├── components/
│   ├── hooks/
│   └── utils/
└── e2e/                     # E2E 테스트
    ├── components/
    └── flows/
```

#### /refactor

시니어 수준 리팩토링 자동화

```bash
/refactor <파일1> <파일2> ...
/refactor src/components/UserForm.tsx src/hooks/useUser.ts
```

**주요 기능:**

- 복잡한 컴포넌트를 단일 책임 원칙에 따라 분리
- 커스텀 훅으로 로직 추출
- Props Drilling 제거 및 컴포지션 패턴 적용
- 가독성, 예측가능성, 응집성, 결합도 개선
- Before/After 비교 및 개선사항 설명

**리팩토링 패턴:**

- 조건부 렌더링 → 별도 컴포넌트 분리
- 복잡한 상태 로직 → 커스텀 훅 추출
- 긴 컴포넌트 → 단일 책임 컴포넌트로 분할
- Props 전달 → 컴포지션 패턴 적용

### 커맨드 파일 구조

```
.claude/
├── commands/           # 커스텀 커맨드
│   ├── commit.md       # 커밋 자동화
│   ├── pr.md           # PR 생성
│   ├── test.md         # 테스트 코드 생성
│   └── refactor.md     # 리팩토링 자동화
└── settings.json       # Hooks 및 Claude Code 설정
```

#### settings.json 구조 (공식 문서 기준)

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "사용자 요청 시 실행할 명령어"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "파일 수정 후 실행할 검증 명령어"
          }
        ]
      }
    ]
  }
}
```

### 개발 워크플로우 예시

```bash
# 1. 기능 개발 후 테스트 작성
/test src/components/NewFeature.tsx

# 2. 코드 리팩토링 (필요시)
/refactor src/components/NewFeature.tsx

# 3. 변경사항 커밋
/commit

# 4. PR 생성
/pr
```

### 베스트 프랙티스

- **테스트 우선**: 새 기능 개발 후 즉시 `/test` 커맨드로 테스트 코드 생성
- **점진적 리팩토링**: `/refactor` 커맨드로 코드 품질 지속적 개선
- **일관된 커밋**: `/commit` 커맨드로 Conventional Commit 형식 유지
- **체계적 PR**: `/pr` 커맨드로 리뷰어가 이해하기 쉬운 PR 작성

### Hooks 자동화 시스템

프로젝트에는 코드 품질을 자동으로 검증하는 hooks 시스템이 설정되어 있습니다.

#### 설정된 Hooks

**1. UserPromptSubmit Hook**

```bash
# 사용자 요청 시 사전 검증
🚀 요청 처리 시작 - 사전 검증 중...
pnpm lint --fix && pnpm type-check
✅ 사전 검증 완료
```

**2. PostToolUse Hook (Write|Edit|MultiEdit 매처)**

```bash
# 파일 수정 후 CI와 동일한 검증 파이프라인 실행
📝 파일 수정 완료
🔍 GitHub Actions CI와 동일한 검증 실행 중...

1️⃣ 빌드 검증...
2️⃣ 린트 검사 및 자동 수정...
3️⃣ 타입 검사...

🎉 모든 검증 통과! GitHub Actions CI와 동일한 품질 확보
```

#### 자동화 워크플로우

1. **요청 접수** → 사전 검증 (lint, type-check)
2. **파일 수정** → 전체 검증 파이프라인 (build, lint, type-check)
3. **검증 실패** → 자동 재시도 및 수정 안내
4. **모든 검증 통과** → 작업 완료

**장점:**

- GitHub Actions CI 실행 전 로컬 검증 완료
- 100% CI 통과율 보장
- 실시간 코드 품질 피드백
- 개발 워크플로우 자동화

---

## 중요한 개발 규칙

### 패키지 관리

- **Workspace 참조**: `workspace:*`로 내부 패키지 참조
- **의존성 관리**: 공통 의존성은 루트, 패키지별은 각 패키지에서 관리
- **새 라이브러리**: 사용 전 기존 package.json에서 사용 여부 확인 필수

### 코드 스타일

- **ESLint**: `@cllaude99/eslint-config` 사용, 자동 정렬 활성화
- **TypeScript**: 엄격한 타입 검사, interface 우선 사용
- **React Import**: JSX에서 자동 import (React 17+ 방식)

### Import 순서 (자동 정렬)

```typescript
// 1. CSS imports
import 'reset.css';
import './styles.css';

// 2. React 라이브러리
import { useState, useEffect } from 'react';

// 3. 외부 라이브러리 (알파벳순)
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// 4. 내부 패키지 (@cllaude99/...)
import { Button } from '@cllaude99/ui';
import { useUser } from '@cllaude99/apis';

// 5. 앱 내부 절대 경로 (@/...)
import { PATH } from '@/constants/path';

// 6. 상대 경로
import { ButtonProps } from './Button.styles';
```

### 환경변수 & 에러 처리

- **백엔드 URL**: `VITE_BACKEND_URL` 환경변수
- **토큰 저장**: localStorage에 `accessToken`, `refreshToken`
- **에러 처리**: Error Boundary로 전역 처리, 토큰 만료 시 자동 로그아웃

---

## 코드 작성 가이드라인

**쉽게 수정 가능한 코드**를 위한 4가지 핵심 원칙

### 1. 가독성 (Readability)

#### 명확한 네이밍

```typescript
// ❌ 나쁜 예
const d = new Date();
const u = users.filter((x) => x.active);

// ✅ 좋은 예
const currentDate = new Date();
const activeUsers = users.filter((user) => user.isActive);
```

#### 매직 넘버 네이밍 & 복잡한 조건문 분리

```typescript
const ANIMATION_DELAY_MS = 300;

async function onLikeClick() {
  await postLike(url);
  await delay(ANIMATION_DELAY_MS); // 애니메이션 대기를 명확히 표시
  await refetchPostLike();
}

const matchedProducts = products.filter((product) => {
  const isSameCategory = product.categories.some(
    (category) => category.id === targetCategory.id,
  );
  const isPriceInRange = product.prices.some(
    (price) => price >= minPrice && price <= maxPrice,
  );
  return isSameCategory && isPriceInRange;
});
```

#### 구현 세부사항 추상화

복잡한 로직/상호작용을 전용 컴포넌트/HOC로 추상화합니다.

```tsx
// 인증 가드 패턴
function App() {
  return (
    <AuthGuard>
      <LoginStartPage />
    </AuthGuard>
  );
}

function AuthGuard({ children }) {
  const status = useCheckLoginStatus();
  useEffect(() => {
    if (status === 'LOGGED_IN') {
      location.href = '/home';
    }
  }, [status]);

  return status !== 'LOGGED_IN' ? children : null;
}
```

#### 조건부 렌더링을 위한 코드 경로 분리

역할별로 다른 컴포넌트를 분리하여 복잡한 조건문을 피합니다.

```tsx
function SubmitButton() {
  const isViewer = useRole() === 'viewer';
  return isViewer ? <ViewerSubmitButton /> : <AdminSubmitButton />;
}

function ViewerSubmitButton() {
  return <TextButton disabled>Submit</TextButton>;
}

function AdminSubmitButton() {
  useEffect(() => {
    showAnimation();
  }, []);
  return <Button type="submit">Submit</Button>;
}
```

#### 복잡한 삼항 연산자 단순화

```typescript
const status = (() => {
  if (ACondition && BCondition) return 'BOTH';
  if (ACondition) return 'A';
  if (BCondition) return 'B';
  return 'NONE';
})();
```

### 2. 예측 가능성 (Predictability)

#### 일관된 네이밍 패턴

```typescript
// 상태 관리
const [isLoading, setIsLoading] = useState(false);
const [isError, setIsError] = useState(false);

// 이벤트 핸들러
const handleSubmit = () => {
  /* ... */
};
const handleCancel = () => {
  /* ... */
};

// 검증 함수
const isValidEmail = (email: string) => {
  /* ... */
};
const isValidPassword = (password: string) => {
  /* ... */
};
```

#### 표준화된 반환 타입

```typescript
// API 훅 패턴
function useUser(): UseQueryResult<UserType, Error> {
  return useQuery({ queryKey: ['user'], queryFn: fetchUser });
}

function useServerTime(): UseQueryResult<Date, Error> {
  return useQuery({
    queryKey: ['serverTime'],
    queryFn: fetchServerTime,
  });
}

// 검증 함수 패턴
type ValidationResult = { ok: true } | { ok: false; reason: string };

function checkIsNameValid(name: string): ValidationResult {
  if (name.length === 0) return { ok: false, reason: '이름을 입력해주세요.' };
  if (name.length >= 20)
    return { ok: false, reason: '이름은 20자 미만이어야 합니다.' };
  return { ok: true };
}

function checkIsAgeValid(age: number): ValidationResult {
  if (!Number.isInteger(age))
    return { ok: false, reason: '나이는 정수여야 합니다.' };
  if (age < 18) return { ok: false, reason: '18세 이상이어야 합니다.' };
  return { ok: true };
}
```

#### 숨겨진 로직 노출 (단일 책임)

함수는 시그니처에서 암시하는 작업만 수행해야 합니다.

```typescript
// 잔액만 가져오는 함수
async function fetchBalance(): Promise<number> {
  const balance = await http.get<number>('...');
  return balance;
}

// 호출자가 필요한 곳에서 명시적으로 로깅 수행
async function handleUpdateClick() {
  const balance = await fetchBalance();
  logging.log('balance_fetched');
  await syncBalance(balance);
}
```

#### 고유하고 명확한 이름 사용

```typescript
// ❌ 나쁜 예 - 모호한 이름
function getUser() {
  /* ... */
}
function fetchUser() {
  /* ... */
}
function loadUser() {
  /* ... */
}

// ✅ 좋은 예 - 구체적이고 고유한 이름
function getUserFromCache() {
  /* 캐시에서 사용자 가져오기 */
}
function fetchUserFromAPI() {
  /* API에서 사용자 가져오기 */
}
function loadUserWithPermissions() {
  /* 권한 정보와 함께 사용자 로드 */
}
```

### 3. 응집성 (Cohesion)

#### 관련 코드를 한 곳에 모으기

```typescript
const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const;

const USER_STATUS_MESSAGES = {
  [USER_STATUS.ACTIVE]: '활성 상태',
  [USER_STATUS.INACTIVE]: '비활성 상태',
  [USER_STATUS.PENDING]: '대기 상태',
} as const;

function getUserStatusMessage(status: keyof typeof USER_STATUS) {
  return USER_STATUS_MESSAGES[status] || '알 수 없는 상태';
}
```

#### 도메인별 코드 구성

```
src/
├── components/     # 공유/공통 컴포넌트
├── hooks/         # 공유/공통 훅
├── domains/
│   ├── user/      # 사용자 관련 기능 모음
│   │   ├── components/
│   │   │   └── UserProfileCard.tsx
│   │   ├── hooks/
│   │   │   └── useUser.ts
│   │   └── index.ts
│   ├── product/   # 상품 관련 기능 모음
│   │   ├── components/
│   │   │   └── ProductList.tsx
│   │   ├── hooks/
│   │   │   └── useProducts.ts
│   │   └── ...
│   └── order/     # 주문 관련 기능 모음
│       ├── components/
│       │   └── OrderSummary.tsx
│       ├── hooks/
│       │   └── useOrder.ts
│       └── ...
```

#### 폼 응집성 고려

필드별 독립성 vs 폼 전체 통합성을 요구사항에 따라 선택합니다.

```tsx
// 필드별 응집성 예시
import { useForm } from 'react-hook-form';

export function Form() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input
        {...register('name', {
          validate: (value) =>
            value.trim() === '' ? '이름을 입력해주세요.' : true,
        })}
        placeholder="Name"
      />
      {errors.name && <p>{errors.name.message}</p>}

      <input
        {...register('email', {
          validate: (value) =>
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
              ? true
              : '유효하지 않은 이메일입니다.',
        })}
        placeholder="Email"
      />
      {errors.email && <p>{errors.email.message}</p>}
    </form>
  );
}

// 폼 전체 응집성 예시 (Zod 스키마 사용)
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('유효하지 않은 이메일입니다.'),
});

export function FormWithSchema() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(schema),
  });
  // ... 폼 렌더링
}
```

### 4. 결합도 (Coupling)

#### 단일 책임 원칙

```typescript
// ✅ 각각 단일 책임을 가진 컴포넌트들
function UserProfile({ userId }) {
  const { user } = useUser(userId);
  return <div>{/* 사용자 프로필 UI만 담당 */}</div>;
}

function NotificationList({ userId }) {
  const { notifications } = useNotifications(userId);
  return <div>{/* 알림 목록 UI만 담당 */}</div>;
}
```

#### 적절한 중복 허용 (무리한 추상화 피하기)

무리한 추상화보다는 적절한 중복을 허용하여 결합도를 낮춥니다.

```typescript
// ✅ 목적이 다른 검증 함수들은 별도로 유지
function validateLoginForm(email: string, password: string) {
  const errors: string[] = [];

  if (!email) errors.push('이메일을 입력해주세요');
  if (!password) errors.push('비밀번호를 입력해주세요');
  if (password.length < 8) errors.push('비밀번호는 8자 이상이어야 합니다');

  return { isValid: errors.length === 0, errors };
}

function validateSignupForm(
  email: string,
  password: string,
  confirmPassword: string,
) {
  const errors: string[] = [];

  if (!email) errors.push('이메일을 입력해주세요');
  if (!email.includes('@')) errors.push('올바른 이메일 형식이 아닙니다');
  if (!password) errors.push('비밀번호를 입력해주세요');
  if (password.length < 8) errors.push('비밀번호는 8자 이상이어야 합니다');
  if (password !== confirmPassword) errors.push('비밀번호가 일치하지 않습니다');

  return { isValid: errors.length === 0, errors };
}

// 💡 각각의 검증 로직이 다르게 발전할 가능성이 있으므로 분리하여 유지
```

#### 상태 관리 범위화

넓은 상태 관리를 작고 집중된 훅/컨텍스트로 분해합니다.

```typescript
// cardId 쿼리 파라미터 전용 훅
import { useQueryParam, NumberParam } from 'use-query-params';
import { useCallback } from 'react';

export function useCardIdQueryParam() {
  const [cardIdParam, setCardIdParam] = useQueryParam('cardId', NumberParam);

  const setCardId = useCallback(
    (newCardId: number | undefined) => {
      setCardIdParam(newCardId, 'replaceIn');
    },
    [setCardIdParam],
  );

  return [cardIdParam ?? undefined, setCardId] as const;
}
```

#### 컴포지션으로 Props Drilling 제거

Props Drilling 대신 컴포넌트 컴포지션을 사용합니다.

```tsx
function ItemEditModal({ open, items, recommendedItems, onConfirm, onClose }) {
  const [keyword, setKeyword] = useState('');

  return (
    <Modal open={open} onClose={onClose}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="아이템 검색..."
        />
        <Button onClick={onClose}>닫기</Button>
      </div>
      <ItemEditList
        keyword={keyword}
        items={items}
        recommendedItems={recommendedItems}
        onConfirm={onConfirm}
      />
    </Modal>
  );
}
```

---

## 파일 구조 패턴

### React 컴포넌트 구조

현재 프로젝트에서 사용하는 실제 파일 구조 패턴을 따릅니다.

#### 기본 컴포넌트 패턴 (packages/ui)

```
Button/
├── index.tsx          # 메인 컴포넌트 로직 + Props 타입 정의
└── Button.styles.ts   # Emotion 스타일 + ButtonProps 타입
```

**실제 구현 예시:**

```typescript
// index.tsx
import { ButtonHTMLAttributes } from 'react';
import { StyledButton, ButtonProps } from './Button.styles';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps;

const Button = ({ children, variant = 'primary', ...rest }: Props) => {
  return <StyledButton variant={variant} {...rest}>{children}</StyledButton>;
};

export default Button;
```

```typescript
// Button.styles.ts
import styled from '@emotion/styled';

export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

export const StyledButton = styled.button<ButtonProps>`
  // 스타일 정의...
`;
```

#### 웹 애플리케이션 컴포넌트 패턴 (apps/web)

```
Layout/
├── index.tsx          # 컴포넌트 로직
└── Layout.styles.ts   # 스타일 정의
```

**실제 구현 예시:**

```typescript
// index.tsx
import * as S from './Layout.styles'; // namespace import 사용

interface LayoutProps {
  children: React.ReactNode;
  layoutStyle?: React.CSSProperties;
}

const Layout = ({ children, layoutStyle }: LayoutProps) => {
  return <S.Layout style={layoutStyle}>{children}</S.Layout>;
};

export default Layout;
```

```typescript
// Layout.styles.ts
import styled from '@emotion/styled';

export const Layout = styled.div`
  // 스타일 정의...
`;
```

#### 프로젝트 디렉토리 구조 (apps/web/src)

```
src/
├── components/        # 재사용 가능한 컴포넌트
│   ├── Layout/
│   ├── ErrorBoundary/
│   └── ErrorPage/
├── pages/            # 페이지 컴포넌트 (라우팅 단위)
├── hooks/           # 커스텀 훅
├── constants/       # 상수 정의 (path.ts 등)
├── assets/         # 정적 자원
│   ├── images/
│   └── icons/
│       ├── components/  # 아이콘 컴포넌트
│       └── types/       # 아이콘 타입 정의
└── routes/         # 라우팅 설정
```

#### 스타일 Import 패턴

프로젝트에서 사용하는 두 가지 패턴:

```typescript
// 패턴 1: Named import (packages/ui)
import { StyledButton, ButtonProps } from './Button.styles';

// 패턴 2: Namespace import (apps/web)
import * as S from './Layout.styles';
```

**가이드라인:**

- **packages/ui**: Named import 사용 (`export interface`, `export const` 활용)
- **apps/web**: Namespace import 사용 (`import * as S` 패턴)

### Export/Import 패턴

#### Default vs Named Export

```typescript
// ✅ Default export - 메인 컴포넌트
function Button({ children, ...props }: ButtonProps) {
  return <StyledButton {...props}>{children}</StyledButton>;
}
export default Button;

// ✅ Named export - 여러 관련 항목들
export const UserStatus = { /* ... */ };
export const getUserStatusMessage = (status: string) => { /* ... */ };
```

#### Barrel Export (index.ts)

현재 프로젝트의 실제 Barrel Export 패턴:

```typescript
// packages/ui/src/index.ts - 패키지 최상위
export * from './components';
export * from './design-system';

// packages/ui/src/components/index.ts - 컴포넌트 모음
export { Cllaude99UIProvider, ThemeProvider, Button };

// packages/ui/src/design-system/index.ts - 디자인 시스템
export * from './breakpoints';
export * from './palette';
export * from './typography';
export * from './theme';

// packages/apis/src/queries/index.ts - API 쿼리
export * from './queryFn';

// packages/apis/src/mutations/index.ts - API 뮤테이션
export * from './useMemeQuizMutation';
export * from './useShareMemeMutation';
export * from './useMemeCustomMutation';

// apps/web/src/assets/icons/components/index.ts - 아이콘 컴포넌트
export { default as LeftChevronIcon } from './LeftChevronIcon';
export { default as ShareIcon } from './ShareIcon';
export { default as KakaoIcon } from './KakaoIcon';
// ... 기타 아이콘들
```

### 타입 정의 가이드라인

#### 파일 내부 타입 (로컬 사용)

```typescript
// UserProfile.tsx 내부
interface UserProfileProps {
  userId: string;
  showEmail?: boolean;
}
```

#### 공통 타입 분리 (다중 사용)

```typescript
// types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// types/api.ts
export interface APIResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}
```

### API 관련 구조

```typescript
// queries/useUserQuery.ts
export const useUserQuery = ({ userId }: UseUserQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEY.user(userId),
    queryFn: () => fetchApiData<UserResponse>(`/users/${userId}`),
  });
};
```

### 유틸리티 구조

```typescript
// utils/validation.ts
export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const validateLoginForm = (email: string, password: string) => {
  // 관련 검증 함수들을 함께 모음
};
```

---

## 추가 참고사항

### 개발 환경 설정

#### VSCode 설정 (.vscode/settings.json)

프로젝트에는 팀 전체가 일관된 개발 환경을 사용할 수 있도록 VSCode 설정이 포함되어 있습니다:

```json
{
  "search.exclude": {
    "**/node_modules": true,
    "**/pnpm-lock.yaml": true,
    "**/dist": true,
    "**/.turbo": true
  },
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.workingDirectories": [
    {
      "mode": "auto"
    }
  ],
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

**주요 기능:**

- **자동 포매팅**: 파일 저장 시 Prettier 자동 실행
- **ESLint 자동 수정**: import 순서 자동 정렬 및 린트 오류 자동 수정
- **검색 최적화**: 불필요한 파일/폴더 검색 제외
- **모노레포 지원**: 각 패키지별 ESLint 설정 자동 감지
- **TypeScript 지원**: 워크스페이스 TypeScript 버전 사용 및 자동완성 향상

#### Node.js 버전 관리 (.nvmrc)

```
20.11.0
```

팀 전체가 동일한 Node.js 버전을 사용할 수 있도록 `.nvmrc` 파일이 설정되어 있습니다.

**사용법:**

```bash
# 프로젝트 권장 Node.js 버전으로 전환
nvm use

# 해당 버전이 설치되지 않은 경우 설치
nvm install
```

#### ESLint 자동 정렬 활성화

```bash
# 자동 수정 명령어
pnpm lint --fix
```

이 가이드라인과 개발 환경 설정을 따라 일관되고 유지보수 가능한 코드를 작성하세요.
