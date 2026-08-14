# Quickstart: User-Control-Panel Test Coverage

**Date**: 2026-08-14
**Feature**: [spec.md](./spec.md)

## Purpose

This guide documents how to validate the feature: run the full test suite, measure coverage, and verify the ~100% (≥90% all metrics) target plus a green, deterministic suite. It is a validation/run guide — implementation details live in `tasks.md` and the implementation phase.

## Prerequisites

- Monorepo with pnpm workspaces, dependencies installed (`pnpm install` done).
- Working directory: repo root (`/home/loobi/project/trading-assist`).
- Jest config: `apps/user-control-panel/jest.config.ts` (jsdom, setup `src/test/setupTests.ts`).
- Coverage dir: `coverage/apps/user-control-panel`.

## Commands

### Run the full test suite

```bash
pnpm nx run user-control-panel:test
```

### Run the suite with coverage

```bash
pnpm nx run user-control-panel:test --coverage
```

> **Note**: The root script `pnpm user-control-panel:test-coverage` is currently a broken self-referential loop (it calls itself). As part of this feature it should be fixed to run `nx run user-control-panel:test --coverage`. Use the direct `nx` command until then.

### Run a single spec file (fast iteration)

```bash
pnpm nx run user-control-panel:test --testFile=src/features/dashboard/Dashboard.spec.tsx
```

### Run lint (quality gate)

```bash
pnpm nx run user-control-panel:lint
```

## Validation Scenarios

Each scenario maps to a feature-spec user story / acceptance criterion. Mark a scenario passed only when its tests exist, pass deterministically, and cover the stated behavior.

### VS-1: Suite is green and deterministic (SC-011)

- **Run**: `pnpm nx run user-control-panel:test`
- **Expected**: Exit code 0; all suites pass; no `Exceeded timeout of 5000 ms` failures (the 7 currently-timing-out tests in `int-tests/auth.integration.spec.tsx`, `int-tests/forgot-password.integration.spec.tsx`, `int-tests/registration.integration.spec.tsx`, `src/features/signInUp/SignUp.spec.tsx` must pass).
- **Determinism**: Run twice consecutively — both runs green.

### VS-2: Coverage reaches ~100% (SC-010)

- **Run**: `pnpm nx run user-control-panel:test --coverage`
- **Expected**: Coverage summary shows all four metrics **≥ 90%**:
  - Statements ≥ 90% (baseline 86.91%)
  - Branches ≥ 90% (baseline 76.71% — the biggest lift)
  - Functions ≥ 90% (baseline 87.93%)
  - Lines ≥ 90% (baseline 88.82%)
- **Detail**: Per-file report (`coverage/apps/user-control-panel/lcov-report/index.html`) shows no application source file below the target except documented exceptions (type-only files, test-only mocks excluded via `collectCoverageFrom`).

### VS-3: mainPage + Dashboard + authorization (SC-001, SC-002, US-1)

- **Run**: `Main.spec.tsx`, `Main.routes.spec.tsx`, `Dashboard.spec.tsx` (new)
- **Expected**: Landing page sections render; `/dashboard` redirects anonymous users to `/sign-in`; authenticated users see the Dashboard; app chrome (Header, Sidebar, Footer) renders.

### VS-4: Not Found (SC-003, US-7)

- **Run**: `NotFound.spec.tsx`
- **Expected**: 404 page renders; "Go to Dashboard" navigates; unknown path → NotFound for authenticated users, redirect to `/sign-in` for anonymous.

### VS-5: Sign Up (SC-004, US-2)

- **Run**: `SignUp.spec.tsx`, `SignUpContext.spec.tsx`
- **Expected**: 4-step wizard validates each step; registration success/failure paths; email verification; localStorage persistence/migration.

### VS-6: Sign In + session (SC-005, US-3)

- **Run**: `SignIn.spec.tsx`, `AuthContext.spec.tsx`
- **Expected**: Client validation; login success → `/dashboard`; remember-me persistence; error paths; logout clears session; session restore on reload.

### VS-7: Restore Password (SC-006, US-4)

- **Run**: `RestorePassword.spec.tsx`, `steps/steps.spec.tsx`
- **Expected**: 3-step flow with validation and error handling; max-attempts → "Request New Code"; success → `/sign-in`.

### VS-8: Rules (SC-007, US-5)

- **Run**: `RulesPage.spec.tsx`, `RulePages.spec.tsx`, `pagination.spec.tsx`, `RuleForm.spec.tsx`, `LogsPanel.spec.tsx`, `useRuleLogs.spec.ts`, `ActionEditor.spec.tsx`, `actionTree.spec.ts`
- **Expected**: List states (loading/error/empty/populated/paginated); CRUD; details (action tree, JSON view, logs); SSE reconnect; action-tree round-trip.

### VS-9: Settings (SC-008, US-6)

- **Run**: `Settings.spec.tsx`, `SimpleServiceSettingsGroup.spec.tsx`, `TelegramSettingsGroup.spec.tsx`, `TelegramRuleSetting.spec.tsx`, `RuleSettingForm.spec.tsx`, `useServiceRuleSettings.spec.tsx`
- **Expected**: All 10 service groups render; generic group CRUD + pagination; Telegram onboarding flow; form validation; TagPicker.

### VS-10: Shared UI + remaining functionality (SC-009, US-8, US-9)

- **Run**: `sidebar.spec.tsx`, `userMenu.spec.tsx`, `modal.spec.tsx`, `forms.spec.tsx`, `JsonEditorField.spec.tsx` + new specs for `RedirectToSignIn`, `TypewriterText`, `AuthLayout`, `Sidebar` gap, `FormProgressBar` branch, and deepened specs for `ActionEditor`, `TelegramSettingsGroup`, `SimpleServiceSettingsGroup`, `RuleForm`, `signUpReducer`, `actionTree`, `JsonEditorField`, `Button`.
- **Expected**: Shared components render and behave; remaining important functionality identified in [research.md](./research.md) is covered.

## Expected Outcomes (summary)

| Check | Command | Pass condition |
|-------|---------|----------------|
| Green suite | `pnpm nx run user-control-panel:test` | exit 0, no timeouts, deterministic |
| Coverage | `pnpm nx run user-control-panel:test --coverage` | all 4 metrics ≥ 90% |
| Lint | `pnpm nx run user-control-panel:lint` | no new lint errors |
| Docs | — | `user-control-panel:test-coverage` script fixed and documented command works |

## References

- Behavioral contracts tests must verify: [contracts/contracts.md](./contracts/contracts.md)
- Entities and validation rules: [data-model.md](./data-model.md)
- Coverage gaps and decisions: [research.md](./research.md)
- Test conventions: `apps/user-control-panel/_docs/testing-guidelines.md`
