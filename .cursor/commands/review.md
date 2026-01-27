# Code Review Command

구현된 코드를 프로젝트 규칙과 베스트 프랙티스에 따라 검토하는 명령어입니다.

## 사용법

```bash
# 특정 파일 리뷰
/review <파일경로>

# 현재 수정한 모든 파일 자동 리뷰 (git status 기준)
/review

# 여러 파일 동시 리뷰
/review <파일1> <파일2> <파일3>
```

## 동작 과정

### 파일 경로 지정 시
1. 지정된 파일 읽기
2. Rules 기준으로 분석

### `/review` 단독 실행 시 (파일 경로 없음)
1. **Git 변경사항 확인**: `git status` 실행하여 수정된 파일 목록 확인
2. **대상 파일 선택**: 
   - Modified 파일 (수정됨)
   - Added 파일 (새로 추가됨)
   - Staged 파일 (스테이징됨)
3. **모든 변경 파일 리뷰**: 각 파일을 순차적으로 검토
4. **Rules 참조**: `@.cursor/rules/code-quality-principles` 및 상세 규칙 적용
5. **문제점 분석**: 4가지 핵심 원칙 기준으로 분석
6. **우선순위 분류**: Critical → Suggestion → Nice to have
7. **개선 제안**: 구체적인 수정 방안 및 코드 예시 제공

## 검토 기준

**중요**: 이 명령어는 다음 Rules를 기준으로 검토합니다:

- `@.cursor/rules/code-quality-principles` - 4가지 핵심 원칙
- `@.cursor/rules/code-quality/readability` - 가독성 상세 패턴
- `@.cursor/rules/code-quality/predictability` - 예측가능성 상세 패턴
- `@.cursor/rules/code-quality/cohesion` - 응집성 상세 패턴
- `@.cursor/rules/code-quality/coupling` - 결합도 상세 패턴

### 검토 체크리스트

코드 리뷰 시 다음 항목들을 **반드시** 확인합니다:

#### 1. Readability (가독성)
**참조**: `@.cursor/rules/code-quality/readability.mdc`

- [ ] 매직 넘버를 설명적인 상수로 네이밍했는가?
- [ ] 복잡한 로직을 전용 컴포넌트로 추상화했는가?
- [ ] 조건부 렌더링을 별도 코드 경로로 분리했는가?
- [ ] 복잡한 삼항 연산자를 단순화했는가?
- [ ] 간단한 로직을 한 곳에 모아 눈의 이동을 줄였는가?
- [ ] 복잡한 조건을 의미있는 변수명으로 명명했는가?

#### 2. Predictability (예측가능성)
**참조**: `@.cursor/rules/code-quality/predictability.mdc`

- [ ] 유사한 함수/훅의 반환 타입이 표준화되었는가?
- [ ] 숨겨진 로직이 없는가? (단일 책임 원칙)
- [ ] 고유하고 설명적인 이름을 사용하여 모호함을 피했는가?
- [ ] 함수 시그니처만으로 동작을 예측할 수 있는가?

#### 3. Cohesion (응집성)
**참조**: `@.cursor/rules/code-quality/cohesion.mdc`

- [ ] 관련된 코드가 잘 정의된 모듈에 함께 있는가?
- [ ] 폼 응집성을 고려했는가? (필드 레벨 vs 폼 레벨)
- [ ] 타입별이 아닌 기능/도메인별로 코드를 구성했는가?
- [ ] 매직 넘버가 관련 로직과 연결되어 있는가?

#### 4. Coupling (결합도)
**참조**: `@.cursor/rules/code-quality/coupling.mdc`

- [ ] 추상화와 결합도의 균형을 맞췄는가? (무리한 추상화 피하기)
- [ ] 상태 관리를 작고 집중된 훅으로 범위화했는가?
- [ ] Props Drilling을 컴포넌트 컴포지션으로 제거했는가?
- [ ] 코드베이스의 다른 부분과의 의존성을 최소화했는가?

## 리뷰 결과 형식

```markdown
## 📊 코드 리뷰 결과

### ✅ 잘된 점
- 명확한 네이밍으로 가독성이 높음
- 단일 책임 원칙을 잘 지킴

### 🔴 Critical (반드시 수정)
1. **Props Drilling 발견**
   - 위치: `UserProfile` → `UserCard` → `UserAvatar`
   - 문제: 3단계 Props 전달
   - 해결: 컴포지션 패턴 적용 또는 Context 사용

### 🟡 Suggestion (개선 권장)
1. **복잡한 조건문**
   - 위치: `handleSubmit` 함수 내부
   - 문제: 중첩된 삼항 연산자로 가독성 저하
   - 해결: 조건을 명명된 변수로 분리

### 🟢 Nice to have (선택적)
1. **타입 개선**
   - 현재: `any` 타입 사용
   - 제안: 구체적인 타입 정의

## 🔧 수정 제안 코드
[구체적인 코드 예시 제공]
```

## 실행 단계

### 단계 1: 대상 파일 확인

#### 파일 경로 지정 시
```bash
# 지정된 파일 읽기
Read <파일경로>
```

#### `/review` 단독 실행 시
```bash
# 1. Git 상태 확인
git status

# 2. 변경된 파일 목록 추출
# - Modified (수정됨)
# - Added (새로 추가됨)
# - Staged (스테이징됨)

# 3. 각 파일 읽기
Read <변경된파일1>
Read <변경된파일2>
Read <변경된파일3>

# 4. 변경 내용 확인
git diff <파일>
```

### 단계 2: Rules 참조
```bash
# 핵심 원칙 확인
Read @.cursor/rules/code-quality-principles.mdc

# 필요시 상세 규칙 참조
Read @.cursor/rules/code-quality/readability.mdc
Read @.cursor/rules/code-quality/predictability.mdc
Read @.cursor/rules/code-quality/cohesion.mdc
Read @.cursor/rules/code-quality/coupling.mdc
```

### 단계 3: 분석 및 피드백

**중요**: 각 문제점에 대해 다음을 **반드시** 포함해야 합니다:

1. **문제 식별**
   - 위반된 원칙 명시 (Readability/Predictability/Cohesion/Coupling)
   - 정확한 위치 (파일명, 함수명, 라인 번호)
   - 해당 Rules 파일 참조 링크

2. **문제 설명**
   - 왜 문제인지 명확하게 설명
   - 실제 Rules 내용 인용

3. **해결 방안**
   - Before/After 코드 예시 **필수**
   - 구체적인 수정 방법
   - 대안이 있다면 함께 제시

4. **우선순위 분류**
   - 🔴 Critical: 버그, 보안 문제, 명백한 규칙 위반
   - 🟡 Suggestion: 코드 품질 개선, 유지보수성
   - 🟢 Nice to have: 선택적 개선사항

### 단계 4: 리팩토링 제안
- **간단한 수정**: 즉시 수정 코드 제공
- **복잡한 리팩토링**: `/refactor` 또는 Subagent 사용 권장

## 리팩토링 연계

### 간단한 수정 (단일 파일)
```bash
/review src/components/Button/index.tsx
# 문제 발견 시
/refactor src/components/Button/index.tsx
```

### 복잡한 리팩토링 (여러 파일, 아키텍처 변경)
```bash
/review src/pages/Dashboard.tsx
# 대규모 리팩토링 필요 시
"Dashboard 컴포넌트를 @.cursor/rules/code-quality 기준에 맞게 리팩토링해줘"
→ architecture-refactor Subagent 자동 실행
```

**중요**: Subagent는 자동으로 `@.cursor/rules/code-quality` 규칙을 참조합니다.

## 연계 명령어

| 상황 | 명령어 | 설명 |
|------|--------|------|
| 간단한 수정 | `/refactor <파일>` | 단일 파일 리팩토링 |
| 복잡한 리팩토링 | Subagent | 여러 파일, 아키텍처 변경 |
| 테스트 생성 | `/test <파일>` | 리팩토링 후 테스트 |
| 커밋 | `/commit` | 변경사항 커밋 |

## 예시

### 예시 1: 단일 파일 리뷰
```bash
/review src/components/UserProfile/index.tsx
```

**출력 예시**:
```markdown
## 📊 코드 리뷰 결과: UserProfile

### ✅ 잘된 점
- 명확한 컴포넌트 네이밍 (Readability ✓)
- Props 타입이 잘 정의됨 (Predictability ✓)
- 도메인별로 폴더 구조가 잘 구성됨 (Cohesion ✓)

### 🔴 Critical (반드시 수정)

#### 1. Props Drilling 발견 (Coupling 위반)
**위치**: `UserProfile` → `UserCard` → `UserAvatar` (3단계 전달)
**참조**: `@.cursor/rules/code-quality/coupling.mdc` - "Eliminate Props Drilling with Component Composition"

**문제**:
```tsx
// ❌ 현재: Props Drilling
<UserProfile userId={userId}>
  <UserCard userId={userId}>  // 불필요한 전달
    <UserAvatar userId={userId} />  // 실제 사용
  </UserCard>
</UserProfile>
```

**해결**:
```tsx
// ✅ 개선: 컴포지션 패턴
<UserProfile userId={userId}>
  <UserCard>
    <UserAvatar />  // userId는 UserProfile에서 Context로 제공
  </UserCard>
</UserProfile>

// UserProfile.tsx
const UserContext = createContext<{ userId: string }>();

export function UserProfile({ userId, children }) {
  return (
    <UserContext.Provider value={{ userId }}>
      {children}
    </UserContext.Provider>
  );
}

// UserAvatar.tsx
function UserAvatar() {
  const { userId } = useContext(UserContext);
  // ...
}
```

### 🟡 Suggestion (개선 권장)

#### 1. 복잡한 조건문 (Readability 위반)
**위치**: `handleSubmit` 함수 (line 45-47)
**참조**: `@.cursor/rules/code-quality/readability.mdc` - "Simplify complex ternary operators"

**문제**:
```tsx
// ❌ 현재: 중첩된 삼항 연산자
const status = isActive 
  ? isVerified 
    ? 'ACTIVE_VERIFIED' 
    : 'ACTIVE_UNVERIFIED'
  : 'INACTIVE';
```

**해결**:
```tsx
// ✅ 개선: 명확한 조건문
const status = (() => {
  if (isActive && isVerified) return 'ACTIVE_VERIFIED';
  if (isActive) return 'ACTIVE_UNVERIFIED';
  return 'INACTIVE';
})();
```

### 🟢 Nice to have (선택적)

#### 1. 타입 개선
**위치**: `fetchUser` 함수 반환 타입
**참조**: `@.cursor/rules/code-quality/predictability.mdc` - "Standardize return types"

**제안**:
```tsx
// 현재: any
async function fetchUser(): Promise<any>

// 개선: 명확한 타입
interface User {
  id: string;
  name: string;
  email: string;
}
async function fetchUser(): Promise<User>
```

## 🔧 다음 단계
- 간단한 수정 (Critical 1개, Suggestion 1개): `/refactor src/components/UserProfile/index.tsx`
- 대규모 리팩토링 (Props Drilling 제거): "UserProfile을 규칙에 맞게 리팩토링해줘"
```

### 예시 2: 여러 파일 동시 리뷰
```bash
/review src/components/UserProfile/index.tsx src/hooks/useUser.ts
```

### 예시 3: 현재 수정한 모든 파일 리뷰
```bash
/review
```

**동작 과정**:
1. `git status` 실행
2. 수정/추가/스테이징된 모든 파일 확인
3. 각 파일을 순차적으로 리뷰
4. 통합 리뷰 결과 제공

**출력 예시**:
```markdown
## 📊 코드 리뷰 결과 (3개 파일)

### 파일 1: src/components/Button/index.tsx
✅ 잘된 점: 명확한 Props 타입 정의
🔴 Critical: 인라인 스타일 사용 (Emotion으로 분리 필요)

### 파일 2: src/hooks/useUser.ts
✅ 잘된 점: 단일 책임 원칙 준수
🟡 Suggestion: 에러 처리 개선 필요

### 파일 3: src/pages/Dashboard.tsx
🔴 Critical: Props Drilling 발견 (3단계)
🔴 Critical: 복잡한 컴포넌트 (250줄, 분리 필요)

## 🎯 전체 요약
- 총 파일: 3개
- Critical 이슈: 3개
- Suggestion: 1개
- 우선 수정 대상: Dashboard.tsx

## 🔧 다음 단계
"Dashboard.tsx를 @.cursor/rules/code-quality 기준에 맞게 리팩토링해줘"
```

## 주의사항

- **Rules 참조**: 이 명령어는 항상 `@.cursor/rules/code-quality` 규칙을 참조합니다
- **중복 없음**: Rules 내용을 반복하지 않고 참조만 합니다
- **토큰 효율**: 필요한 규칙만 선택적으로 읽습니다
- **Subagent 연계**: 복잡한 리팩토링은 자동으로 Subagent를 추천합니다
