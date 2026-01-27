# Code Review Examples

빠른 코드 리뷰 Skill의 응답 예시 모음입니다.

---

## Example 1: Props Drilling 발견

### User Request
```
"이 UserProfile 컴포넌트 어때?"
```

### Skill Response (간략)
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

### /review Response (상세)
```markdown
## 📊 코드 리뷰 결과: UserProfile

### 🔴 Critical

#### 1. Props Drilling 발견 (Coupling 위반)
**위치**: UserProfile → UserCard → UserAvatar (3단계)
**참조**: @.cursor/rules/code-quality/coupling.mdc

**문제**:
```tsx
// ❌ 현재
<UserProfile userId={userId}>
  <UserCard userId={userId}>
    <UserAvatar userId={userId} />
  </UserCard>
</UserProfile>
```

**해결**:
```tsx
// ✅ 개선
const UserContext = createContext<{ userId: string }>();
// ... 상세 코드
```
```

---

## Example 2: 매직 넘버

### User Request
```
"이 애니메이션 코드 문제 없어?"
```

### Skill Response (간략)
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

---

## Example 3: 복잡한 조건문

### User Request
```
"이 validation 로직 리뷰해줘"
```

### Skill Response (간략)
```markdown
## 🔍 빠른 코드 리뷰

### ✅ 잘된 점
- 검증 로직 완전함

### 🟡 Suggestion (개선 권장)
- 중첩된 삼항 연산자로 가독성 저하

### 📝 상세 분석
개선 방법: `/review src/utils/validation.ts`
```

### /review Response (상세)
```markdown
#### 1. 복잡한 조건문 (Readability 위반)

**문제**:
```tsx
// ❌ 현재
const status = isActive 
  ? isVerified 
    ? 'ACTIVE_VERIFIED' 
    : 'ACTIVE_UNVERIFIED'
  : 'INACTIVE';
```

**해결**:
```tsx
// ✅ 개선
const status = (() => {
  if (isActive && isVerified) return 'ACTIVE_VERIFIED';
  if (isActive) return 'ACTIVE_UNVERIFIED';
  return 'INACTIVE';
})();
```
```

---

## Example 4: 모든 것이 좋은 경우

### User Request
```
"Button 컴포넌트 어때?"
```

### Skill Response
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

---

## Example 5: 여러 문제 발견

### User Request
```
"Dashboard 페이지 리뷰해줘"
```

### Skill Response (간략)
```markdown
## 🔍 빠른 코드 리뷰

### 🔴 Critical (반드시 수정)
- Props Drilling 발견 (3단계)
- 복잡한 컴포넌트 (250줄, 분리 필요)

### 🟡 Suggestion (개선 권장)
- 매직 넘버 5개 상수화 필요

### 📝 상세 분석 및 리팩토링
`/review src/pages/Dashboard.tsx`

💡 대규모 리팩토링이 필요해 보입니다. `/refactor` 또는 architecture-refactor 서브에이전트 사용을 추천합니다.
```

---

## Key Differences: Skill vs Command

| 항목 | Skill Response | /review Response |
|------|---------------|------------------|
| 길이 | 3-5줄 | 50-100줄 |
| 코드 | 언급만 | Before/After 필수 |
| 상세도 | 간략 | 완전 |
| 우선순위 | 간단히 | 명확히 분류 |
| 목적 | 빠른 확인 | 완벽한 분석 |
