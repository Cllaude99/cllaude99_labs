# @cllaude99/ui

> Cllaude99 Design System - 일관성 있고 확장 가능한 UI 컴포넌트 라이브러리

React + TypeScript + Emotion 기반의 모던 디자인 시스템으로, 재사용 가능한 컴포넌트와 디자인 토큰을 제공합니다.

## 📦 설치

```bash
# pnpm
pnpm add @cllaude99/ui

# npm
npm install @cllaude99/ui

# yarn
yarn add @cllaude99/ui
```

### Peer Dependencies

이 패키지는 다음 라이브러리들을 peer dependency로 사용합니다:

```bash
pnpm add react react-dom @emotion/react @emotion/styled
```

## 🚀 빠른 시작

### 1. Provider 설정

앱의 최상위에서 `Cllaude99UIProvider`를 설정합니다:

```tsx
import { Cllaude99UIProvider } from '@cllaude99/ui';

function App() {
  return (
    <Cllaude99UIProvider>{/* 여기에 앱 컴포넌트들 */}</Cllaude99UIProvider>
  );
}
```

### 2. 컴포넌트 사용

```tsx
import { Button } from '@cllaude99/ui';

function MyComponent() {
  return (
    <Button variant="primary" size="medium">
      클릭하세요
    </Button>
  );
}
```

### 3. 디자인 시스템 활용

```tsx
import { palette, typography, breakpoints, mq } from '@cllaude99/ui';
import styled from '@emotion/styled';

const StyledCard = styled.div`
  background-color: ${palette.white};
  padding: 1rem;
  border-radius: 8px;
  font-size: ${typography.size.body1};

  ${mq.md} {
    padding: 1.5rem;
  }
`;
```

## 📚 컴포넌트

### Button

다양한 스타일과 크기를 지원하는 버튼 컴포넌트입니다.

#### Props

| Prop     | Type                                 | Default     | Description   |
| -------- | ------------------------------------ | ----------- | ------------- |
| variant  | `'primary'` \| `'secondary'`         | `'primary'` | 버튼 스타일   |
| size     | `'small'` \| `'medium'` \| `'large'` | `'medium'`  | 버튼 크기     |
| disabled | `boolean`                            | `false`     | 비활성화 여부 |
| children | `ReactNode`                          | -           | 버튼 내용     |

#### 사용 예시

```tsx
import { Button } from '@cllaude99/ui';

function Examples() {
  return (
    <>
      {/* 기본 버튼 */}
      <Button variant="primary">Primary Button</Button>

      {/* 세컨더리 버튼 */}
      <Button variant="secondary">Secondary Button</Button>

      {/* 크기 변형 */}
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>

      {/* 비활성화 */}
      <Button disabled>Disabled Button</Button>

      {/* 클릭 이벤트 */}
      <Button onClick={() => console.log('clicked')}>Click Me</Button>
    </>
  );
}
```

### Toast

사용자에게 피드백을 제공하는 토스트 알림 컴포넌트입니다.

#### 사용 예시

```tsx
import { Toast } from '@cllaude99/ui';
import toast from 'react-hot-toast';

function ToastExample() {
  const showSuccess = () => {
    toast.success('성공적으로 저장되었습니다!');
  };

  const showError = () => {
    toast.error('오류가 발생했습니다.');
  };

  const showCustom = () => {
    toast('사용자 정의 메시지', {
      duration: 4000,
      position: 'top-center',
    });
  };

  return (
    <>
      <Toast />
      <button onClick={showSuccess}>성공 토스트</button>
      <button onClick={showError}>에러 토스트</button>
      <button onClick={showCustom}>커스텀 토스트</button>
    </>
  );
}
```

### ThemeProvider

Emotion 테마를 제공하는 Provider 컴포넌트입니다.

#### 사용 예시

```tsx
import { ThemeProvider, theme } from '@cllaude99/ui';

function App() {
  return <ThemeProvider theme={theme}>{/* 앱 컴포넌트들 */}</ThemeProvider>;
}
```

## 🎨 디자인 시스템

### Palette (색상)

프로젝트 전반에서 사용하는 색상 팔레트입니다.

```tsx
import { palette } from '@cllaude99/ui';

const MyComponent = styled.div`
  color: ${palette.black};
  background-color: ${palette.white};
  border-color: ${palette.gray[300]};
`;
```

#### 사용 가능한 색상

- `palette.black` - 기본 검정색
- `palette.white` - 기본 흰색
- `palette.gray` - 그레이 스케일 (100 ~ 900)
- `palette.primary` - 주요 브랜드 색상
- `palette.secondary` - 보조 색상
- `palette.error` - 에러 색상
- `palette.success` - 성공 색상
- `palette.warning` - 경고 색상

### Typography (타이포그래피)

폰트 크기, 굵기, 행간 등 텍스트 스타일 규칙입니다.

```tsx
import { typography } from '@cllaude99/ui';

const Title = styled.h1`
  font-size: ${typography.size.heading1};
  font-weight: ${typography.weight.bold};
  line-height: ${typography.lineHeight.tight};
`;

const Body = styled.p`
  font-size: ${typography.size.body1};
  font-weight: ${typography.weight.regular};
  line-height: ${typography.lineHeight.normal};
`;
```

#### Typography 속성

**크기 (size):**

- `heading1`, `heading2`, `heading3` - 제목용
- `body1`, `body2` - 본문용
- `caption`, `small` - 보조 텍스트용

**굵기 (weight):**

- `light`, `regular`, `medium`, `semibold`, `bold`

**행간 (lineHeight):**

- `tight`, `normal`, `relaxed`

### Breakpoints (반응형)

반응형 디자인을 위한 중단점과 미디어 쿼리입니다.

```tsx
import { breakpoints, mq } from '@cllaude99/ui';

const ResponsiveCard = styled.div`
  width: 100%;
  padding: 1rem;

  /* 태블릿 이상 */
  ${mq.md} {
    width: 50%;
    padding: 1.5rem;
  }

  /* 데스크톱 이상 */
  ${mq.lg} {
    width: 33.333%;
    padding: 2rem;
  }

  /* 원시 breakpoint 값 사용 */
  @media (min-width: ${breakpoints.xl}px) {
    width: 25%;
  }
`;
```

#### Breakpoints 값

- `xs`: 320px - 모바일
- `sm`: 576px - 큰 모바일
- `md`: 768px - 태블릿
- `lg`: 1024px - 데스크톱
- `xl`: 1280px - 큰 데스크톱

### Theme (테마)

통합 테마 객체로, palette, typography, breakpoints를 모두 포함합니다.

```tsx
import { theme } from '@cllaude99/ui';
import { ThemeProvider } from '@emotion/react';

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* theme.palette, theme.typography, theme.breakpoints 사용 가능 */}
    </ThemeProvider>
  );
}

// 컴포넌트에서 사용
const StyledDiv = styled.div`
  color: ${({ theme }) => theme.palette.primary};
  font-size: ${({ theme }) => theme.typography.size.body1};

  ${({ theme }) => theme.breakpoints.mq.md} {
    font-size: ${({ theme }) => theme.typography.size.heading3};
  }
`;
```

## 📖 전체 사용 예시

```tsx
import {
  Cllaude99UIProvider,
  Button,
  Toast,
  palette,
  typography,
  mq,
} from '@cllaude99/ui';
import styled from '@emotion/styled';
import toast from 'react-hot-toast';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-color: ${palette.white};

  ${mq.md} {
    padding: 3rem 2rem;
  }
`;

const Title = styled.h1`
  font-size: ${typography.size.heading1};
  font-weight: ${typography.weight.bold};
  color: ${palette.black};
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

function App() {
  const handleClick = () => {
    toast.success('버튼이 클릭되었습니다!');
  };

  return (
    <Cllaude99UIProvider>
      <Toast />
      <Container>
        <Title>Cllaude99 Design System</Title>
        <ButtonGroup>
          <Button variant="primary" size="large" onClick={handleClick}>
            Primary Large
          </Button>
          <Button variant="secondary" size="medium" onClick={handleClick}>
            Secondary Medium
          </Button>
          <Button variant="primary" size="small" onClick={handleClick}>
            Primary Small
          </Button>
        </ButtonGroup>
      </Container>
    </Cllaude99UIProvider>
  );
}

export default App;
```

## 📚 Storybook

### 로컬에서 Storybook 실행

```bash
cd packages/ui
pnpm storybook
```

브라우저에서 http://localhost:6006 접속

### Storybook 빌드

```bash
pnpm build-storybook
```

빌드 결과물은 `storybook-static` 폴더에 생성됩니다.

### Storybook 배포

#### Vercel 배포 (추천)

1. **GitHub에 푸시**

   ```bash
   git add .
   git commit -m "feat: Add Storybook"
   git push
   ```

2. **Vercel 프로젝트 생성**

   - https://vercel.com/new 접속
   - GitHub 저장소 연결
   - `packages/ui` 디렉토리 선택

3. **빌드 설정**

   - Framework Preset: `Other`
   - Build Command: `pnpm build-storybook`
   - Output Directory: `storybook-static`
   - Install Command: `pnpm install`
   - Root Directory: `packages/ui`

4. **Deploy 클릭**

완료! Storybook이 자동으로 배포됩니다.

#### Chromatic 배포 (Storybook 공식)

```bash
# Chromatic 설치
pnpm add -D chromatic

# 프로젝트 생성 및 배포
npx chromatic --project-token=YOUR_PROJECT_TOKEN
```

https://www.chromatic.com 에서 프로젝트 토큰을 받을 수 있습니다.

#### GitHub Pages 배포

```bash
# Storybook 빌드
pnpm build-storybook

# gh-pages 브랜치에 배포
npx gh-pages -d storybook-static
```

## 🔧 개발

### 모노레포 내부 개발 (권장) - 빌드 불필요! ⚡

이 패키지는 Turborepo 모노레포의 일부이므로, 루트에서 개발하는 것을 권장합니다:

```bash
# 저장소 클론
git clone https://github.com/cllaude99/claude_code.git
cd claude_code

# 의존성 설치
pnpm install

# 🚀 개발 서버 실행 (빌드 없이 즉시 시작!)
pnpm dev
```

**⚡ 즉시 개발 시작:** `@cllaude99/ui` 패키지는 `src` 폴더를 직접 참조합니다.

- ✅ **빌드 불필요**: 컴포넌트 추가 시 즉시 반영
- ✅ **빠른 개발**: 소스 코드 변경 시 즉각 적용
- ✅ **타입 안전성**: TypeScript가 실시간 타입 검사
- ✅ **간편함**: 별도의 빌드 과정 없이 개발 가능

### UI 패키지 단독 개발

```bash
cd packages/ui

# 린트 검사
pnpm lint

# 타입 검사
pnpm type-check

# 빌드 (npm 배포 전에만 필요)
pnpm build
```

### 새 컴포넌트 추가하기

1. `src/components/` 폴더에 새 컴포넌트 폴더 생성
2. 컴포넌트 파일 작성:
   - `index.tsx` - 컴포넌트 로직
   - `[ComponentName].styles.ts` - 스타일 정의
3. `src/components/index.ts`에 export 추가
4. 타입 검사 및 빌드 확인

#### 예시: Card 컴포넌트 추가

```typescript
// src/components/Card/index.tsx
import { StyledCard, CardProps } from './Card.styles';

const Card = ({ children, variant = 'default', ...rest }: CardProps) => {
  return (
    <StyledCard variant={variant} {...rest}>
      {children}
    </StyledCard>
  );
};

export default Card;

// src/components/Card/Card.styles.ts
import styled from '@emotion/styled';
import { palette } from '../../design-system';

export interface CardProps {
  variant?: 'default' | 'elevated';
  children: React.ReactNode;
}

export const StyledCard = styled.div<CardProps>`
  padding: 1.5rem;
  border-radius: 8px;
  background-color: ${palette.white};

  ${({ variant }) =>
    variant === 'elevated' &&
    `
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `}
`;

// src/components/index.ts
import Card from './Card';
// ... 기존 exports
export { Card };
```

## 📝 NPM 배포

```bash
# 배포 전 체크리스트
pnpm lint          # 린트 검사
pnpm type-check    # 타입 검사

# NPM 로그인 (최초 1회)
npm login

# 배포 (자동으로 빌드됨)
npm publish

# 특정 버전 배포
npm version patch  # 0.1.0 -> 0.1.1
npm version minor  # 0.1.0 -> 0.2.0
npm version major  # 0.1.0 -> 1.0.0
npm publish
```

**🚀 자동 빌드:** `prepublishOnly` 스크립트가 설정되어 있어 `npm publish` 실행 시 자동으로:

1. `dist` 폴더 삭제
2. TypeScript 컴파일 실행
3. `dist`와 `src` 폴더를 함께 배포

**배포 내용:**

- ✅ `src/` - TypeScript 소스 코드
- ✅ `dist/` - 컴파일된 JavaScript + 타입 정의
- ✅ `README.md` - 패키지 문서

npm에서 설치하는 사용자는 기본적으로 `src` 폴더를 사용하며, 필요 시 `dist`를 참조할 수 있습니다.

## 🤝 기여하기

새로운 컴포넌트나 기능을 추가하고 싶으시다면 언제든 기여해주세요!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT © cllaude99

## 🔗 링크

- [GitHub Repository](https://github.com/cllaude99/claude_code)
- [Issues](https://github.com/cllaude99/claude_code/issues)
- [NPM Package](https://www.npmjs.com/package/@cllaude99/ui)

---

Made with ❤️ by cllaude99
