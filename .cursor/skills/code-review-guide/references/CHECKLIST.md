# Code Review Detailed Checklist

**참조**: `@.cursor/commands/review.md`

이 체크리스트는 `/review` 명령어의 상세 검토 기준입니다. Skill에서는 간략 버전만 사용하세요.

---

## 1. Readability (가독성)

**참조**: `@.cursor/rules/code-quality/readability.mdc`

- [ ] 매직 넘버를 설명적인 상수로 네이밍했는가?
- [ ] 복잡한 로직을 전용 컴포넌트로 추상화했는가?
- [ ] 조건부 렌더링을 별도 코드 경로로 분리했는가?
- [ ] 복잡한 삼항 연산자를 단순화했는가?
- [ ] 간단한 로직을 한 곳에 모아 눈의 이동을 줄였는가?
- [ ] 복잡한 조건을 의미있는 변수명으로 명명했는가?

---

## 2. Predictability (예측가능성)

**참조**: `@.cursor/rules/code-quality/predictability.mdc`

- [ ] 유사한 함수/훅의 반환 타입이 표준화되었는가?
- [ ] 숨겨진 로직이 없는가? (단일 책임 원칙)
- [ ] 고유하고 설명적인 이름을 사용하여 모호함을 피했는가?
- [ ] 함수 시그니처만으로 동작을 예측할 수 있는가?

---

## 3. Cohesion (응집성)

**참조**: `@.cursor/rules/code-quality/cohesion.mdc`

- [ ] 관련된 코드가 잘 정의된 모듈에 함께 있는가?
- [ ] 폼 응집성을 고려했는가? (필드 레벨 vs 폼 레벨)
- [ ] 타입별이 아닌 기능/도메인별로 코드를 구성했는가?
- [ ] 매직 넘버가 관련 로직과 연결되어 있는가?

---

## 4. Coupling (결합도)

**참조**: `@.cursor/rules/code-quality/coupling.mdc`

- [ ] 추상화와 결합도의 균형을 맞췄는가? (무리한 추상화 피하기)
- [ ] 상태 관리를 작고 집중된 훅으로 범위화했는가?
- [ ] Props Drilling을 컴포넌트 컴포지션으로 제거했는가?
- [ ] 코드베이스의 다른 부분과의 의존성을 최소화했는가?

---

## Priority Classification

### 🔴 Critical (반드시 수정)
- 버그 발생 가능성
- 보안 문제
- 명백한 규칙 위반
- Props Drilling 3단계 이상
- 타입 안전성 문제

### 🟡 Suggestion (개선 권장)
- 코드 품질 개선
- 유지보수성 향상
- 가독성 개선
- 성능 최적화 여지

### 🟢 Nice to have (선택적)
- 스타일 개선
- 더 나은 네이밍
- 추가 타입 정의
- 선택적 리팩토링
