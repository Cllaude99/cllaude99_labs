---
name: code-review-guide
description: Provide quick code review feedback following @.cursor/rules/code-quality principles. Use when user asks "이 코드 어때?", "리뷰해줘", "문제 없어?", "개선할 점은?" or shares code requesting feedback. For detailed file-based review, recommend /review command.
---

# Code Review Guide

빠른 코드 리뷰 피드백을 제공합니다.

**중요**: 이 Skill은 간단한 피드백용입니다. 상세 분석은 `/review` 명령어를 사용하세요.

## When to Apply

**자동 적용 트리거:**
- "이 코드 어때?"
- "리뷰해줘"
- "문제 없어?"
- "개선할 점은?"
- 코드 공유 + 피드백 요청

**적용하지 않음:**
- 파일 경로만 언급
- 상세 분석 명시적 요청
- `/review` 명령어 사용 시

## Review Process

### 1. Rules 참조
```bash
Read @.cursor/rules/code-quality-principles.mdc
```

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

**참조**: [references/CHECKLIST.md](references/CHECKLIST.md) - Priority Classification

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

**상세 체크리스트는 [references/CHECKLIST.md](references/CHECKLIST.md) 참조**

간략 버전:
1. **Readability** - 가독성 (6개 항목)
2. **Predictability** - 예측가능성 (4개 항목)
3. **Cohesion** - 응집성 (4개 항목)
4. **Coupling** - 결합도 (4개 항목)

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
- ✅ Rules 파일 참조
- ✅ 간결한 피드백 (3-5줄)

### DO NOT
- ❌ Rules 내용 복사 금지
- ❌ Before/After 코드 자동 생성 금지
- ❌ 원하지 않는 자동 리뷰 금지
- ❌ 긴 설명 금지 (토큰 낭비)

## Example Response

```markdown
## 🔍 빠른 코드 리뷰

### ✅ 잘된 점
- Props 타입 정의 명확함
- 컴포넌트 네이밍 좋음

### 🔴 Critical (반드시 수정)
- Props Drilling 발견 (UserProfile → UserCard → UserAvatar, 3단계)

### 🟡 Suggestion (개선 권장)
- 매직 넘버 300 → ANIMATION_DELAY 상수화 필요

### 📝 상세 분석
Before/After 코드 및 해결 방안: `/review src/components/UserProfile/index.tsx`
```

## Additional Resources

- **상세 체크리스트**: [references/CHECKLIST.md](references/CHECKLIST.md)
- **예시 모음**: [references/EXAMPLES.md](references/EXAMPLES.md)
- **Command 참조**: `@.cursor/commands/review.md`
