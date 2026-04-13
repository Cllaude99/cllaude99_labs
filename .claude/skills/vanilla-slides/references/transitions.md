# 슬라이드 전환 애니메이션 레퍼런스

## 목차
1. [애니메이션 API 비교](#1-애니메이션-api-비교)
2. [전환 효과 구현](#2-전환-효과-구현)
3. [GPU 최적화](#3-gpu-최적화)
4. [이벤트 잠금](#4-이벤트-잠금)

---

## 1. 애니메이션 API 비교

| 항목 | CSS Transition | CSS Animation | Web Animation API |
|------|---------------|---------------|-------------------|
| 복잡도 | 낮음 | 중간 | 높음 |
| 동적 제어 | 클래스 토글만 | 제한적 | 완전한 제어 |
| 완료 감지 | transitionend | animationend | Promise (finished) |
| 브라우저 | IE10+ | IE10+ | Chrome 36+, Safari 13.1+ |

**채택: Web Animation API 주력 + CSS Transition 보조**

이유: 이전/다음 슬라이드 동시 제어, 방향별 동적 keyframe, Promise 기반 동기화.

---

## 2. 전환 효과 구현

### Fade

```javascript
async fadeTransition(current, next) {
  next.style.visibility = 'visible';
  const out = current.animate([{opacity:1},{opacity:0}], {duration:500, easing:'ease-in-out', fill:'forwards'});
  const inn = next.animate([{opacity:0},{opacity:1}], {duration:500, easing:'ease-in-out', fill:'forwards'});
  await Promise.all([out.finished, inn.finished]);
  this.cleanup(current, next, out, inn);
}
```

### Slide

```javascript
async slideTransition(current, next, direction) {
  const offset = direction === 'next' ? -100 : 100;
  next.style.visibility = 'visible';
  const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';
  const out = current.animate([{transform:'translateX(0)'},{transform:`translateX(${offset}%)`}], {duration:500, easing, fill:'forwards'});
  const inn = next.animate([{transform:`translateX(${-offset}%)`},{transform:'translateX(0)'}], {duration:500, easing, fill:'forwards'});
  await Promise.all([out.finished, inn.finished]);
  this.cleanup(current, next, out, inn);
}
```

### Zoom

```javascript
async zoomTransition(current, next) {
  next.style.visibility = 'visible';
  const out = current.animate([{transform:'scale(1)',opacity:1},{transform:'scale(1.2)',opacity:0}], {duration:500, fill:'forwards'});
  const inn = next.animate([{transform:'scale(0.8)',opacity:0},{transform:'scale(1)',opacity:1}], {duration:500, fill:'forwards'});
  await Promise.all([out.finished, inn.finished]);
  this.cleanup(current, next, out, inn);
}
```

### cleanup 메서드

```javascript
cleanup(current, next, outAnim, inAnim) {
  current.classList.remove('active');
  current.style.visibility = 'hidden';
  outAnim.cancel();
  next.classList.add('active');
  inAnim.cancel();
  next.style.transform = '';
  next.style.opacity = '';
}
```

### z-index 관리

| 전환 | exiting z | entering z |
|------|-----------|------------|
| Fade | 1 | 2 |
| Slide | 1 | 1 |
| Zoom-in | 2 | 1 |

---

## 3. GPU 최적화

### Compositor-only 속성만 애니메이션

`transform`, `opacity`만 사용 → Composite 단계에서만 처리 → 60fps.

### will-change 동적 적용

```javascript
// 전환 전
next.style.willChange = 'transform, opacity';
// 전환 후
next.style.willChange = 'auto';
```

항상 적용하면 메모리 과다 사용. 필요한 순간에만 설정.

### contain 속성

```css
.slide { contain: content; }
```

슬라이드 내부 변경이 외부에 영향을 주지 않음을 보장.

---

## 4. 이벤트 잠금

### 패턴

```javascript
async goTo(index) {
  if (this.isAnimating) return;
  this.isAnimating = true;
  this.container.style.pointerEvents = 'none';

  try {
    await this.transition(current, next, direction);
    this.currentIndex = index;
  } finally {
    this.isAnimating = false;
    this.container.style.pointerEvents = '';
  }
}
```

- `isAnimating` 플래그로 키보드/터치 입력 차단
- `pointerEvents: none`으로 클릭 완전 차단
- `try/finally`로 에러 발생 시에도 반드시 잠금 해제
