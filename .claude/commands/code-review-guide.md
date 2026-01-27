# Code Review Guide

빠른 코드 리뷰 피드백을 제공합니다.

**중요**: 이 스킬은 간단한 피드백용입니다. 상세 분석은 `/review` 명령어를 사용하세요.

## 사용법

```bash
# 빠른 코드 리뷰
/code-review-guide <파일경로>

# 또는 코드 스니펫 직접 전달
/code-review-guide
```

## When to Apply

**적용 상황:**
- "이 코드 어때?"
- "리뷰해줘"
- "문제 없어?"
- "개선할 점은?"
- 코드 공유 + 피드백 요청

**적용하지 않는 경우:**
- 상세 분석 명시적 요청 → `/review` 사용
- Before/After 코드 필요 → `/review` 사용
- 리팩토링 방향 제시 필요 → `/refactor` 사용

## Review Process

### 1. CLAUDE.md 원칙 참조

코드 리뷰 시 `CLAUDE.md의 코드 작성 가이드라인` 섹션을 기준으로 검토합니다.

### 2. 즉시 확인 가능한 명백한 문제 분류

#### 🔴 Critical (즉시 지적)
- Props Drilling 3단계 이상
- any 타입 남용 (타입 안전성)
- 버그 발생 가능성 있는 로직

#### 🟡 Suggestion (간단히 언급)
- 매직 넘버 (상수화 안 됨)
- 복잡한 삼항 연산자 (중첩)
- 인라인 스타일 (Emotion 미사용)

#### 🟢 Nice to have (선택적)
- 더 나은 네이밍
- 추가 타입 정의

### 3. 우선순위 분류 기준

| 우선순위 | 설명 | 예시 |
|---------|------|------|
| 🔴 Critical | 반드시 수정 | Props Drilling 3단계, any 타입, 버그 위험 |
| 🟡 Suggestion | 개선 권장 | 복잡한 조건문, 매직 넘버 |
| 🟢 Nice to have | 선택적 | 더 나은 네이밍, 추가 타입 |

### 4. 응답 형식 (우선순위 명확히 표시)

```markdown
## 🔍 빠른 코드 리뷰

### ✅ 잘된 점
- [1-2개 장점]

### 🔴 Critical (반드시 수정)
- [명백한 심각한 문제]

### 🟡 Suggestion (개선 권장)
- [품질 개선 항목]

### 🟢 Nice to have (선택적)
- [선택적 개선사항]

### 📝 상세 분석
Before/After 코드와 상세 분석: `/review <파일경로>`
```

## Detailed Review Checklist

### 1. Readability (가독성)

**참조**: `CLAUDE.md의 가독성 (Readability) 섹션`

- [ ] 매직 넘버를 설명적인 상수로 네이밍했는가?
- [ ] 복잡한 로직을 전용 컴포넌트로 추상화했는가?
- [ ] 조건부 렌더링을 별도 코드 경로로 분리했는가?
- [ ] 복잡한 삼항 연산자를 단순화했는가?
- [ ] 간단한 로직을 한 곳에 모아 눈의 이동을 줄였는가?
- [ ] 복잡한 조건을 의미있는 변수명으로 명명했는가?

### 2. Predictability (예측가능성)

**참조**: `CLAUDE.md의 예측 가능성 (Predictability) 섹션`

- [ ] 유사한 함수/훅의 반환 타입이 표준화되었는가?
- [ ] 숨겨진 로직이 없는가? (단일 책임 원칙)
- [ ] 고유하고 설명적인 이름을 사용하여 모호함을 피했는가?
- [ ] 함수 시그니처만으로 동작을 예측할 수 있는가?

### 3. Cohesion (응집성)

**참조**: `CLAUDE.md의 응집성 (Cohesion) 섹션`

- [ ] 관련된 코드가 잘 정의된 모듈에 함께 있는가?
- [ ] 폼 응집성을 고려했는가? (필드 레벨 vs 폼 레벨)
- [ ] 타입별이 아닌 기능/도메인별로 코드를 구성했는가?
- [ ] 매직 넘버가 관련 로직과 연결되어 있는가?

### 4. Coupling (결합도)

**참조**: `CLAUDE.md의 결합도 (Coupling) 섹션`

- [ ] 추상화와 결합도의 균형을 맞췄는가? (무리한 추상화 피하기)
- [ ] 상태 관리를 작고 집중된 훅으로 범위화했는가?
- [ ] Props Drilling을 컴포넌트 컴포지션으로 제거했는가?
- [ ] 코드베이스의 다른 부분과의 의존성을 최소화했는가?

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

## Recommend /review When

다음 경우 **반드시** `/review` 명령어를 추천하세요:

✅ 여러 파일 리뷰 필요
✅ Before/After 코드 필요
✅ 상세한 우선순위 분류 필요
✅ 리팩토링 방향 제시 필요
✅ 커밋 전 최종 검증

## Important Guidelines

### DO
- ✅ 명백한 문제만 즉시 지적
- ✅ `/review` 적극 추천
- ✅ CLAUDE.md 원칙 참조
- ✅ 간결한 피드백 (3-5줄)

### DO NOT
- ❌ CLAUDE.md 내용 복사 금지
- ❌ Before/After 코드 자동 생성 금지
- ❌ 원하지 않는 자동 리뷰 금지
- ❌ 긴 설명 금지 (토큰 낭비)

## Example Responses

### Example 1: Props Drilling 발견

**User Request**: "이 UserProfile 컴포넌트 어때?"

**Response**:
```markdown
## 🔍 빠른 코드 리뷰

### ✅ 잘된 점
- 타입 정의 명확함
- 컴포넌트 네이밍 좋음

### 🔴 Critical (반드시 수정)
- Props Drilling 발견 (UserProfile → UserCard → UserAvatar, 3단계)

### 📝 상세 분석
Before/After 코드: `/review src/components/UserProfile/index.tsx`
```

### Example 2: 매직 넘버

**User Request**: "이 애니메이션 코드 문제 없어?"

**Response**:
```markdown
## 🔍 빠른 코드 리뷰

### ✅ 잘된 점
- 애니메이션 로직 명확함

### 🟡 Suggestion (개선 권장)
- 매직 넘버 300ms → ANIMATION_DELAY 상수화
- 매직 넘버 0.5 → OPACITY_REDUCED 상수화

### 📝 상세 분석
상수화 방법: `/review src/animations/fadeIn.ts`
```

### Example 3: 모든 것이 좋은 경우

**User Request**: "Button 컴포넌트 어때?"

**Response**:
```markdown
## 🔍 빠른 코드 리뷰

### ✅ 잘된 점
- 명확한 타입 정의
- 단일 책임 원칙 준수
- 스타일 분리 완벽
- Props 간결함

### 🎉 완벽합니다!
모든 코드 품질 원칙을 준수하고 있습니다.
```

### Example 4: 여러 문제 발견

**User Request**: "Dashboard 페이지 리뷰해줘"

**Response**:
```markdown
## 🔍 빠른 코드 리뷰

### 🔴 Critical (반드시 수정)
- Props Drilling 발견 (3단계)
- 복잡한 컴포넌트 (250줄, 분리 필요)

### 🟡 Suggestion (개선 권장)
- 매직 넘버 5개 상수화 필요

### 📝 상세 분석 및 리팩토링
`/review src/pages/Dashboard.tsx`

💡 대규모 리팩토링이 필요해 보입니다. `/refactor` 명령어 사용을 추천합니다.
```

## Key Differences: code-review-guide vs /review

| 항목 | /code-review-guide | /review |
|------|-------------------|---------|
| 길이 | 3-5줄 | 50-100줄 |
| 코드 | 언급만 | Before/After 필수 |
| 상세도 | 간략 | 완전 |
| 우선순위 | 간단히 | 명확히 분류 |
| 목적 | 빠른 확인 | 완벽한 분석 |

## 연계 명령어

| 상황 | 명령어 | 설명 |
|------|--------|------|
| 빠른 피드백 | `/code-review-guide` | 간략한 코드 리뷰 |
| 상세 분석 | `/review` | 완전한 코드 분석 |
| 리팩토링 | `/refactor` | 코드 개선 |
| 테스트 | `/test` | 테스트 코드 생성 |
| 커밋 | `/commit` | 변경사항 커밋 |

빠르고 간결한 코드 피드백을 제공합니다! 상세 분석이 필요하면 `/review` 명령어를 사용하세요.
