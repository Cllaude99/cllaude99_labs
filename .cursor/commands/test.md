# Smart Test Generator

지정된 파일의 로직을 분석하여 단위 테스트와 E2E 테스트 코드를 자동 생성하는 명령어입니다.

## 사용법
```
/test <파일경로>
/test src/components/Button/index.tsx
/test src/utils/validation.ts  
/test src/hooks/useUser.ts
```

## 생성되는 폴더 구조

```
apps/web/
├── src/
│   ├── test/
│   │   ├── unit/                          # 단위 테스트
│   │   │   ├── components/
│   │   │   │   └── Button.test.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useUser.test.ts
│   │   │   └── utils/
│   │   │       └── validation.test.ts
│   │   └── e2e/                           # E2E 테스트
│   │       ├── components/
│   │       │   └── Button.e2e.spec.ts
│   │       └── flows/
│   │           └── LoginFlow.e2e.spec.ts
│   ├── components/Button/index.tsx
│   ├── utils/validation.ts
│   └── setupTests.ts
├── jest.config.js                         # Jest 설정
└── playwright.config.ts                   # Playwright 설정
```

## 단위 테스트 생성 예시

### React 컴포넌트 테스트
```typescript
// src/test/unit/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@emotion/react';
import Button from '@/components/Button';

// 테마 모킹 (Emotion 사용 시)
const mockTheme = {
  palette: {
    primary: '#007bff',
    secondary: '#6c757d'
  }
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('Button Component', () => {
  it('should render with correct text', () => {
    renderWithTheme(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    renderWithTheme(<Button onClick={handleClick}>Button</Button>);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    renderWithTheme(<Button disabled>Button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should apply correct variant styles', () => {
    renderWithTheme(<Button variant="secondary">Button</Button>);
    const button = screen.getByRole('button');
    // 스타일 검증은 실제 CSS 클래스나 computed styles로 확인
    expect(button).toHaveAttribute('data-variant', 'secondary');
  });
});
```

### 커스텀 훅 테스트
```typescript
// src/test/unit/hooks/useUser.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUser } from '@/hooks/useUser';

// React Query Provider 설정
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useUser Hook', () => {
  it('should fetch user data successfully', async () => {
    const { result } = renderHook(() => useUser('123'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({
      id: '123',
      name: 'Test User',
      email: 'test@example.com'
    });
  });

  it('should handle loading state', () => {
    const { result } = renderHook(() => useUser('123'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });
});
```

### 유틸리티 함수 테스트
```typescript
// src/test/unit/utils/validation.test.ts
import { isValidEmail, validateLoginForm } from '@/utils/validation';

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.kr')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('validateLoginForm', () => {
    it('should return valid result for correct input', () => {
      const result = validateLoginForm('test@example.com', 'password123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid input', () => {
      const result = validateLoginForm('', '123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('이메일을 입력해주세요');
      expect(result.errors).toContain('비밀번호는 8자 이상이어야 합니다');
    });
  });
});
```

## E2E 테스트 생성 예시

### 컴포넌트 상호작용 테스트
```typescript
// src/test/e2e/components/Button.e2e.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Button Component E2E', () => {
  test('should handle user interactions correctly', async ({ page }) => {
    await page.goto('/');
    
    // 버튼 클릭 테스트
    const button = page.getByRole('button', { name: /click me/i });
    await expect(button).toBeVisible();
    await button.click();
    
    // 결과 확인
    await expect(page.getByText('Button was clicked!')).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // 탭 키로 포커스 이동
    await page.keyboard.press('Tab');
    const button = page.getByRole('button').first();
    await expect(button).toBeFocused();
    
    // 엔터 키로 실행
    await page.keyboard.press('Enter');
    await expect(page.getByText('Button was clicked!')).toBeVisible();
  });
});
```

### 사용자 플로우 테스트
```typescript
// src/test/e2e/flows/LoginFlow.e2e.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should complete successful login', async ({ page }) => {
    await page.goto('/login');
    
    // 로그인 폼 작성
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    
    // 로그인 버튼 클릭
    await page.click('[data-testid="login-button"]');
    
    // 성공 후 리다이렉트 확인
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('환영합니다')).toBeVisible();
  });

  test('should show validation errors', async ({ page }) => {
    await page.goto('/login');
    
    // 빈 폼으로 제출
    await page.click('[data-testid="login-button"]');
    
    // 에러 메시지 확인
    await expect(page.getByText('이메일을 입력해주세요')).toBeVisible();
    await expect(page.getByText('비밀번호를 입력해주세요')).toBeVisible();
  });
});
```

## 실행 방법

### 단위 테스트
```bash
# 모든 테스트 실행
pnpm test

# 특정 파일 테스트
pnpm test Button.test.tsx

# 감시 모드
pnpm test:watch

# 커버리지 확인
pnpm test:coverage
```

### E2E 테스트
```bash
# 모든 브라우저에서 테스트
pnpm test:e2e

# UI 모드로 실행
pnpm test:e2e:ui

# 브라우저를 보면서 실행
pnpm test:e2e:headed

# 특정 브라우저만
pnpm test:e2e --project=chromium
```

## 자동 생성 기능

1. **스마트 파일 분석**: 파일 타입에 따라 적절한 테스트 전략 수립
2. **의존성 자동 모킹**: 외부 API, 라우터 등 자동 모킹 설정
3. **테스트 데이터 생성**: 컴포넌트 props, API 응답 더미 데이터 생성
4. **접근성 테스트**: 자동 a11y 검증 추가
5. **시각적 회귀 테스트**: 컴포넌트 스크린샷 비교
6. **성능 테스트**: 렌더링 성능 검증

## 지원하는 파일 타입

### React 컴포넌트 (.tsx)
- **단위 테스트**: 렌더링, props 검증, 이벤트 핸들링, 스타일 적용
- **E2E 테스트**: 사용자 상호작용, 키보드 네비게이션

### 커스텀 훅 (.ts/.tsx)  
- **단위 테스트**: 훅 로직, 상태 변화, 반환값 검증
- **E2E 테스트**: 실제 컴포넌트에서 사용 시나리오

### 유틸리티 함수 (.ts)
- **단위 테스트**: 입출력 검증, 엣지 케이스, 에러 처리
- **E2E 테스트**: 실제 사용 컨텍스트에서의 동작

### API 레이어 (.ts)
- **단위 테스트**: API 호출 로직, 데이터 변환, 에러 핸들링  
- **E2E 테스트**: 실제 네트워크 요청 및 응답 처리

## 테스트 베스트 프랙티스

- **AAA 패턴**: Arrange-Act-Assert 구조
- **명확한 테스트명**: 무엇을 테스트하는지 명확히 표현
- **독립적인 테스트**: 각 테스트는 서로 독립적으로 실행
- **의미있는 assertion**: 실제 사용자 동작과 결과 중심
- **적절한 테스트 범위**: 과도하지 않은 적정 커버리지

## 사용하는 테스트 도구

- **Jest**: 단위 테스트 프레임워크
- **Testing Library**: React 컴포넌트 테스트
- **Playwright**: E2E 테스트 및 브라우저 자동화
- **jsdom**: 브라우저 환경 시뮬레이션
