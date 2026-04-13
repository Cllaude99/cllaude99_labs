# 키보드 & 네비게이션 레퍼런스

## 목차
1. [키보드 이벤트 처리](#1-키보드-이벤트-처리)
2. [URL Hash 동기화](#2-url-hash-동기화)
3. [터치/스와이프 제스처](#3-터치스와이프-제스처)
4. [프로그레스 바 & 슬라이드 번호](#4-프로그레스-바--슬라이드-번호)

---

## 1. 키보드 이벤트 처리

### 키 매핑

```javascript
const KEYS = {
  NEXT: ['ArrowRight', 'ArrowDown', ' ', 'PageDown'],
  PREV: ['ArrowLeft', 'ArrowUp', 'PageUp'],
  FIRST: ['Home'],
  LAST: ['End'],
};
```

### 이벤트 핸들러

```javascript
document.addEventListener('keydown', (e) => {
  // 입력 필드 포커스 시 무시
  const tag = e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
  if (e.target.isContentEditable) return;

  // 반복 키 입력 방지
  if (e.repeat) return;

  if (KEYS.NEXT.includes(e.key)) {
    e.preventDefault();
    engine.next();
  } else if (KEYS.PREV.includes(e.key)) {
    e.preventDefault();
    engine.prev();
  }
});
```

### keydown 선택 이유
- `e.preventDefault()`로 Space의 페이지 스크롤 차단 가능 (keyup에서는 불가)
- `e.repeat`로 길게 누르기 감지 가능

---

## 2. URL Hash 동기화

### 하이브리드 방식 (권장)

```javascript
function goTo(index, addHistory = false) {
  const url = `#slide-${index + 1}`;
  if (addHistory) {
    history.pushState({ slide: index }, '', url);
  } else {
    history.replaceState({ slide: index }, '', url);
  }
}
```

- 순차 이동(화살표 키): `replaceState` — 히스토리 오염 방지
- 점프(썸네일 클릭): `pushState` — 뒤로가기로 복원 가능

### 초기 로드 & 뒤로가기

```javascript
function parseHash() {
  const match = location.hash.match(/^#slide-(\d+)$/);
  return match ? parseInt(match[1], 10) - 1 : 0;
}

window.addEventListener('DOMContentLoaded', () => goTo(parseHash()));
window.addEventListener('popstate', (e) => {
  goTo(e.state?.slide ?? parseHash());
});
```

---

## 3. 터치/스와이프 제스처

### Pointer Events API (권장)

```javascript
const SWIPE_THRESHOLD = 50;
const SWIPE_TIME_LIMIT = 300;
let ptrStart = { x: 0, y: 0, time: 0, id: null };

container.addEventListener('pointerdown', (e) => {
  ptrStart = { x: e.clientX, y: e.clientY, time: Date.now(), id: e.pointerId };
  container.setPointerCapture(e.pointerId);
});

container.addEventListener('pointerup', (e) => {
  if (e.pointerId !== ptrStart.id) return;
  const dx = e.clientX - ptrStart.x;
  const dy = e.clientY - ptrStart.y;
  const elapsed = Date.now() - ptrStart.time;

  if (elapsed > SWIPE_TIME_LIMIT) return;
  if (Math.abs(dx) < SWIPE_THRESHOLD) return;
  if (Math.abs(dx) < Math.abs(dy) * 1.5) return;

  dx < 0 ? engine.next() : engine.prev();
});
```

### CSS touch-action

```css
.slide-viewport { touch-action: pan-y; }
```

수직 스크롤만 브라우저에게 위임, 수평 스와이프는 JS에서 처리.

---

## 4. 프로그레스 바 & 슬라이드 번호

```javascript
function updateUI() {
  const progress = ((currentSlide + 1) / totalSlides) * 100;
  progressFill.style.width = `${progress}%`;
  currentEl.textContent = currentSlide + 1;
}
```

```css
.progress-bar { position: fixed; bottom: 0; left: 0; width: 100%; height: 3px; }
.progress-fill { height: 100%; background: var(--accent); transition: width 0.4s ease; }
```
