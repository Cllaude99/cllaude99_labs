---
trigger: always_on
---

# Frontend Design Guidelines - Comprehensive Summary

This document outlines essential frontend design principles focused on three core pillars: Readability, Predictability, and Cohesion.

## 1. READABILITY: Improving Code Clarity

### 1.1 Naming Magic Numbers

**Rule:** Replace magic numbers with named constants.

**Why:** Provides semantic meaning and enhances maintainability.

**Pattern:**

```tsx
const ANIMATION_DELAY_MS = 300;
const MAX_RETRY_ATTEMPTS = 3;

async function onLikeClick() {
  await postLike(url);
  await delay(ANIMATION_DELAY_MS);
  await refetchPostLike();
}
```

### 1.2 Abstracting Implementation Details

**Rule:** Encapsulate complex logic into dedicated components.

**Why:** Reduces cognitive load, improves testability and maintainability.

**Pattern:**

```tsx
function App() {
  return (
    <AuthGuard>
      <LoginStartPage />
    </AuthGuard>
  );
}

function AuthGuard({ children }) {
  const status = useCheckLoginStatus();
  useEffect(() => {
    if (status === 'LOGGED_IN') location.href = '/home';
  }, [status]);
  return status !== 'LOGGED_IN' ? children : null;
}
```

### 1.3 Separating Code Paths for Conditional Rendering

**Rule:** Split significantly different conditional UI into distinct components.

**Why:** Avoids complex conditionals. Each component maintains single responsibility.

**Pattern:**

```tsx
function SubmitButton() {
  const isViewer = useRole() === 'viewer';
  return isViewer ? <ViewerSubmitButton /> : <AdminSubmitButton />;
}

function ViewerSubmitButton() {
  return <TextButton disabled>Submit</TextButton>;
}

function AdminSubmitButton() {
  useEffect(() => {
    showAnimation();
  }, []);
  return <Button type="submit">Submit</Button>;
}
```

### 1.4 Simplifying Complex Ternary Operators

**Rule:** Replace nested ternaries with if/else or IIFEs.

**Why:** Makes conditional logic easier to follow.

**Pattern:**

```tsx
const status = (() => {
  if (ACondition && BCondition) return 'BOTH';
  if (ACondition) return 'A';
  if (BCondition) return 'B';
  return 'NONE';
})();
```

### 1.5 Reducing Eye Movement

**Rule:** Keep simple logic close to where it's used.

**Why:** Enables top-to-bottom reading without context switching.

**Pattern:**

```tsx
function Page() {
  const user = useUser();
  const policy = {
    admin: { canInvite: true, canView: true },
    viewer: { canInvite: false, canView: true },
  }[user.role];

  if (!policy) return null;

  return (
    <div>
      <Button disabled={!policy.canInvite}>Invite</Button>
      <Button disabled={!policy.canView}>View</Button>
    </div>
  );
}
```

### 1.6 Naming Complex Conditions

**Rule:** Assign meaningful names to complex boolean expressions.

**Why:** Makes condition intent explicit, serving as inline documentation.

**Pattern:**

```tsx
const matchedProducts = products.filter((product) => {
  const isSameCategory = product.categories.some(
    (category) => category.id === targetCategory.id,
  );
  const isPriceInRange = product.prices.some(
    (price) => price >= minPrice && price <= maxPrice,
  );
  return isSameCategory && isPriceInRange;
});
```

**Guidance:** Apply for complex, reused, or testable conditions. Skip trivial checks like `value > 0`.

## 2. PREDICTABILITY: Ensuring Expected Behavior

### 2.1 Standardizing Return Types

**Rule:** Use consistent return types across similar functions.

**Why:** Developers can anticipate return shapes, reducing errors.

**Pattern - API Hooks:**

```tsx
import { useQuery, UseQueryResult } from '@tanstack/react-query';

function useUser(): UseQueryResult<UserType, Error> {
  return useQuery({ queryKey: ['user'], queryFn: fetchUser });
}

function useServerTime(): UseQueryResult<Date, Error> {
  return useQuery({ queryKey: ['serverTime'], queryFn: fetchServerTime });
}
```

**Pattern - Validation Functions:**

```tsx
type ValidationResult = { ok: true } | { ok: false; reason: string };

function checkIsNameValid(name: string): ValidationResult {
  if (name.length === 0) return { ok: false, reason: 'Name cannot be empty.' };
  if (name.length >= 20) return { ok: false, reason: 'Name too long.' };
  return { ok: true };
}

function checkIsAgeValid(age: number): ValidationResult {
  if (!Number.isInteger(age))
    return { ok: false, reason: 'Age must be integer.' };
  if (age < 18) return { ok: false, reason: 'Must be 18 or older.' };
  if (age > 99) return { ok: false, reason: 'Must be 99 or younger.' };
  return { ok: true };
}

const nameValidation = checkIsNameValid(name);
if (!nameValidation.ok) {
  console.error(nameValidation.reason);
}
```

### 2.2 Revealing Hidden Logic

**Rule:** Functions should only perform actions implied by their signature.

**Why:** Prevents unexpected behavior. Makes code predictable and testable.

**Pattern:**

```tsx
async function fetchBalance(): Promise<number> {
  const balance = await http.get<number>('...');
  return balance;
}

async function handleUpdateClick() {
  const balance = await fetchBalance();
  logging.log('balance_fetched');
  await syncBalance(balance);
}
```

### 2.3 Using Unique and Descriptive Names

**Rule:** Use unique names for custom wrappers to avoid ambiguity.

**Why:** Clear differentiation from library functions. Behavior is obvious from name.

**Pattern:**

```tsx
import { http as httpLibrary } from '@some-library/http';

export const httpService = {
  async getWithAuth(url: string) {
    const token = await fetchToken();
    return httpLibrary.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

import { httpService } from './httpService';
export async function fetchUser() {
  return await httpService.getWithAuth('...');
}
```

## 3. COHESION: Keeping Related Code Together

### 3.1 Considering Form Cohesion

**Rule:** Choose field-level or form-level cohesion based on complexity.

**Why:** Field-level works for independent fields. Form-level handles cross-field validation.

**Pattern - Field-Level:**

```tsx
export function Form() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input
        {...register('name', {
          validate: (v) => (v.trim() === '' ? 'Enter name' : true),
        })}
      />
      {errors.name && <p>{errors.name.message}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}
```

**Pattern - Form-Level:**

```tsx
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z
  .object({
    name: z.string().min(1, 'Enter name'),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, '8+ characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export function Form() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });
  return <form onSubmit={handleSubmit((data) => console.log(data))}>...</form>;
}
```

## 4. PRACTICAL GUIDELINES

### 4.1 When to Extract vs. Keep Inline

**Extract if:** Logic exceeds 5-7 lines, used multiple times, requires testing.
**Keep inline if:** Logic is 1-3 lines, used once, immediately clear.

```tsx
function calculateFinalPrice(product: Product, userTier: UserTier): number {
  const baseDiscount = product.discount;
  const tierDiscount = TIER_DISCOUNTS[userTier];
  const seasonalMultiplier = getSeasonalMultiplier();
  return (
    product.price * (1 - baseDiscount) * (1 - tierDiscount) * seasonalMultiplier
  );
}
```

### 4.2 Component Granularity

**Over-extraction signs:** 1-2 line components, excessive prop drilling, used only once.
**Under-extraction signs:** 200+ line components, multiple responsibilities, hard to test.

### 4.3 Error Handling Consistency

```tsx
type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string };

async function fetchUser(id: string): Promise<ApiResult<User>> {
  try {
    const data = await http.get<User>(`/users/${id}`);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      code: error.code || 'UNKNOWN',
    };
  }
}
```

### 4.4 State Management Clarity

```tsx
type FormState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success'; data: Response }
  | { status: 'error'; error: string };

function FormComponent() {
  const [state, setState] = useState<FormState>({ status: 'idle' });

  if (state.status === 'submitting') return <Spinner />;
  if (state.status === 'success') return <SuccessMessage data={state.data} />;
  if (state.status === 'error') return <ErrorMessage error={state.error} />;

  return <Form onSubmit={handleSubmit} />;
}
```

### 4.5 Naming Conventions

**Boolean Variables:** Use `is`, `has`, `should`, `can` prefixes.

```tsx
const isLoading = status === 'loading';
const hasError = error !== null;
const canSubmit = isValid && !isSubmitting;
```

**Event Handlers:** Use `handle` prefix for handlers, `on` for props.

```tsx
function UserForm({ onSubmit }) {
  const handleSubmit = (data) => {
    validate(data);
    onSubmit(data);
  };
  return <form onSubmit={handleSubmit}>...</form>;
}
```

**Custom Hooks:** Start with `use` and describe what they provide.

```tsx
function useUserPermissions() {
  /* ... */
}
function useFormValidation() {
  /* ... */
}
```

### 4.6 Avoiding Premature Optimization

**Guideline:** Write clear code first, optimize only when performance issues are measured.

**Common Mistakes:**

- Memoizing everything with `useMemo`/`useCallback` without profiling
- Splitting components excessively for "performance"
- Using complex state management before `useState` is proven insufficient

**Better Approach:**

```tsx
// Start simple
function ProductList({ products }) {
  const filteredProducts = products.filter((p) => p.inStock);
  return (
    <div>
      {filteredProducts.map((p) => (
        <ProductCard key={p.id} {...p} />
      ))}
    </div>
  );
}

// Optimize only if profiling shows filter is slow
function ProductList({ products }) {
  const filteredProducts = useMemo(
    () => products.filter((p) => p.inStock),
    [products],
  );
  return (
    <div>
      {filteredProducts.map((p) => (
        <ProductCard key={p.id} {...p} />
      ))}
    </div>
  );
}
```

### 4.7 Testing-Friendly Code

**Write testable code by:**

- Extracting complex logic into pure functions
- Avoiding tight coupling to external dependencies
- Using dependency injection for services

```tsx
// Testable - pure function
export function calculateDiscount(price: number, tier: UserTier): number {
  return price * TIER_DISCOUNTS[tier];
}

// Testable - dependency injection
export function UserProfile({ api }: { api: ApiService }) {
  const { data } = useQuery({
    queryFn: () => api.fetchUser(),
  });
  return <div>{data?.name}</div>;
}
```

## Key Takeaways

**Readability:** Name magic numbers, abstract complex logic, separate conditional paths, simplify ternaries, colocate simple logic, name complex conditions.

**Predictability:** Standardize return types, reveal all logic explicitly, use unique descriptive names to avoid ambiguity with library functions.

**Cohesion:** Choose appropriate cohesion levels for forms based on validation complexity and field interdependencies.

**Practical Balance:** Know when to extract vs. keep inline, maintain optimal component granularity, handle errors consistently, make state transitions explicit, follow naming conventions, avoid premature optimization, leverage type safety, and write testing-friendly code.

These principles create frontend code that is easy to understand, behaves as expected, and maintains clear boundaries between concerns. Apply them consistently to improve code quality and developer experience across your entire codebase.
