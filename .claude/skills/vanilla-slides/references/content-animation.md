# 콘텐츠 애니메이션 & 빌드 효과 레퍼런스

## 목차
1. [빌드 스텝 관리](#1-빌드-스텝-관리)
2. [CSS 등장 효과](#2-css-등장-효과)
3. [코드 하이라이트](#3-코드-하이라이트)
4. [발표자 노트](#4-발표자-노트)

---

## 1. 빌드 스텝 관리

### data-step 설계

```html
<ul>
  <li data-step="1" data-anim="fade-up">첫 번째</li>
  <li data-step="2" data-anim="fade-up">두 번째</li>
  <li data-step="3" data-anim="fade-up">세 번째</li>
</ul>
```

같은 data-step 값 = 동시 등장.

### 빌드 로직

```javascript
getMaxStep(slideIndex) {
  const steps = this.slides[slideIndex].querySelectorAll('[data-step]');
  if (!steps.length) return 0;
  return Math.max(...Array.from(steps).map(el => parseInt(el.dataset.step)));
}

applySteps() {
  const slide = this.slides[this.currentSlide];
  slide.querySelectorAll('[data-step]').forEach(el => {
    const step = parseInt(el.dataset.step);
    const delay = parseInt(el.dataset.delay || '0');
    if (step <= this.currentStep) {
      el.style.transitionDelay = `${delay}ms`;
      el.classList.add('visible');
    } else {
      el.style.transitionDelay = '0ms';
      el.classList.remove('visible');
    }
  });
}
```

### Space 키 통합 흐름

1. 빌드할 스텝이 남아있으면 → `currentStep++` + `applySteps()`
2. 빌드 완료 상태에서 → 다음 슬라이드로 전환
3. 뒤로 가기 시 → 이전 슬라이드는 모든 빌드 완료 상태로 표시

---

## 2. CSS 등장 효과

### 기본 구조

```css
[data-step] {
  opacity: 0;
  transition: opacity 0.5s ease, transform 0.5s ease;
}
[data-step].visible { opacity: 1; }
```

### 효과 목록

```css
[data-anim="fade-up"]         { transform: translateY(30px); }
[data-anim="fade-up"].visible { transform: translateY(0); }

[data-anim="fade-down"]         { transform: translateY(-30px); }
[data-anim="fade-down"].visible { transform: translateY(0); }

[data-anim="fade-left"]         { transform: translateX(-40px); }
[data-anim="fade-left"].visible { transform: translateX(0); }

[data-anim="fade-right"]         { transform: translateX(40px); }
[data-anim="fade-right"].visible { transform: translateX(0); }

[data-anim="scale-in"]         { transform: scale(0.7); }
[data-anim="scale-in"].visible { transform: scale(1); }

[data-anim="blur-in"]         { filter: blur(8px); transition: opacity 0.5s, filter 0.6s; }
[data-anim="blur-in"].visible { filter: blur(0); }
```

### Stagger (시차) 효과

같은 data-step의 요소들에 자동 시차 부여:

```javascript
const groups = {};
slide.querySelectorAll('[data-step]').forEach(el => {
  const s = el.dataset.step;
  (groups[s] ||= []).push(el);
});
Object.values(groups).forEach(els => {
  els.forEach((el, i) => {
    if (parseInt(el.dataset.step) <= this.currentStep) {
      el.style.transitionDelay = `${i * 80}ms`;
      el.classList.add('visible');
    }
  });
});
```

---

## 3. 코드 하이라이트

### 줄 강조

```html
<pre><code data-highlight-lines="1,3-5">...</code></pre>
```

```javascript
function applyLineHighlights() {
  document.querySelectorAll('code[data-highlight-lines]').forEach(block => {
    const set = parseLineSpec(block.dataset.highlightLines);
    const lines = block.textContent.split('\n');
    block.innerHTML = lines.map((line, i) => {
      const cls = set.has(i + 1) ? 'line-hl' : 'line-dim';
      const escaped = line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      return `<span class="${cls}">${escaped}</span>`;
    }).join('\n');
  });
}

function parseLineSpec(spec) {
  const result = new Set();
  spec.split(',').forEach(p => {
    p = p.trim();
    if (p.includes('-')) {
      const [a, b] = p.split('-').map(Number);
      for (let i = a; i <= b; i++) result.add(i);
    } else result.add(Number(p));
  });
  return result;
}
```

### 기본 문법 강조 (선택적)

```javascript
function highlightSyntax(code) {
  return code
    .replace(/(["'`])(?:(?!\1|\\).|\\.)*\1/g, '<span class="syn-str">$&</span>')
    .replace(/(\/\/.*$)/gm, '<span class="syn-cmt">$&</span>')
    .replace(/\b(const|let|var|function|return|if|else|for|class|import|export|async|await)\b/g,
      '<span class="syn-kw">$&</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="syn-num">$&</span>');
}
```

---

## 4. 발표자 노트

### 마크업

```html
<aside class="speaker-notes">
  이 슬라이드에서 강조할 포인트...
</aside>
```

기본 `display: none`, N 키로 토글.

### BroadcastChannel 동기화

```javascript
const channel = new BroadcastChannel('slide-sync');

// 메인 창 → 발표자 창
channel.postMessage({
  type: 'slide-change',
  slideIndex: index,
  step: currentStep,
  notes: slide.querySelector('.speaker-notes')?.innerHTML || '',
  nextTitle: nextSlide?.querySelector('h1,h2')?.textContent || '마지막'
});

// 발표자 창 → 메인 창 (양방향)
channel.onmessage = (e) => {
  if (e.data.type === 'command') {
    e.data.action === 'next' ? engine.next() : engine.prev();
  }
};
```

### localStorage 폴백

BroadcastChannel 미지원 시 localStorage + storage 이벤트로 대체 가능.
