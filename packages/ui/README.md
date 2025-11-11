# @cllaude99/ui

`@cllaude99/ui`는 React + TypeScript + Emotion 기반의 UI 컴포넌트를 제공하는 디자인 시스템입니다. React 애플리케이션에서 즉시 사용할 수 있는 컴포넌트와 디자인 토큰을 포함하고 있습니다.

## 📦 설치

```bash
# pnpm (권장)
pnpm add @cllaude99/ui

# npm
npm install @cllaude99/ui

# yarn
yarn add @cllaude99/ui
```

### 필수 Peer Dependencies

이 패키지를 사용하기 위해서는 다음 라이브러리가 필요합니다.

```bash
pnpm add react react-dom @emotion/react @emotion/styled
```

## 🚀 사용 방법

### 1. Provider 설정 (필수)

앱의 최상위 컴포넌트에서 `Cllaude99UIProvider`로 감싸주세요

```tsx
import { Cllaude99UIProvider } from '@cllaude99/ui';

function App() {
  return (
    <Cllaude99UIProvider>{/* 여기에 앱 컴포넌트들 */}</Cllaude99UIProvider>
  );
}

export default App;
```

### 2. 컴포넌트 사용

#### Button 컴포넌트 예시

Button 컴포넌트는 다양한 스타일과 크기를 지원합니다. 폼 제출, 액션 트리거, 네비게이션 등 모든 인터랙티브 요소에 사용할 수 있습니다.

```tsx
import { Button } from '@cllaude99/ui';

function MyComponent() {
  const handleClick = () => {
    console.log('버튼 클릭!');
  };

  return (
    <div>
      {/* Primary 버튼 - 주요 액션 */}
      <Button variant="primary" size="medium" onClick={handleClick}>
        저장하기
      </Button>

      {/* Secondary 버튼 - 보조 액션 */}
      <Button variant="secondary" size="medium">
        취소
      </Button>

      {/* Outline 버튼 - 덜 중요한 액션 */}
      <Button variant="outline" size="small">
        더보기
      </Button>

      {/* Danger 버튼 - 삭제 등 위험한 액션 */}
      <Button variant="danger" size="large">
        삭제
      </Button>

      {/* 비활성화 */}
      <Button variant="primary" disabled>
        비활성화
      </Button>
    </div>
  );
}
```

**사용 가능한 환경**

- React 18+ 애플리케이션
- Next.js (App Router / Pages Router)
- Vite + React
- Create React App
- Remix
- Emotion이 지원되는 모든 React 환경

### 3. 디자인 토큰 활용 (선택)

컴포넌트와 함께 디자인 토큰을 직접 사용할 수도 있습니다:

```tsx
import { palette, typography, mq } from '@cllaude99/ui';
import styled from '@emotion/styled';

const CustomCard = styled.div`
  background-color: ${palette.common.white};
  padding: 1.5rem;
  font-size: ${typography.body.body1.fontSize};

  ${mq.tablet} {
    padding: 2rem;
  }
`;
```

## 📚 전체 컴포넌트 목록

현재 제공되는 모든 컴포넌트와 사용 예시는 **Storybook**에서 확인할 수 있습니다.

### 더 많은 컴포넌트를 확인하고 싶다면?

**👉 [Storybook 바로가기](https://claude-code-ui-green.vercel.app/?path=/docs/components-button--docs)**

## 🎨 디자인 시스템

`@cllaude99/ui`는 다음 디자인 토큰을 제공합니다.

- **Palette** - 색상 시스템
- **Typography** - 폰트 크기, 굵기, 행간
- **Breakpoints** - 반응형 디자인 중단점
- **Theme** - 통합 테마 객체

**자세한 디자인 시스템 구조와 사용법**

### 자세한 디자인 시스템 구조를 확인하고 싶다면?

👉 [GitHub - Design System](https://github.com/Cllaude99/claude_code/tree/main/packages/ui/src/design-system)

## 🔧 개발

### 모노레포에서 사용

이 패키지는 Turborepo 모노레포의 일부입니다. 로컬에서 개발하려면

```bash
# 저장소 클론
git clone https://github.com/Cllaude99/claude_code.git
cd claude_code

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# Storybook 실행
cd packages/ui
pnpm storybook
```

### 빌드

```bash
cd packages/ui

# TypeScript 컴파일
pnpm build

# Storybook 빌드
pnpm build-storybook
```

## 📝 NPM 배포

```bash
# 배포 전 검증
pnpm lint
pnpm type-check

# npm 로그인 (최초 1회)
npm login

# 배포
npm publish
```

배포 시 `prepublishOnly` 스크립트가 자동으로 빌드를 실행합니다.

## 🤝 기여하기

버그 리포트, 기능 제안, Pull Request는 언제나 환영합니다!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT © cllaude99

## 🔗 링크

- [Storybook](https://claude-code-ui-green.vercel.app)
- [GitHub Repository](https://github.com/cllaude99/claude_code)
- [Design System](https://github.com/Cllaude99/claude_code/tree/main/packages/ui/src/design-system)
- [NPM Package](https://www.npmjs.com/package/@cllaude99/ui)
- [Issues](https://github.com/cllaude99/claude_code/issues)

---

Made with ❤️ by cllaude99
