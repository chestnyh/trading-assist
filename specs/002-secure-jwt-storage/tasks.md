---

description: "Task list for Secure Session Credential Storage"
---

# Tasks: Secure Session Credential Storage

**Input**: Design documents from `/specs/002-secure-jwt-storage/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/auth-session-api.md, quickstart.md

**Tests**: Included. The project constitution (Principle V, NON-NEGOTIABLE) and research decision R-010 explicitly require automated coverage for rotation/reuse, CSRF, cookie issuance, session lookup, and the mutator refresh flow.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. File paths are real paths in this Nx monorepo.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Backend service: `apps/api/src/...`
- Log stream service: `apps/log-stream/src/...`
- React SPA: `apps/user-control-panel/src/...` (integration tests in `apps/user-control-panel/int-tests/`)
- Shared libraries: `libs/configs`, `libs/models`, `libs/api-client`, `libs/api-validator`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Dependencies, configuration keys, and the Prisma `Session` model that every user story relies on.

- [x] T001 Add auth session config keys to `libs/configs/src/lib/services-configs.ts`: `JWT_ACCESS_EXPIRES_IN` (default `15m`), `JWT_REFRESH_EXPIRES_IN` (default `24h`), `JWT_REFRESH_REMEMBER_EXPIRES_IN` (default `30d`), `JWT_STREAM_TICKET_EXPIRES_IN` (default `60s`), `AUTH_COOKIE_SECURE` (default `false`), `AUTH_COOKIE_SAME_SITE` (default `lax`), `AUTH_COOKIE_DOMAIN` (optional), `AUTH_REFRESH_GRACE_MS` (default `10000`)
- [x] T002 [P] Document the new keys in `.env.dev.example` and `.env.dev` under the `JWT CONFIGURATION` section, then run `pnpm development:check-envs:examples-check` to confirm the example stays in sync
- [x] T003 [P] Add `cookie-parser` as a dependency and `@types/cookie-parser` as a devDependency for the api project (root `package.json` + `pnpm install`)
- [x] T004 [P] Add the `Session` model and the `sessions Session[]` back-relation on `User` in `libs/models/prisma/schema.prisma` per `data-model.md`
- [ ] T005 Generate the `Session` Prisma migration under `libs/models/prisma/migrations/` and apply it with `pnpm models:migrations:run` (depends on T004)
- [x] T006 Regenerate and copy the Prisma client (`pnpm models:client:generate` then `pnpm models:copy-generated`) so `ModelsService.session` type-checks (depends on T005)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Cookie helpers, session primitive, CSRF infrastructure, and cookie-based API authentication that ALL user stories require.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T007 Create cookie set/clear helpers plus the cookie-name constants and attribute policy in `apps/api/src/api/auth/cookies.ts` (`access_token` Path=/, `refresh_token` Path=/api/v1/auth, `csrf_token` non-HttpOnly Path=/; `HttpOnly`, `SameSite`, `Secure` from config)
- [x] T008 [P] Create `SessionService` in `apps/api/src/api/auth/session.service.ts`: issue a refresh credential (opaque `crypto.randomBytes(48)` base64url, SHA-256 hash persisted), find usable row by token hash, revoke a family by `familyId`, and revoke all rows for a user (uses `ModelsService.session`)
- [x] T009 [P] Create `CsrfGuard` in `apps/api/src/api/auth/guards/csrf.guard.ts`: double-submit comparison (timing-safe) of `X-CSRF-Token` header vs `csrf_token` cookie for POST/PUT/PATCH/DELETE, `GET`/`HEAD`/`OPTIONS` exempt, `403` with `{ statusCode: 403, message: "Invalid or missing CSRF token" }`, honoring `@SkipCsrf()` metadata
- [x] T010 [P] Create the `@SkipCsrf()` decorator in `apps/api/src/api/auth/decorators/skip-csrf.decorator.ts`
- [x] T011 Update the API `JwtStrategy` in `apps/api/src/api/auth/strategies/jwt.strategy.ts` to extract the access credential from the `access_token` cookie only (via `cookie-parser`) and verify `audience: 'api'`; remove the Bearer extractor (depends on T007)
- [x] T012 [P] Update `apps/api/src/main.ts`: register `cookie-parser` middleware and add `X-CSRF-Token` to the CORS `allowedHeaders` list (keep the origin allowlist and `credentials: true`)
- [x] T013 Update `apps/api/src/api/auth/auth.module.ts`: provide `SessionService`, register `CsrfGuard` as a global guard through `APP_GUARD`, and export `SessionService` (depends on T008, T009)
- [x] T014 [P] Create the shared auth DTOs `me-response.dto.ts`, `refresh-response.dto.ts`, `logout-response.dto.ts`, `stream-ticket-response.dto.ts` under `apps/api/src/api/auth/dto/` and remove `access_token` from `apps/api/src/api/auth/dto/auth-response.dto.ts`
- [x] T015 [P] Unit test `SessionService` issuance, token-hash lookup, and family revocation in `apps/api/src/api/auth/session.service.spec.ts` (depends on T008)
- [x] T016 [P] Unit test `CsrfGuard` allow/deny/exempt/`@SkipCsrf` behavior in `apps/api/src/api/auth/guards/csrf.guard.spec.ts` (depends on T009)

**Checkpoint**: Cookie-based auth, session primitive, and CSRF guard are ready — user story work can begin.

---

## Phase 3: User Story 1 - Sign-in credential is unreadable by page scripts (Priority: P1) 🎯 MVP

**Goal**: The credential that keeps the user signed in lives only in an `HttpOnly` cookie; the login body returns only profile data; the API authenticates from the cookie; the client stores nothing.

**Independent Test**: Sign in, enumerate `localStorage`/`sessionStorage`/`document.cookie` — no session credential is present (`document.cookie` shows only `csrf_token`) — while authenticated API calls still succeed.

- [x] T017 [US1] Rewrite `AuthService.login` in `apps/api/src/api/auth/auth.service.ts` to issue the access/refresh/CSRF cookies via `SessionService` + `cookies.ts` and return only the user profile (no `access_token`); sign the access JWT with `JWT_ACCESS_EXPIRES_IN` and `aud: 'api'`
- [x] T018 [US1] Update `AuthController.login` in `apps/api/src/api/auth/auth.controller.ts` to inject `@Res({ passthrough: true })` and set the cookies returned by the service (depends on T017)
- [x] T019 [P] [US1] Update `libs/api-client/src/lib/mutator.ts`: send `credentials: 'include'` on every request and remove the `Authorization`/Bearer logic and any token read from `localStorage`/`sessionStorage`
- [x] T020 [P] [US1] Update `apps/user-control-panel/src/app/contexts/AuthContext.tsx`: remove token state and all `localStorage`/`sessionStorage` persistence, derive auth state from the in-memory user, expose `isAuthenticated` instead of `token`, and delete legacy `auth_token`/`user_data` keys on bootstrap (FR-014)
- [x] T021 [P] [US1] Replace `token` gates with `isAuthenticated` in `apps/user-control-panel/src/app/contexts/RulesContext.tsx`, `apps/user-control-panel/src/features/settings/components/useServiceRuleSettings.ts`, `apps/user-control-panel/src/features/settings/components/TagPicker.tsx`, and `apps/user-control-panel/src/features/settings/components/RuleSettingForm.tsx` (depends on T020)
- [x] T022 [P] [US1] Unit test login cookie issuance and the token-free response body in `apps/api/src/api/auth/auth.service.spec.ts`
- [x] T023 [P] [US1] Unit test that the mutator sends `credentials: 'include'` and no `Authorization` header in `libs/api-client/src/lib/mutator.spec.ts`
- [x] T024 [US1] Update frontend tests for the token-free login body and cookie session: `apps/user-control-panel/src/features/signIn/SignIn.spec.tsx`, `apps/user-control-panel/src/app/app.spec.tsx`, `apps/user-control-panel/int-tests/auth.integration.spec.tsx` (depends on T020, T021)

**Checkpoint**: User Story 1 is functional and independently testable (MVP).

---

## Phase 4: User Story 2 - "Remember me" behavior is preserved (Priority: P1)

**Goal**: `rememberMe` selects the refresh credential's server expiry (30 d vs 24 h) and its cookie persistence (persistent vs session cookie). The access credential stays short-lived and independent.

**Independent Test**: Sign in with "Remember me" → `refresh_token` has a `Max-Age` and survives a browser restart; sign in without it → session cookie and the session ends when the browser closes.

- [x] T025 [US2] Implement `rememberMe`-driven server expiry (`JWT_REFRESH_REMEMBER_EXPIRES_IN` vs `JWT_REFRESH_EXPIRES_IN`) in `SessionService` in `apps/api/src/api/auth/session.service.ts`
- [x] T026 [US2] Implement persistent-vs-session refresh cookie attributes in `apps/api/src/api/auth/cookies.ts` (`Max-Age` only when `rememberMe` is true)
- [x] T027 [US2] Thread the `rememberMe` flag from `AuthService.login` through session issuance and cookie setting in `apps/api/src/api/auth/auth.service.ts` (depends on T025, T026)
- [x] T028 [P] [US2] Unit test rememberMe expiry/persistence semantics in `apps/api/src/api/auth/session.service.spec.ts` and add `apps/api/src/api/auth/cookies.spec.ts` for the cookie attribute policy
- [x] T029 [US2] Add "Remember me" persistence coverage (persistent vs session cookie mocks) to `apps/user-control-panel/int-tests/auth.integration.spec.tsx`

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Session state is restored from the server (Priority: P2)

**Goal**: The client derives signed-in state from `GET /auth/me` on bootstrap, `POST /auth/logout` invalidates the session server-side and clears cookies, and tabs converge.

**Independent Test**: Reload a protected page while signed in → state and profile restored without re-entering credentials; with no cookie → redirected to sign-in; sign out → server-invalidated and signed out.

- [x] T030 [US3] Implement `AuthService.getSessionUser` and the `GET /auth/me` handler in `apps/api/src/api/auth/auth.controller.ts` (guarded by `JwtAuthGuard`, returns the `me-response.dto.ts` profile) 
- [x] T031 [US3] Implement `AuthService.logout` and the `POST /auth/logout` handler in `apps/api/src/api/auth/auth.controller.ts`: revoke the presented refresh token's family, clear all three cookies, and remain idempotent (FR-009, FR-022)
- [ ] T032 [US3] Regenerate the OpenAPI document and client (`pnpm api-client:generate-openapi`, `pnpm api-client:generate-client`) and confirm `authControllerMe`/`authControllerRefresh`/`authControllerLogout`/`authControllerStreamTicket` exist in `libs/api-client/src/lib/api-client.ts` (depends on T030, T031)
- [x] T033 [P] [US3] Update `apps/user-control-panel/src/app/contexts/AuthContext.tsx` to bootstrap from `authControllerMe`, call `authControllerLogout` on sign-out, and sync tabs via `BroadcastChannel` (depends on T032)
- [x] T034 [P] [US3] Unit test `me` and `logout` in `apps/api/src/api/auth/auth.service.spec.ts`
- [x] T035 [US3] Unit test AuthContext bootstrap/logout and add a reload-restoration integration test in `apps/user-control-panel/src/app/contexts/AuthContext.spec.tsx` and `apps/user-control-panel/int-tests/auth.integration.spec.tsx` (depends on T033)

**Checkpoint**: User Stories 1–3 work independently.

---

## Phase 6: User Story 4 - State-changing requests are protected against cross-site forgery (Priority: P2)

**Goal**: A `csrf_token` cookie is issued at sign-in, the client echoes it in `X-CSRF-Token`, and the global guard rejects forged/missing proof while exempting reads and pre-session endpoints.

**Independent Test**: A state-changing request without valid proof returns `403` and changes nothing; the same request with valid proof succeeds; a `GET` succeeds without the header.

- [x] T036 [US4] Issue/rotate the readable `csrf_token` cookie at sign-in in `apps/api/src/api/auth/auth.service.ts`
- [x] T037 [US4] Inject `X-CSRF-Token` (read from the `csrf_token` cookie) on state-changing requests in `libs/api-client/src/lib/mutator.ts`
- [x] T038 [P] [US4] Annotate pre-session/public endpoints with `@SkipCsrf()`: `apps/api/src/api/users/users.api.controller.ts` and the verify/forgot/reset handlers in `apps/api/src/api/auth/auth.controller.ts`
- [x] T039 [P] [US4] Extend `apps/api/src/api/auth/guards/csrf.guard.spec.ts` to cover the enforcement map (login exempt, refresh/logout required, GET exempt, `@SkipCsrf` endpoints exempt)
- [ ] T040 [US4] Add integration coverage for `403`-on-missing/mismatched proof with no mutation and success-with-proof in `apps/user-control-panel/int-tests/auth.integration.spec.tsx`

**Checkpoint**: User Stories 1–4 work independently.

---

## Phase 7: User Story 5 - Impact of a compromised credential is bounded and revocable (Priority: P3)

**Goal**: Short-lived access tokens renewed transparently via a rotating, server-tracked refresh credential with reuse detection and family revocation; sign-out and password reset invalidate server-side; log streaming preserved via a scoped stream ticket.

**Independent Test**: Access credential stops working after its window; a 401 triggers a transparent refresh + retry; sign-out and password reset invalidate the renewal credential server-side; replaying a rotated refresh token outside the grace window revokes the family, while a concurrent renewal inside the window does not.

- [x] T041 [US5] Implement `SessionService.rotate` (grace-window concurrent renewal vs reuse detection with `replacedById`/`revokedAt` and atomic family revocation) in `apps/api/src/api/auth/session.service.ts` (FR-020, FR-021)
- [x] T042 [US5] Implement `AuthService.refresh` + the `POST /auth/refresh` handler in `apps/api/src/api/auth/auth.controller.ts`: rotate the refresh token, reissue access/refresh/CSRF cookies, return the user profile, and return `401` with family revocation on reuse (depends on T041)
- [x] T043 [US5] Implement `AuthService.issueStreamTicket` + the `GET /auth/stream-ticket` handler in `apps/api/src/api/auth/auth.controller.ts`: JWT with `aud: 'log-stream'`, `purpose: 'stream'`, `JWT_STREAM_TICKET_EXPIRES_IN` (FR-006, R-006)
- [x] T044 [P] [US5] Update `apps/log-stream/src/log-stream/auth/jwt.strategy.ts` to verify `audience: 'log-stream'` and reject `aud: 'api'` tokens
- [x] T045 [US5] Revoke all `Session` rows for the user inside the same transaction as the password update in `AuthService.resetPassword` in `apps/api/src/api/auth/auth.service.ts` (use `ModelsService.runInTransaction`, FR-023)
- [x] T046 [US5] Update `libs/api-client/src/lib/mutator.ts` to handle a `401` by calling `POST /auth/refresh` once and retrying the original request, never for `/auth/login`, `/auth/refresh`, or `/auth/me` (no loops)
- [x] T047 [P] [US5] Update `apps/user-control-panel/src/features/rules/hooks/useRuleLogs.ts` and `apps/user-control-panel/src/features/rules/RuleDetailsPage.tsx` to obtain a stream ticket via `GET /auth/stream-ticket` and use it as the `?token=` query param
- [x] T048 [P] [US5] Unit test refresh rotation, reuse + grace-window family revocation, logout, password-reset revocation, and stream-ticket audience in `apps/api/src/api/auth/auth.service.spec.ts` and `apps/api/src/api/auth/session.service.spec.ts`
- [x] T049 [P] [US5] Unit test the mutator 401→refresh→retry flow and the no-loop guard in `libs/api-client/src/lib/mutator.spec.ts`
- [x] T050 [P] [US5] Unit test that the log-stream strategy rejects `aud: 'api'` and accepts `aud: 'log-stream'` in `apps/log-stream/src/log-stream/auth/jwt.strategy.spec.ts`
- [ ] T051 [US5] Add integration coverage for transparent renewal and the stream-ticket flow in `apps/user-control-panel/int-tests/auth.integration.spec.tsx`

**Checkpoint**: All user stories are independently functional.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, validation, and repo-wide checks across all stories.

- [x] T052 [P] Document the new environment keys in `.env.devops.example` and `libs/configs/README.md`
- [x] T053 [P] Verify `libs/api-validator/src/lib/schemas/user.ts` needs no request-schema changes (login/refresh/logout/me/stream-ticket bodies are empty or unchanged) and add response schemas only if the generated client requires them
- [x] T054 Run `pnpm all:test`, `pnpm all:lint`, and `pnpm all:build` and fix any failures introduced by the change
- [x] T055 Security review pass: confirm no credential is reachable from page scripts, `Secure` is on in production and off for local HTTP dev, cookie `Path`/`SameSite` match the contract, and the CORS origin allowlist is unchanged
- [ ] T056 Run the `specs/002-secure-jwt-storage/quickstart.md` validation checklist end-to-end
- [x] T057 Run `pnpm all:knip` and `pnpm check:md-links` to catch dead exports and broken doc links

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational completion
  - US1 and US2 are both P1; complete US1 first (it defines login issuance) then US2
  - US3, US4, US5 follow in priority order, but each is independently testable
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational only
- **US2 (P1)**: Depends on Foundational and builds on US1's login issuance (same `login`/cookie path)
- **US3 (P2)**: Depends on Foundational; uses the generated client refreshed in T032
- **US4 (P2)**: Depends on Foundational; login `csrf_token` issuance builds on US1's login
- **US5 (P3)**: Depends on Foundational; refresh/logout reuse the cookie auth from US1 and the session primitive

### Within Each User Story

- Service logic before controller wiring
- Backend endpoints before regenerating the client (T032) that frontend tasks consume
- Implementation before its test task
- Story complete before moving to the next priority

### Parallel Opportunities

- Setup: T002, T003, T004 in parallel (T005 → T006 after T004)
- Foundational: T007, T008, T009, T010, T012, T014 in parallel; T011 after T007; T013 after T008/T009; T015/T016 after their targets
- US1: T019, T020, T022, T023 in parallel; T021 after T020; T024 after T020/T021
- US2: T028 in parallel with T027
- US3: T033, T034 in parallel after T032; T035 after T033
- US4: T038, T039 in parallel
- US5: T044, T047, T048, T049, T050 in parallel

---

## Parallel Example: User Story 1

```bash
# Launch independent implementation tasks together:
Task: "Update mutator.ts for credentials:'include' and drop Bearer in libs/api-client/src/lib/mutator.ts"
Task: "Remove storage from AuthContext.tsx in apps/user-control-panel/src/app/contexts/AuthContext.tsx"
Task: "Unit test login cookie issuance in apps/api/src/api/auth/auth.service.spec.ts"
Task: "Unit test mutator credentials behavior in libs/api-client/src/lib/mutator.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Sign in and confirm no credential is readable by page scripts while API calls succeed
5. Demo if ready

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. US1 → validate → deploy (MVP: credential out of Web Storage)
3. US2 → validate "Remember me" semantics → deploy
4. US3 → validate reload/logout → deploy
5. US4 → validate CSRF enforcement → deploy
6. US5 → validate rotation/reuse/stream ticket → deploy
7. Polish → full suite, lint, build, quickstart checklist

### Parallel Team Strategy

1. Team completes Setup + Foundational together
2. Then: Developer A = US1/US2, Developer B = US3, Developer C = US4/US5
3. T032 (client regeneration) must land before frontend-dependent tasks run

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps a task to its spec user story for traceability
- Tests are required by the constitution (Principle V) and R-010
- Commit after each task or logical group
- Avoid: editing `session.service.ts`, `auth.service.ts`, `auth.controller.ts`, `cookies.ts`, or `mutator.ts` from two tasks at once
