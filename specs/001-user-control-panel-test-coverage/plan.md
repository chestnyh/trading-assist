# Implementation Plan: User-Control-Panel Test Coverage

**Branch**: `001-user-control-panel-test-coverage` | **Date**: 2026-08-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-user-control-panel-test-coverage/spec.md`

**Note**: This template is filled in by the `$speckit-plan` command; its definition describes the execution workflow.

## Summary

Add and verify automated test coverage for the `user-control-panel` Nx application so that every user-facing feature — mainPage/landing, Dashboard + route authorization, Not Found, Sign Up, Sign In, Restore Password, Rules, Settings, and shared UI components — is covered by tests, any remaining important functionality is identified and tested, and the whole project reaches approximately 100% coverage (all coverage metrics ≥ 90%). The feature adds tests only; no production source code is changed.

## Technical Context

**Language/Version**: TypeScript (React 19.0.0), Nx monorepo

**Primary Dependencies**: React 19, react-router-dom 6.30.1, zod, jsoneditor; dev: @testing-library/react 16, @testing-library/user-event 14, @testing-library/jest-dom, jest + @nx/jest

**Storage**: N/A (tests use mocked API layer; no persistent storage involved)

**Testing**: Jest with jsdom test environment (jest.config.ts), @nx/react/babel transform, setup file `src/test/setupTests.ts`, coverage via `nx run user-control-panel:test --coverage`

**Target Platform**: Web application (React SPA); tests run in CI under Node.js/jest-jsdom

**Project Type**: Web application (frontend SPA)

**Performance Goals**: N/A (test feature — no production performance goals)

**Constraints**: Existing jest.config.ts coverageThreshold (global 70%); target is all metrics ≥ 90%; tests must be deterministic in CI

**Scale/Scope**: Single app (`apps/user-control-panel`); ~37 existing spec files; coverage baseline ≈ 87% statements / 77% branches / 88% functions / 89% lines

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on the project constitution (`/.specify/memory/constitution.md`):

- **V. Tested Code (NON-NEGOTIABLE)**: This feature directly advances this principle — adding automated tests for user-facing behavior, with deterministic tests runnable in CI. ✅
- **I. Clean Code**: Tests must be readable, focused, and avoid duplication; use existing test conventions. ✅
- **IV. Shared Libraries as Separate Projects**: Tests live within the app project (`apps/user-control-panel`); no cross-project boundary violations. ✅
- **II. Simple UI/UX**: Tests verify user-observable behavior, not implementation internals. ✅
- No constitution violations expected; no Complexity Tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-user-control-panel-test-coverage/
├── plan.md              # This file ($speckit-plan command output)
├── research.md          # Phase 0 output ($speckit-plan command)
├── data-model.md        # Phase 1 output ($speckit-plan command)
├── quickstart.md        # Phase 1 output ($speckit-plan command)
├── contracts/           # Phase 1 output ($speckit-plan command)
└── tasks.md             # Phase 2 output ($speckit-tasks command - NOT created by $speckit-plan)
```

### Source Code (repository root)

```text
apps/user-control-panel/
├── src/
│   ├── app/                          # route guards, contexts, RuleForm, Pagination
│   ├── features/
│   │   ├── mainPage/                 # Main landing page
│   │   ├── dashboard/                # Dashboard component
│   │   ├── notFound/                 # NotFound page
│   │   ├── signIn/                   # Sign-in form + session
│   │   ├── signInUp/                 # Sign-up wizard (steps 1-4)
│   │   ├── restorePassword/          # 3-step password reset
│   │   ├── rules/                    # Rules list/CRUD/details/logs/action-editor
│   │   ├── settings/                 # Settings + service groups + Telegram flow
│   │   └── layout/                   # PagesLayout, AuthLayout
│   ├── shared/                       # components, ui, data, utils
│   └── test/                         # setupTests.ts, asset-stub.ts, mocks/
├── int-tests/                        # 3 full-app integration specs
├── jest.config.ts                    # jest config + coverage thresholds
└── project.json                      # Nx project (test target inferred by @nx/jest)
```

**Structure Decision**: Tests are co-located with source under `apps/user-control-panel/src/**` (existing convention — `*.spec.ts(x)` files next to the code they test), with full-app integration specs in `apps/user-control-panel/int-tests/`. No new source directories are added; this feature only creates test files alongside existing source files and updates test configuration if needed (e.g., excluding test-only mocks from coverage).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

None — no constitution violations. This feature adds tests only, following existing project structure and conventions.

## Design Artifacts (Phase 0 & 1)

The plan workflow produced the following artifacts in this feature directory:

- **research.md** — Phase 0 output. Resolves all unknowns: current test infra (Jest/jsdom/RTL), documented conventions (`_docs/testing-guidelines.md`), **measured coverage baseline (86.91% st / 76.71% br / 87.93% fn / 88.82% lines)**, the **7 currently-timeout-failing tests** in 4 suites (must be fixed for a green suite), the concrete coverage-gap file list, the broken `user-control-panel:test-coverage` script, and design decisions (D1–D4).
- **data-model.md** — Phase 1 output. Documents existing domain entities (User, Session, Rule, Rule Log Entry, Service Settings Rule) as test-relevant behaviors; no new data model.
- **contracts/contracts.md** — Phase 1 output. Documents the app's existing behavioral contracts (routing/authorization model, auth flows, rules, settings, shared UI, contexts) that tests MUST verify.
- **quickstart.md** — Phase 1 output. Validation/run guide: commands (`pnpm nx run user-control-panel:test --coverage`), 10 validation scenarios mapped to spec user stories, and pass conditions (green suite, all metrics ≥ 90%).

### Post-Design Constitution Re-Check

*GATE: Re-checked after Phase 1 design.*

- **V. Tested Code (NON-NEGOTIABLE)**: Design advances it — the plan adds behavior-verifying tests and fixes the suite to be green/deterministic. ✅
- **I. Clean Code**: Design avoids meaningless tests (no dedicated specs for the 9 thin 100%-covered wrappers; excludes test-only mocks rather than testing them). ✅
- **II. Simple UI/UX / IV. Shared Libraries**: Tests verify user-observable behavior within the app project; no boundary violations. ✅
- **Stack adherence**: No new languages/infrastructure; uses existing Jest/RTL setup. ✅

**No violations. No Complexity Tracking needed.** The design is ready for `$speckit-tasks`.
