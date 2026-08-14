# Research: User-Control-Panel Test Coverage

**Date**: 2026-08-14
**Feature**: [spec.md](./spec.md)
**Status**: Complete

## Summary

This feature adds and verifies automated test coverage for the `user-control-panel` Nx application. Research confirmed the current test infrastructure, documented conventions, actual coverage numbers, and the concrete gaps to close. No production source code is changed — only test files and test configuration.

## Resolved Unknowns

### U1: What is the current test infrastructure?

**Decision**: Jest (jsdom) with React Testing Library, configured in `apps/user-control-panel/jest.config.ts`.

**Rationale**: Already the project's established setup; documented in `_docs/testing-guidelines.md`.

**Details**:
- `testEnvironment: 'jsdom'`; `setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts']`.
- `moduleNameMapper`: svg/png/jpg/jpeg/gif/webp/css/scss → `src/test/asset-stub.ts`.
- Coverage: `coverageDirectory: ../../coverage/apps/user-control-panel`, reporters `['text','text-summary','html','lcov']`, global `coverageThreshold` 70% on all four metrics.
- `collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/**/*.stories.{ts,tsx}', '!src/**/*.spec.{ts,tsx}', '!src/**/index.ts', '!src/main.tsx', '!src/app/index.tsx']`.

**Alternatives considered**: MSW for API mocking — rejected; guidelines prefer mocking the API layer (`jest.mock('@trading-bot/api-client')`), not fetch/axios.

### U2: What are the documented testing conventions?

**Decision**: Follow `apps/user-control-panel/_docs/testing-guidelines.md`.

**Rationale**: Team conventions; PRs must demonstrate compliance.

**Key conventions**:
- File naming: `ComponentName.spec.tsx` / `.spec.ts` colocated with source.
- AAA pattern (Arrange → Act → Assert).
- `userEvent` over `fireEvent` (`const user = userEvent.setup()`).
- Query priority (accessibility-first): `getByRole` → `getByLabelText` → `getByText` → `getByPlaceholderText` → `getByTestId` (last resort).
- Mock the API layer, not fetch: `jest.mock('@trading-bot/api-client', () => ({ authControllerLogin: jest.fn() }))`.
- Coverage targets: global 70%, critical components (auth, forms) 80%+, utilities 60%+; "coverage is a signal, not a goal."
- Isolation: `jest.clearAllMocks()` / `localStorage.clear()` per test.

### U3: What is the actual current coverage?

**Decision**: Coverage was measured by an actual run (`pnpm nx run user-control-panel:test --coverage`).

**Rationale**: The user explicitly said not to assume existing tests are correct or complete; an empirical baseline is required.

**Measured baseline (2026-08-14)**:

| Metric | Coverage | Covered / Total |
|--------|----------|-----------------|
| Statements | 86.91% | 1920 / 2209 |
| Branches | 76.71% | 1331 / 1735 |
| Functions | 87.93% | 459 / 522 |
| Lines | 88.82% | 1836 / 2067 |

All metrics pass the configured 70% threshold. Gap to the ≥90% target: branches +13.3pp (largest lift), statements +3.1pp, functions +2.1pp, lines +1.2pp.

### U4: Does the full test suite currently pass?

**Decision**: **No — the suite is not green.** 7 tests in 4 suites exceed Jest's 5s per-test timeout.

**Rationale**: Empirically observed in the coverage run (exit code 1, not caused by thresholds).

**Failing suites/tests** (all `Exceeded timeout of 5000 ms`):
- `int-tests/auth.integration.spec.tsx` (1 test, line 51)
- `int-tests/forgot-password.integration.spec.tsx` (1 test, line 75)
- `int-tests/registration.integration.spec.tsx` (2 tests, lines 114, 134)
- `src/features/signInUp/SignUp.spec.tsx` (3 tests, lines 117, 141, 165)

These are slow render/timing under load (killed mid-`user.type(...)`), not assertion failures.

**Implication for the plan**: Raising the Jest timeout (e.g., `testTimeout` in jest.config.ts or per-suite) and/or making these tests faster is REQUIRED for a green CI — a hard precondition for "all tests pass deterministically in CI" (SC-011) and for coverage to be meaningful.

### U5: Which files are the concrete coverage gaps?

**Decision**: Prioritized gap list from the lcov report + source cross-reference.

**0% coverage (highest yield)**:
- `src/app/components/RedirectToSignIn.tsx` — 0% (7 lines) — trivial: renders `<Navigate to="/sign-in" />`.
- `src/mocks/api-client.ts`, `src/mocks/api-validator.ts` — 0% — **test-only mock shims; should be excluded from coverage, not tested** (add `!src/mocks/**` to `collectCoverageFrom`).

**Below 70% (major contributors)**:
- `src/shared/ui/TypewriterText.tsx` — 50% st / 33% fn (lines 20–26) — no spec.
- `src/features/rules/components/action-editor/ActionEditor.tsx` — 64.76% st / 68.33% br / 68.88% fn — spec exists but misses branch paths (lines 53-61, 131, 163-170, 197-211, 232, 257-280, 299, 360, 372-389).
- `src/features/settings/components/service-groups/TelegramSettingsGroup.tsx` — 70.83% st / **42.85% fn** — spec exists but misses most handlers (lines 46, 78-80, 93-109).
- `src/app/components/RuleForm.tsx` — 71.92% st / 67.2% br — spec exists but misses paths (lines 99-106, 117-119, 122-123, 145-146, 184-185, 201-211, 286).

**60–70% branch contributors** (branch metric is the biggest gap):
- `src/features/settings/components/service-groups/SimpleServiceSettingsGroup.tsx` — 12 fn, 8 hit (lines 85/86/88/89/116).
- `src/features/rules/components/action-editor/actionTree.ts` — 74.72% br.
- `src/app/contexts/signUp/signUpReducer.ts` — 55.26% br.
- `src/features/layout/AuthLayout.tsx` — 5/6 branches (line 51).
- `src/shared/components/sideBar/Sidebar.tsx` — 1 fn uncovered (line 85).
- `src/features/signInUp/components/FormProgressBar.tsx` — 0% branch (line 8).
- `src/shared/ui/forms/JsonEditorField.tsx` — 61.53% br.
- `src/shared/ui/buttons/Button.tsx` — 27/28 branches (line 41).

**Zero-statement (type-only/barrels)** — candidates to exclude from coverage: `app/contexts/SignUpContext.tsx`, `app/contexts/signUp/signUpTypes.ts`, `features/rules/components/action-editor/types.ts`, `test/asset-stub.ts`.

### U6: What is the working coverage command?

**Decision**: `pnpm nx run user-control-panel:test --coverage` (or `npx nx run user-control-panel:test --coverage`).

**Rationale**: The root script `user-control-panel:test-coverage` in `package.json` (line 32) is a **broken self-referential loop** (`"pnpm user-control-panel:test-coverage"` calls itself) and the docs cite it. The working command is the direct nx invocation; the `test` target is auto-inferred by `@nx/jest/plugin` in `nx.json`.

**Note**: This broken script should be fixed (point it at `nx run user-control-panel:test --coverage`) as part of the feature, since SC-011 requires tests to run deterministically in CI and the documented command must work.

## Design Decisions

### D1: Interpret "approximately 100%" as all metrics ≥ 90%

**Decision**: Target all four coverage metrics (statements, branches, functions, lines) at ≥ 90% global, as documented in spec SC-010 and Assumptions.

**Rationale**: 100% on every metric (especially branches) is not a realistic or useful target; 90% is a defensible "approximately 100%" per the spec's own assumption.

### D2: Exclude test-only files from coverage rather than testing them

**Decision**: Add `!src/mocks/**` (and consider `!src/test/**`) to `collectCoverageFrom` in jest.config.ts.

**Rationale**: `src/mocks/*.ts` are empty stub shims (`export const mockApiClient = {}`) — they are test infrastructure, not application behavior. Testing them would be meaningless; excluding them is the clean fix (aligns with spec Assumption: "Test-only helper files are excluded from coverage").

### D3: Keep the 9 thin service-group wrappers' coverage via existing indirect tests

**Decision**: Do not create dedicated specs for the 9 thin wrappers (Binance, Bybit, Discord, Email, Kraken, OneSignal, Slack, SmsTwilio, WhatsappBusiness) — they are already 100% covered via `Settings.spec.tsx`.

**Rationale**: Creating trivial render tests for 1-line wrappers adds no value (constitution: avoid unnecessary complexity / meaningless tests).

### D4: Prioritize by coverage impact, then by user-behavior value

**Decision**: Order of work: (1) fix suite green (timeouts) + config excludes (immediate wins), (2) dedicated specs for 0% / sub-70% files (`RedirectToSignIn`, `TypewriterText`, `AuthLayout`, `Sidebar` gap, `FormProgressBar` branch), (3) deepen existing specs with real behavioral gaps (`ActionEditor`, `TelegramSettingsGroup`, `SimpleServiceSettingsGroup`, `RuleForm`, `signUpReducer`, `actionTree`, `JsonEditorField`, `Button`), (4) verify coverage ≥90% and document.

**Rationale**: Branch metric is furthest from target (76.71%); the enumerated files are where the uncovered branches live.

## Alternatives Considered

- **MSW instead of API-layer mocks**: rejected — guidelines and existing suite mock the API layer.
- **Testing `src/mocks/**` and `src/test/**`**: rejected — they are test infrastructure; exclude instead.
- **Dedicated specs for 9 thin service-group wrappers**: rejected — already 100% covered indirectly.
- **Raising the coverage target in jest.config.ts to 90%**: deferred to implementation — can be set once the suite reaches it, to enforce the goal going forward.
- **Fixing only `user-control-panel:test-coverage` script vs. also raising `testTimeout`**: both needed — the script for a working documented command, the timeout for a green suite.
