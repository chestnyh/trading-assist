# Implementation Plan: Secure Session Credential Storage

**Branch**: `002-secure-jwt-storage` | **Date**: 2026-09-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-secure-jwt-storage/spec.md`

## Summary

Move the session credential out of browser Web Storage into `HttpOnly` cookies set by the `apps/api` service, so page-level scripts can no longer read or exfiltrate it. The single long-lived JWT is replaced by a short-lived (15 min) access token JWT delivered in an `HttpOnly` cookie, plus a separate opaque, server-tracked, rotating refresh token (also `HttpOnly`) whose lifetime encodes the existing "Remember me" semantics (30 days persistent vs. session-only). Rotation reuse is detected and invalidates the whole session family. Because the credential now travels automatically, a double-submit CSRF token (`csrf_token` readable cookie + `X-CSRF-Token` header) is required on authenticated state-changing requests. The client stops reading/storing tokens, derives signed-in state from a new server session-lookup endpoint, silently refreshes on 401, and the `log-stream` SSE feature is preserved via a purpose-scoped, short-lived stream ticket that cannot be used against the API.

## Technical Context

**Language/Version**: TypeScript 5.7 (NestJS 10 on Express for `apps/api`; React 19 + react-router-dom 6 SPA for `apps/user-control-panel`)

**Primary Dependencies**: `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `@nestjs/swagger` (API); Orval-generated `fetch` client + Zod (`@trading-bot/api-client`, `@trading-bot/api-validator`); Prisma 7 + `@prisma/adapter-pg` (`@trading-bot/models`). New dependency: `cookie-parser` (+ `@types/cookie-parser`) for `apps/api`; Node's built-in `crypto` for token generation/rotation.

**Storage**: PostgreSQL via Prisma (`libs/models`). New `Session` model stores refresh-token lineage (family) server-side. No new infrastructure (constitution stack); Redis is intentionally not used so the system of record remains PostgreSQL.

**Testing**: Jest via Nx (`@nx/jest`) — unit tests colocated as `*.spec.ts` (node env) in `apps/api`, `*.spec.tsx` (jsdom, Babel) in `apps/user-control-panel`; component/integration tests in `apps/user-control-panel/int-tests/*.integration.spec.tsx`. Run with `pnpm api:test`, `pnpm user-control-panel:test`, `pnpm all:test`.

**Target Platform**: Linux server (AWS EC2/CodeDeploy); same-site deployment of SPA and API (spec assumption).

**Project Type**: Nx monorepo — web service (`apps/api`), React SPA (`apps/user-control-panel`), secondary microservice (`apps/log-stream`), shared libs.

**Performance Goals**: No new performance targets; a refresh adds one indexed primary-key/unique lookup plus one insert per rotation. Existing API p95 must not regress materially.

**Constraints**: Access token lifetime on the order of minutes (15 min default); refresh lifetime bound by "Remember me" (30 d persistent / session-only + 24 h server bound); cookies `SameSite=Lax`, `Secure` configurable for local HTTP dev; all protected API traffic must be same-site (spec assumption).

**Scale/Scope**: Existing auth surface plus 4 new endpoints (`/auth/me`, `/auth/refresh`, `/auth/logout`, `/auth/stream-ticket`); one new Prisma model + migration; ~6 backend files, ~3 frontend files, shared config/validator/client updates; update existing sign-in, session-persistence, and request-client tests.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Assessment |
|---|---|
| **I. Clean Code** | PASS — change is narrowly scoped to the auth domain; new logic (`SessionService`, `CsrfGuard`, cookie helper) each does one job; no speculative abstraction. |
| **II. Simple UI/UX** | PASS — sign-in UI is unchanged (same "Remember me" checkbox); the user-visible behavior of the flow is preserved. No new screens or controls. |
| **III. Microservice Architecture** | PASS — `apps/api` owns auth and its session data; no shared mutable state or cross-service DB coupling. `log-stream` validates a self-contained signed ticket; it keeps its own auth boundary. |
| **IV. Shared Libraries as Separate Projects** | PASS — config keys go to `libs/configs`; session model/migration to `libs/models`; client mutation to `libs/api-client`; validators to `libs/api-validator`. Session logic stays in `apps/api` (single consumer, domain-specific) rather than being prematurely extracted. No relative-path smuggling. |
| **V. Tested Code (NON-NEGOTIABLE)** | PASS (with required work) — rotation/reuse-detection, CSRF guard, logout/password-reset invalidation, session lookup, mutator refresh/CSRF behavior, and updated integration flows all get automated tests; deterministic and CI-runnable. |
| **Technology Stack** | PASS — TypeScript, Nx, PostgreSQL only. `cookie-parser` is an application dependency, not new infrastructure or language. |

**Gate result**: PASS — no violations, Complexity Tracking left empty.

**Post-design re-check (after Phase 1)**: PASS. The generated design adds one persisted model (`Session` in `libs/models`), one new dependency (`cookie-parser`, application-level), and no new projects, infra, or cross-service data coupling. Config keys land in `libs/configs`, the client mutation stays in `libs/api-client`, and auth/session logic remains inside `apps/api`. Principle V is satisfied by the test plan in R-010. No violations; Complexity Tracking remains empty.

## Project Structure

### Documentation (this feature)

```text
specs/002-secure-jwt-storage/
├── plan.md              # This file ($speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── auth-session-api.md
└── tasks.md             # Phase 2 output ($speckit-tasks command - NOT created by $speckit-plan)
```

### Source Code (repository root)

```text
apps/api/
├── src/main.ts                                   # cookie-parser + CORS allowedHeaders (X-CSRF-Token)
└── src/api/
    ├── api.module.ts                             # register global CsrfGuard
    ├── auth/
    │   ├── auth.controller.ts                    # login/me/refresh/logout/stream-ticket + existing flows
    │   ├── auth.service.ts                       # cookie issuance, rotation, family revocation, stream ticket
    │   ├── auth.module.ts
    │   ├── session.service.ts                    # NEW: refresh-token create/rotate/revoke/reuse-detect
    │   ├── cookies.ts                            # NEW: cookie set/clear helpers + attribute policy
    │   ├── guards/csrf.guard.ts                  # NEW: double-submit validation
    │   ├── guards/jwt-auth.guard.ts
    │   ├── decorators/skip-csrf.decorator.ts     # NEW
    │   ├── strategies/jwt.strategy.ts            # cookie extractor + audience check
    │   └── dto/*.dto.ts                          # login response (no token), me/refresh/logout/stream-ticket
    ├── rules/rules.controller.ts                 # unchanged guards; mutations now CSRF-checked globally
    ├── rules-settings/rules-settings.controller.ts
    └── tags/tags.controller.ts

apps/log-stream/
└── src/log-stream/auth/jwt.strategy.ts           # accept audience "log-stream" stream tickets

apps/user-control-panel/
├── src/app/contexts/AuthContext.tsx              # server session lookup; no storage; logout via API; tab sync
├── src/features/rules/hooks/useRuleLogs.ts       # obtain stream ticket instead of raw JWT
└── int-tests/auth.integration.spec.tsx           # updated for cookie session

libs/api-client/
├── src/lib/mutator.ts                            # credentials:'include', CSRF header, 401->refresh->retry, drop Bearer
├── src/lib/api-client.ts                         # regenerated (me/refresh/logout/stream-ticket)
└── openapi.json                                  # regenerated

libs/configs/src/lib/services-configs.ts          # access/refresh/stream TTLs, cookie policy
libs/models/prisma/schema.prisma                  # Session model + User relation
libs/models/prisma/migrations/                    # new migration
libs/api-validator/src/lib/schemas/user.ts        # (only if new request/response schemas are needed)
```

**Structure Decision**: Nx monorepo with flat `apps/<name>` and `libs/<name>` projects (confirmed: no `libs/<scope>/<type>` nesting, all project `tags: []`). Auth is owned by `apps/api/src/api/auth`; the frontend consumes it through the shared `libs/api-client`; persistence lives in `libs/models`; env-driven behavior in `libs/configs`. This follows the existing layout — no new projects or boundary changes.

## Complexity Tracking

> No Constitution Check violations. Section intentionally empty.
