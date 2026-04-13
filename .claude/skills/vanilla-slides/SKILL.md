---
name: vanilla-slides
description: 순수 HTML, CSS, JavaScript만으로 웹 기반 슬라이드 프레젠테이션을 생성하는 스킬. 외부 라이브러리 없이 발표용 슬라이드를 만들어야 할 때 사용. 사용자가 프레젠테이션, 슬라이드, 발표자료, PPT 대체, 웹 슬라이드, 키노트 대안 등을 언급하면 이 스킬을 활용할 것.
---

# Vanilla Slides — 순수 바닐라 웹 프레젠테이션 생성기

외부 라이브러리 없이 단일 HTML 파일로 완성되는 슬라이드 프레젠테이션을 생성한다.
브라우저에서 바로 열어 발표할 수 있고, 키보드/터치/스와이프 네비게이션을 모두 지원한다.

**디자인 기조**:
— 순수 검정 배경(`#000`), 흰색 텍스트, 반투명 글래스모피즘 카드, 최소한의 UI.

## 핵심 원칙

1. **단일 파일 배포** — HTML, CSS, JS를 하나의 `.html` 파일에 인라인으로 포함. 더블클릭으로 실행.
2. **외부 의존성 제로** — CDN, npm, 프레임워크 없음. 순수 바닐라만 사용. (Lottie 사용 시 유일한 예외로 CDN 스크립트 1개 추가)
3. **발표자 친화적** — 키보드, 터치, URL hash, 프로그레스 바, 발표자 노트 기본 탑재.
4. **성능 우선** — GPU 가속 속성(transform, opacity)만 애니메이션. 60fps 유지.

---

## 출력 파일 구조

사용자가 별도 요청하지 않으면 **단일 HTML 파일**로 생성한다.

```
presentation.html   ← 이 파일 하나가 전부
```

파일 내부 구조:

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>프레젠테이션 제목</title>
    <!-- Lottie가 필요한 경우에만 추가 -->
    <script
      type="module"
      src="https://unpkg.com/@lottiefiles/dotlottie-wc@latest/dist/dotlottie-wc.js"
    ></script>
    <style>
      /* 전체 CSS */
    </style>
  </head>
  <body>
    <!-- 슬라이드 HTML -->
    <script>
      /* 전체 JS (SlideEngine 클래스) */
    </script>
  </body>
</html>
```

---

## 디자인 시스템

### 색상 팔레트

```css
[data-theme='dark'] {
  --bg: #000000; /* 배경: 순수 검정 */
  --bg-elevated: #0a0a0a; /* 약간 밝은 배경 */
  --text: #fbfbfb; /* 주 텍스트: 거의 흰색 */
  --text-secondary: rgba(255, 255, 255, 0.7); /* 보조 텍스트 */
  --text-muted: rgba(255, 255, 255, 0.4); /* 흐린 텍스트 */
  --accent: #fbfbfb; /* 강조색: 흰색 (빨간색 아님!) */
  --code-bg: #1a1a1a; /* 코드 블록 배경 */
  --code-text: #d4d4d8; /* 코드 텍스트 */
  --surface: rgba(255, 255, 255, 0.05); /* 카드/서피스 배경 */
  --border: #222222; /* 테두리 */
}
```

핵심 규칙:

- 배경은 반드시 `#000000` (순수 검정). 절대 `#0c0c0e`나 `#1a1a2e` 같은 회색/보라색 톤 사용 금지.
- 강조색은 흰색 (`#fbfbfb`). 빨간색(`#e94560`) 사용 금지.
- 카드/서피스는 반투명 흰색 + `backdrop-filter: blur(20px)`.
- 프레젠테이션 루트 배경도 `#000` 단색 (그라디언트 없음).

### 타이포그래피

```css
.slide h1 {
  font-size: 6vmin;
  font-weight: 800;
  letter-spacing: -0.03em;
}
.slide h2 {
  font-size: 4.2vmin;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.slide p,
.slide li {
  font-size: 2.5vmin;
  line-height: 1.9;
  color: var(--text-secondary);
}
```

### 이징 함수 & 타이밍

모든 애니메이션에 `cubic-bezier(0.16, 1, 0.3, 1)` (부드러운 감속) 사용.

| 항목 | 값 | 이유 |
|------|-----|------|
| 슬라이드 전환 duration | `700ms` | 너무 빠르지 않고 부드럽게 느껴지는 속도 |
| 빌드 스텝 transition | `0.8s` | 요소가 충분히 천천히 등장하여 시선을 끌 수 있는 속도 |
| stagger 간격 | `100ms` | 같은 스텝 요소 간 시차. 리스트 항목이 자연스럽게 순차 등장 |
| slide 전환 오프셋 | `20%` | 은은한 수평 이동. 30%는 너무 급격함 |

빠르게 넘어가는 느낌을 피하고, 발표자가 여유를 갖고 설명할 수 있도록 전체적으로 느긋한 타이밍을 사용한다.

---

## HTML 구조

### 기본 레이아웃

```html
<main class="presentation" data-transition="fade-scale" data-theme="dark">
  <div class="slide-viewport">
    <div class="slides" role="region" aria-label="슬라이드" aria-live="polite">
      <section
        class="slide active"
        data-slide-index="0"
        data-bg="#000000"
        role="group"
        aria-roledescription="slide"
        aria-label="슬라이드 1/N"
      >
        <div class="slide-content">
          <!-- 콘텐츠 -->
        </div>
        <aside class="speaker-notes">발표자 노트</aside>
      </section>
    </div>
  </div>
  <div class="progress-bar"><div class="progress-fill"></div></div>
  <div class="slide-number">
    <span class="current">1</span> / <span class="total">N</span>
  </div>
</main>
```

### 슬라이드 유형별 마크업

#### 타이틀 슬라이드

```html
<section class="slide slide--title" data-bg="#000000">
  <div class="slide-content">
    <span class="label">카테고리</span>
    <h1 class="glow-text">발표 제목</h1>
    <p class="subtitle">부제목</p>
    <div class="divider"></div>
    <p class="author">발표자 이름</p>
  </div>
</section>
```

- `.label`: pill 형태의 카테고리 태그 (`border-radius: 100px`, 반투명 배경)
- `.glow-text`: 흰색→반투명 그라디언트 텍스트
- `.divider`: 얇은 구분선 (`width: 40px; height: 1px`)

#### 콘텐츠 슬라이드 (빌드 효과)

```html
<section class="slide" data-bg="#000000">
  <div class="slide-content">
    <h2>제목</h2>
    <ul>
      <li data-step="1" data-anim="fade-up">첫 번째 항목</li>
      <li data-step="2" data-anim="fade-up">두 번째 항목</li>
    </ul>
  </div>
</section>
```

#### 2단 레이아웃

```html
<div class="columns">
  <div class="col">왼쪽</div>
  <div class="col">오른쪽</div>
</div>
```

`.col`은 `backdrop-filter: blur(20px)`, `border-radius: 16px` 적용.

#### 코드 슬라이드 — macOS 윈도우 스타일

코드 블록은 macOS 윈도우 크롬(PolarCode 스타일)으로 표시한다. 빨간/노란/초록 3색 트래픽 라이트 dot + 파일명 타이틀바.

```html
<div class="code-window">
  <div class="code-titlebar">
    <span class="code-dot code-dot--close"></span>
    <span class="code-dot code-dot--minimize"></span>
    <span class="code-dot code-dot--maximize"></span>
    <span class="code-title">index.html</span>
  </div>
  <pre><code data-lang="javascript" data-highlight-lines="2,4">
function hello() {
  const msg = "Hello!";
  console.log(msg);
  return msg;
}
  </code></pre>
</div>
```

CSS:

```css
.code-window {
  background: #1a1a1a;
  border-radius: 10px;
  border: 1px solid var(--border);
  overflow: hidden;
}
.code-titlebar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: #2a2a2a;
  border-bottom: 1px solid var(--border);
}
.code-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.code-dot--close {
  background: #ff5f57;
}
.code-dot--minimize {
  background: #febc2e;
}
.code-dot--maximize {
  background: #28c840;
}
.code-title {
  margin-left: 8px;
  font-size: 1.5vmin;
  color: var(--text-muted);
}
```

JS의 `wrapCodeBlocks()` 메서드가 `.code-window`로 감싸지 않은 `<pre>` 태그도 자동으로 macOS 윈도우 스타일로 변환한다.

#### Feature Grid

```html
<div class="feature-grid">
  <div class="feature-card">
    <h3>제목</h3>
    <p>설명</p>
  </div>
</div>
```

`.feature-card`: 반투명 배경 + blur + `border-radius: 16px`.

---

## Lottie 애니메이션 (선택적)

내용에 맞는 경우에만 Lottie를 사용한다. 장식 목적으로 무분별하게 삽입하지 않는다.

### 적절한 사용 예시

- 타이틀 슬라이드: 주제와 관련된 아이콘 애니메이션
- 데이터/성과 슬라이드: 그래프나 숫자가 올라가는 애니메이션
- 완료/감사 슬라이드: 체크마크 또는 축하 애니메이션

### 사용하지 않는 경우

- 코드 슬라이드, 비교 슬라이드 등 정보 밀도가 높은 슬라이드
- 맥락 없이 단순 장식 목적

### 구현

CDN 스크립트를 `<head>`에 추가:

```html
<script
  type="module"
  src="https://unpkg.com/@lottiefiles/dotlottie-wc@latest/dist/dotlottie-wc.js"
></script>
```

태그명은 반드시 `<dotlottie-wc>` (dotlottie-player 아님):

```html
<div class="lottie-wrap">
  <dotlottie-wc src="https://lottie.host/xxx/yyy.lottie" autoplay loop>
  </dotlottie-wc>
</div>
```

```css
.lottie-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 2vmin;
}
.lottie-wrap dotlottie-wc {
  display: block;
  width: 16vmin;
  height: 16vmin;
}
```

사용 가능한 공식 테스트 URL:

- `https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie`

---

## CSS 레이아웃

### Grid + Absolute 하이브리드

```css
.presentation {
  display: grid;
  place-items: center;
  width: 100vw;
  height: 100vh;
  background: #000; /* 단색 검정, 그라디언트 없음 */
}

.slide-viewport {
  position: relative;
  width: min(100vw, calc(100vh * 16 / 9));
  height: min(100vh, calc(100vw * 9 / 16));
  overflow: hidden;
  background: var(--bg); /* #000000 */
}

.slide {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  opacity: 0;
  visibility: hidden;
  contain: content;
  color: var(--text);
}
```

### 빌드 효과

```css
[data-step] {
  opacity: 0;
  transition:
    opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
[data-step].visible {
  opacity: 1;
}

/* 효과 목록 */
[data-anim='fade-up'] {
  transform: translateY(24px);
}
[data-anim='fade-up'].visible {
  transform: translateY(0);
}
[data-anim='fade-left'] {
  transform: translateX(-30px);
}
[data-anim='fade-left'].visible {
  transform: translateX(0);
}
[data-anim='fade-right'] {
  transform: translateX(30px);
}
[data-anim='fade-right'].visible {
  transform: translateX(0);
}
[data-anim='scale-in'] {
  transform: scale(0.85);
}
[data-anim='scale-in'].visible {
  transform: scale(1);
}
```

### 프로그레스 바

```css
.progress-fill {
  background: rgba(255, 255, 255, 0.5); /* 은은한 흰색, 빨간색 아님 */
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 줄 강조 (코드)

```css
.line-hl {
  background: rgba(255, 255, 255, 0.06);
  border-left: 2px solid var(--text-muted);
}
.line-dim {
  opacity: 0.35;
}
```

---

## JavaScript 엔진

### SlideEngine 클래스

전체 프레젠테이션을 관리하는 단일 클래스. `goTo()` 메서드가 모든 상태 변경의 중심축.

핵심 기능:

- **슬라이드 전환** — fade-scale(기본) / fade / slide / zoom (Web Animation API)
- **빌드 스텝** — `data-step` 기반 순차 등장, Space로 빌드→다음 슬라이드 자연 연결
- **이벤트 잠금** — `isAnimating` 플래그 + `animation.finished` Promise + `pointerEvents: none`
- **키보드** — ArrowLeft/Right, Space, PageUp/Down, Home/End
- **터치/스와이프** — Pointer Events API 기반
- **URL hash 동기화** — `#slide-1` 형식, replaceState 기본
- **코드 블록 자동 변환** — `wrapCodeBlocks()`가 `<pre>` 태그를 macOS 윈도우로 자동 래핑
- **코드 하이라이트** — `data-highlight-lines` 파싱 후 span 래핑 + 기본 문법 색상
- **발표자 노트** — `N` 키로 토글

### 전환 효과

**기본값: `fade-scale`** — 페이드하면서 미세하게 크기가 변하는 차분한 전환. `data-transition="fade-scale"`로 설정.

| 효과 | 설명 | 사용 시점 |
|------|------|-----------|
| `fade-scale` | 페이드 + 미세 스케일 (97%↔102%). 기본값. 가장 차분함. | 대부분의 발표 |
| `fade` | 순수 교차 페이드. 움직임 없음. | 최소한의 전환 |
| `slide` | 좌우 20% 이동 + 페이드. | 스토리 흐름이 있는 발표 |
| `zoom` | 확대/축소 (92%↔108%). | 임팩트가 필요한 장면 |

```javascript
// fade-scale (기본값, 권장)
case 'fade-scale':
  outKf = [{transform:'scale(1)', opacity:1}, {transform:'scale(0.97)', opacity:0}];
  inKf  = [{transform:'scale(1.02)', opacity:0}, {transform:'scale(1)', opacity:1}];
  break;
```

`slide` 전환은 정신없어 보일 수 있으므로 기본값으로 사용하지 않는다.

### 키보드 단축키

| 키                     | 동작                  |
| ---------------------- | --------------------- |
| `→` `Space` `PageDown` | 다음 (빌드 스텝 우선) |
| `←` `PageUp`           | 이전 (빌드 스텝 역순) |
| `Home`                 | 첫 슬라이드           |
| `End`                  | 마지막 슬라이드       |
| `F`                    | 전체화면 토글         |
| `N`                    | 발표자 노트 토글      |
| `O`                    | 슬라이드 오버뷰       |

---

## 생성 시 유의사항

1. **단일 파일** — 모든 CSS와 JS를 HTML 내 `<style>`, `<script>` 태그에 인라인 포함.
2. **배경색** — 반드시 `#000000`. `data-bg="#000000"` 통일. 보라색/회색 톤 사용 금지.
3. **강조색** — 흰색 (`#fbfbfb`). 빨간색 사용 금지. `strong` 태그 색상도 흰색.
4. **코드 블록** — macOS 윈도우 스타일 (3색 dot 타이틀바). JS의 `wrapCodeBlocks()`가 자동 처리하지만, HTML에서 직접 `.code-window`로 감싸고 파일명을 지정하는 것이 더 좋다.
5. **Lottie** — 내용에 맞는 경우에만 사용. 장식 목적 금지. 태그명 `<dotlottie-wc>`.
6. **폰트** — system-ui 폰트 스택. 사용자 요청 시 Google Fonts 추가 가능.
7. **슬라이드 수** — 사용자가 지정하지 않으면 5~10장.
8. **빌드 효과** — 리스트 항목은 기본적으로 `data-step` 부여. 같은 step 그룹은 자동 stagger(100ms 간격).
9. **전환 효과** — 기본값은 `data-transition="fade-scale"`. `slide` 전환은 정신없어 보일 수 있으므로 기본값으로 사용하지 않는다.
10. **카드/서피스** — `backdrop-filter: blur(20px)` + `border-radius: 16px` + `border: 1px solid #222`.
11. **이징** — 모든 transition/animation에 `cubic-bezier(0.16, 1, 0.3, 1)` 사용.
12. **접근성** — ARIA 속성, 키보드 네비게이션, 색상 대비 유지.

---

## 실제 구현 참고

`examples/vanilla-slides-demo.html` 파일이 이 스킬로 생성된 실제 프레젠테이션의 완전한 예시이다.
새 프레젠테이션을 생성할 때는 이 파일의 구조와 스타일을 기준으로 삼되, 사용자의 콘텐츠에 맞게 슬라이드를 구성한다.

## 상세 레퍼런스

- `references/layout.md` — 레이아웃, DOM 구조, 반응형, 16:9 비율 고정
- `references/navigation.md` — 키보드, 터치, URL hash, 프로그레스 바
- `references/transitions.md` — 전환 애니메이션, GPU 최적화, 이벤트 잠금
- `references/content-animation.md` — 빌드 효과, 코드 하이라이트, 발표자 노트
