# 슬라이드 레이아웃 & DOM 구조 레퍼런스

## 목차
1. [Full-Viewport CSS 레이아웃 비교](#1-full-viewport-css-레이아웃-비교)
2. [HTML 구조 설계](#2-html-구조-설계)
3. [반응형 구현](#3-반응형-구현)
4. [16:9 비율 고정](#4-169-비율-고정)

---

## 1. Full-Viewport CSS 레이아웃 비교

### Flexbox

```css
.slide-deck {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.slide {
  flex: 0 0 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

- 장점: 콘텐츠 정렬 쉬움, 직관적
- 단점: 비선형 전환(fade 등)에 부적합

### Absolute Positioning

```css
.slide-deck { position: relative; width: 100vw; height: 100vh; overflow: hidden; }
.slide { position: absolute; inset: 0; }
```

- 장점: 겹치기로 다양한 전환 효과 가능 (Reveal.js 방식)
- 단점: 내부 정렬에 추가 래퍼 필요

### CSS Grid (추천)

```css
.slide-deck { display: grid; grid-template: 1fr / 1fr; width: 100vw; height: 100vh; overflow: hidden; }
.slide { grid-area: 1 / 1; display: grid; place-items: center; }
```

- 장점: 겹치기 + 내부 센터링 동시 해결
- 단점: grid-area 겹침 트릭이 비직관적

### 채택: Grid + Absolute 하이브리드

```css
.presentation { display: grid; place-items: center; width: 100vw; height: 100vh; }
.slide-viewport { position: relative; width: min(100vw, calc(100vh * 16/9)); height: min(100vh, calc(100vw * 9/16)); }
.slide { position: absolute; inset: 0; display: grid; place-items: center; }
```

Grid가 뷰포트 센터링과 비율 유지, Absolute가 슬라이드 전환(겹치기) 담당.

---

## 2. HTML 구조 설계

### 전체 구조

```
main.presentation (data-transition, data-theme)
  └─ div.slide-viewport
       └─ div.slides (role="region", aria-live="polite")
            ├─ section.slide (data-slide-index, data-bg, role="group", aria-roledescription="slide")
            │    ├─ div.slide-content
            │    └─ aside.speaker-notes
            ├─ section.slide ...
            └─ section.slide ...
  └─ div.progress-bar > div.progress-fill
  └─ div.slide-number
```

### 시맨틱 요소 선택 근거

| 요소 | 역할 | 이유 |
|------|------|------|
| `<main>` | 프레젠테이션 루트 | 페이지 주요 콘텐츠 |
| `<section>` | 개별 슬라이드 | 독립된 섹션 |
| `<aside>` | 발표자 노트 | 보조 콘텐츠 |
| `<figure>` | 이미지+캡션 | 의미적 묶음 |
| `<nav>` | 네비게이션 버튼 | 탐색 UI |

### data 속성 설계

```html
<!-- 프레젠테이션 레벨 -->
<main data-transition="fade" data-theme="dark">

<!-- 슬라이드 레벨 -->
<section data-slide-index="0" data-bg="#1a1a2e" data-transition="zoom">

<!-- 빌드 요소 레벨 -->
<li data-step="1" data-anim="fade-up">
```

---

## 3. 반응형 구현

### vmin 기반 텍스트 스케일링

```css
.slide h1 { font-size: 5.5vmin; }
.slide h2 { font-size: 4vmin; }
.slide p, .slide li { font-size: 2.5vmin; }
.slide-content { padding: 4vmin; }
```

vmin = vw와 vh 중 작은 값. 가로/세로 모니터 모두 대응.

### transform scale 방식 (대안)

고정 해상도(1920x1080)로 디자인 후 축소/확대.

```javascript
function scaleSlides() {
  const vp = document.querySelector('.slide-viewport');
  const scale = Math.min(vp.clientWidth / 1920, vp.clientHeight / 1080);
  slides.forEach(s => s.style.transform = `scale(${scale})`);
}
window.addEventListener('resize', scaleSlides);
```

- 장점: px 단위로 자유롭게 디자인, Reveal.js 방식
- 단점: JS 필요, 서브픽셀 렌더링 흐림 가능

---

## 4. 16:9 비율 고정

### 모던 방식 (min() 함수)

```css
.slide-viewport {
  width: min(100vw, calc(100vh * 16 / 9));
  height: min(100vh, calc(100vw * 9 / 16));
}
```

### 폴백 (padding-top 해킹)

```css
@supports not (width: min(1px, 2px)) {
  .slide-viewport { width: 100vw; padding-top: 56.25%; position: relative; }
  .slides { position: absolute; inset: 0; }
}
```

### 레터박싱/필러박싱

```css
.presentation {
  display: grid;
  place-items: center;
  background: radial-gradient(ellipse at center, #1a1a2e 0%, #000 70%);
}
```

검은 배경 + 그라디언트로 빈 영역을 부드럽게 처리.
