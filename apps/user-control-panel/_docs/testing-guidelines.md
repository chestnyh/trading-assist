# Frontend Testing Guidelines

## Table of Contents

1. [Purpose](#purpose)
2. [Testing Stack](#testing-stack)
3. [What We Test](#what-we-test)
4. [Test Types](#test-types)
5. [Test File Structure](#test-file-structure)
6. [Test Structure (AAA Pattern)](#test-structure-aaa-pattern)
7. [Mocking](#mocking)
8. [User Events](#user-events)
9. [Accessibility-Based Queries](#accessibility-based-queries)
10. [Test Coverage](#test-coverage)
11. [Best Practices](#best-practices)
12. [Common Patterns](#common-patterns)

---

## Purpose

This document defines testing rules, patterns, and best practices for frontend development in the User Control Panel project.

### Goals

- **Ensure predictable and stable UI behavior** — Tests catch bugs before they reach production
- **Prevent regressions during refactoring** — Confidence to refactor safely
- **Make tests readable and easy to maintain** — Tests serve as documentation
- **Provide a unified approach** — All developers write tests consistently

### Scope

This document covers:

- Unit tests
- Component tests
- Mocking strategies (functions, modules, API requests)
- Test structure and naming conventions
- Best practices and common patterns

---

## Testing Stack

### Core Tools

| Tool                            | Purpose                                                                 |
| ------------------------------- | ----------------------------------------------------------------------- |
| **Jest**                        | Test runner and assertion framework                                     |
| **@testing-library/react**      | Component testing via user behavior                                     |
| **@testing-library/user-event** | Realistic user interactions                                             |
| **@testing-library/jest-dom**   | Extended DOM assertions (e.g., `toBeInTheDocument()`, `toBeDisabled()`) |

### Why These Tools?

- **Jest**: Jest is used because the project is based on Nx, which provides first-class Jest integration and tooling.
- **React Testing Library**: Tests components from user's perspective, not implementation details
- **user-event**: More realistic than `fireEvent`, simulates actual browser behavior

---

## What We Test

### ✅ We DO Test

- **Component rendering** — Elements appear on screen
- **User interactions** — Typing, clicking, submitting forms
- **Conditional UI** — Errors, loading states, success messages
- **Navigation and redirects** — Route changes after actions
- **API success and error scenarios** — Using mocked API calls
- **Form validation** — Client-side validation rules
- **Accessibility** — Elements are findable by role, label, etc.

### ❌ We DO NOT Test

- **Internal React state** — Don't test `useState` values directly
- **Private helper functions** — Test public behavior, not internals
- **Styling details** — Colors, spacing, CSS classes (unless critical for UX)
- **Third-party library internals** — Trust that libraries work
- **Implementation details** — How something works, not what it does

### Example: Good vs Bad

```typescript
// ✅ GOOD: Testing user-visible behavior
it('shows error when email is invalid', async () => {
  render(<SignIn />);
  await user.type(screen.getByLabelText(/email/i), 'invalid');
  await user.click(screen.getByRole('button', { name: /sign in/i }));

  expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
});

// ❌ BAD: Testing implementation details
it('sets emailError state', () => {
  const { result } = renderHook(() => useSignIn());
  act(() => {
    result.current.setEmail('invalid');
  });
  expect(result.current.emailError).toBeTruthy();
});
```

---

## Test Types

### 4.1 Unit Tests

**Used for:**

- Pure functions
- Validation logic
- Utility functions
- Business logic

**Example:**

```typescript
import { validateEmail } from './utils';

describe('validateEmail', () => {
  it('returns true for valid email', () => {
    expect(validateEmail('test@mail.com')).toBe(true);
  });

  it('returns false for invalid email', () => {
    expect(validateEmail('invalid')).toBe(false);
  });
});
```

### 4.2 Component Tests (Most Common)

**Used for:**

- Forms
- Pages
- UI components
- User flows

**Key Principle:** Test components as the user uses them, not how they're implemented.

**Example:**

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignIn } from './SignIn';

describe('SignIn', () => {
  it('renders email and password fields', () => {
    render(<SignIn />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });
});
```

---

## Test File Structure

### File Naming

Use one of these conventions consistently:

- `ComponentName.spec.tsx` (preferred)
- `ComponentName.test.tsx`

### Folder Placement

**✅ Recommended:** Place tests next to the component

```
src/
  features/
    signIn/
      ├─ SignIn.tsx
      ├─ SignIn.spec.tsx
      └─ components/
          ├─ AuthButton.tsx
          └─ AuthButton.spec.tsx
```

**Alternative:** Use `__tests__` folder for larger components

```
src/
  features/
    signIn/
      ├─ SignIn.tsx
      └─ __tests__/
          └─ SignIn.spec.tsx
```

---

## Test Structure (AAA Pattern)

We follow the **Arrange → Act → Assert** pattern for clarity.

### Structure

```typescript
it('describes what the test does', async () => {
  // Arrange: Set up test data, mocks, render components
  const mockLogin = jest.fn().mockResolvedValue({ success: true });
  render(<SignIn />);
  const emailInput = screen.getByLabelText(/email/i);
  const submitButton = screen.getByRole('button', { name: /sign in/i });

  // Act: Perform user actions
  await user.type(emailInput, 'test@mail.com');
  await user.click(submitButton);

  // Assert: Verify expected outcomes
  expect(mockLogin).toHaveBeenCalledWith(
    'test@mail.com',
    expect.any(String),
    false
  );
});
```

### Benefits

- **Clear separation** of setup, action, and verification
- **Easy to read** — understand test flow at a glance
- **Consistent structure** across all tests

---

## Mocking

### What Is a Mock?

A mock replaces a real dependency (API, hook, service) with a fake one so:

- ✅ Tests are **fast** (no network calls)
- ✅ Tests are **predictable** (controlled responses)
- ✅ Tests are **isolated** (don't depend on external services)

### 7.1 Mocking Functions

**Use case:** Mock callbacks, event handlers

```typescript
const onSubmit = jest.fn();

render(<Form onSubmit={onSubmit} />);

await user.click(screen.getByRole('button', { name: /submit/i }));

expect(onSubmit).toHaveBeenCalledWith(expectedData);
```

### 7.2 Mocking Modules

**Use case:** Mock API clients, external libraries

```typescript
// At the top of the test file
jest.mock('../../api/auth', () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// In the test
import { signIn } from '../../api/auth';

(signIn as jest.Mock).mockResolvedValue({ token: '123' });
```

### 7.3 Mocking React Context/Hooks

**Use case:** Mock custom hooks or context providers

```typescript
jest.mock('../../app/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

beforeEach(() => {
  mockUseAuth.mockReturnValue({
    login: jest.fn(),
    isAuthenticated: false,
    user: null,
  });
});
```

### 7.4 Mocking API Requests (Recommended Pattern)

**✅ Preferred:** Mock the API layer, not `fetch` or `axios`

```typescript
jest.mock('@trading-bot/api-client', () => ({
  authControllerLogin: jest.fn(),
}));

import { authControllerLogin } from '@trading-bot/api-client';

it('handles successful login', async () => {
  (authControllerLogin as jest.Mock).mockResolvedValue({
    status: 200,
    data: { access_token: 'token', user: { id: 1, email: 'test@mail.com' } },
  });

  // ... test implementation
});
```

**Alternative for Integration Tests:** For integration-heavy components, MSW (Mock Service Worker) may be preferred to mock real HTTP behavior instead of module mocks. This approach intercepts actual network requests at the HTTP level, providing more realistic testing scenarios.

### 7.5 Mocking window.matchMedia

**Use case:** Components that use `window.matchMedia` (e.g., theme toggles)

```typescript
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

### 7.6 Mocking Navigation

**Use case:** Test route changes

```typescript
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

it('navigates to dashboard after login', async () => {
  // ... perform login
  expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
});
```

---

## User Events

### ⚠️ Important Rule

**❌ Don't use `fireEvent`**  
**✅ Always use `userEvent`**

### Why?

- `userEvent` simulates **real browser behavior**
- `fireEvent` only dispatches DOM events (less realistic)
- `userEvent` handles focus, blur, and other interactions automatically

### Usage

```typescript
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

// Typing
await user.type(screen.getByLabelText(/email/i), 'test@mail.com');

// Clicking
await user.click(screen.getByRole('button', { name: /submit/i }));

// Clearing input
await user.clear(screen.getByLabelText(/email/i));

// Selecting checkbox
await user.click(screen.getByLabelText(/remember me/i));
```

### Common Patterns

```typescript
// Fill and submit form
await user.type(emailInput, 'test@mail.com');
await user.type(passwordInput, 'password123');
await user.click(submitButton);

// Wait for async operations
await waitFor(() => {
  expect(mockLogin).toHaveBeenCalled();
});
```

---

## Accessibility-Based Queries

### Priority Order

Always prefer queries in this order (most accessible to least):

1. **`getByRole`** — Preferred for buttons, links, form elements
2. **`getByLabelText`** — For form inputs with labels
3. **`getByText`** — For visible text content
4. **`getByPlaceholderText`** — When label is not available
5. **`getByTestId`** — only when semantic queries are not possible (e.g. SVG icons, charts, custom components).

### Examples

```typescript
// ✅ GOOD: Using role
screen.getByRole('button', { name: /sign in/i });
screen.getByRole('textbox', { name: /email/i });

// ✅ GOOD: Using label
screen.getByLabelText(/email/i);
screen.getByLabelText(/password/i);

// ✅ GOOD: Using text
screen.getByText(/invalid email/i);

// ⚠️ ACCEPTABLE: Using placeholder (when label unavailable)
screen.getByPlaceholderText(/enter your password/i);

// ❌ AVOID: Using test ID (unless necessary)
screen.getByTestId('submit-button');
```

### Why This Order?

- **Accessibility first** — If users can't find it, tests shouldn't either
- **More resilient** — Tests break less when implementation changes
- **Better documentation** — Tests show how components should be used

---

## Test Coverage

### Command

```bash
pnpm user-control-panel:test-coverage
```

(equivalent to `nx run user-control-panel:test --coverage`)

### Coverage Rules

- **Global minimum:** 90% across statements, branches, functions, and lines
- **Critical components** (auth, forms): 90%+
- **Regular components:** 90%+
- **Utility functions:** 90%+
- Thresholds are enforced in `apps/user-control-panel/jest.config.ts`.

### What to Focus On

- ✅ **Logic branches** — If/else, switch statements
- ✅ **User flows** — Happy paths and error paths
- ✅ **Error states** — Validation, API errors, edge cases
- ✅ **Conditional rendering** — Loading, success, error states

### Important Note

> **Coverage is a signal, not a goal.**  
> High coverage with bad tests is worse than lower coverage with good tests.

Focus on **meaningful tests** that catch real bugs, not just hitting coverage numbers.

### Coverage Thresholds

Coverage thresholds should not force meaningless tests. In exceptional cases, coverage may be temporarily lowered with a documented reason. Always prioritize test quality and meaningful coverage over arbitrary percentage targets.

---

## Best Practices

### 1. Test User Behavior, Not Implementation

```typescript
// ✅ GOOD
expect(screen.getByText(/welcome/i)).toBeInTheDocument();

// ❌ BAD
expect(component.state.isWelcomeShown).toBe(true);
```

### 2. Use Descriptive Test Names

```typescript
// ✅ GOOD
it('shows error message when email is invalid', () => {});
it('redirects to dashboard after successful login', () => {});

// ❌ BAD
it('test email', () => {});
it('works', () => {});
```

### 3. Keep Tests Isolated

- Each test should be independent
- Use `beforeEach` and `afterEach` for setup/cleanup
- Don't rely on test execution order

```typescript
describe('SignIn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
```

### 4. Use `waitFor` for Async Operations

```typescript
// ✅ GOOD
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});

// ❌ BAD
expect(screen.getByText(/success/i)).toBeInTheDocument(); // May fail if async
```

### 5. Group Related Tests

```typescript
describe('SignIn', () => {
  describe('Rendering', () => {
    it('renders email field', () => {});
    it('renders password field', () => {});
  });

  describe('Validation', () => {
    it('shows error for invalid email', () => {});
    it('shows error for empty password', () => {});
  });

  describe('Submission', () => {
    it('calls login with correct data', () => {});
    it('handles login error', () => {});
  });
});
```

### 6. Clean Up After Tests

```typescript
beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});
```

---

## Common Patterns

### Pattern 1: Testing Forms

```typescript
it('submits form with valid data', async () => {
  const mockSubmit = jest.fn();
  render(<SignIn onSubmit={mockSubmit} />);

  await user.type(screen.getByLabelText(/email/i), 'test@mail.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /sign in/i }));

  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@mail.com',
      password: 'password123',
    });
  });
});
```

### Pattern 2: Testing Error States

```typescript
it('displays server error message', async () => {
  const mockLogin = jest.fn().mockResolvedValue({
    success: false,
    error: 'Invalid credentials',
  });

  render(<SignIn />);
  // ... fill form and submit

  await waitFor(() => {
    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
```

### Pattern 3: Testing Loading States

```typescript
it('shows loading state during submission', async () => {
  const mockLogin = jest
    .fn()
    .mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true }), 100)
        )
    );

  render(<SignIn />);
  // ... fill form and submit

  expect(screen.getByText(/signing in/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
});
```

### Pattern 4: Testing Navigation

```typescript
it('navigates to dashboard after successful login', async () => {
  const mockNavigate = jest.fn();
  jest
   .mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),}));
    .mockReturnValue(mockNavigate);

  render(<SignIn />);
  // ... perform login

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
```

### Pattern 5: Testing Conditional Rendering

```typescript
it('shows different content based on state', () => {
  const { rerender } = render(<Component isLoading={true} />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  rerender(<Component isLoading={false} />);
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  expect(screen.getByText(/content/i)).toBeInTheDocument();
});
```

---

## Additional Resources

- [React Testing Library Documentation](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Accessible Queries Guide](https://testing-library.com/docs/queries/about#priority)

---
