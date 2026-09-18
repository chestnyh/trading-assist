# Quickstart: Secure Session Credential Storage

Validation guide for proving the feature works end-to-end. It references the [data model](./data-model.md) and the [API contract](./contracts/auth-session-api.md) instead of restating them. Unit/integration suites are the primary gate; manual checks confirm the browser-level guarantees.

## Prerequisites

- Node 22, pnpm 9, dependencies installed (`pnpm install`).
- Local environment file present (`.env.dev` copied from `.env.dev.example`).
- PostgreSQL running (`pnpm development:external-up` or the project's docker setup).
- New env keys added to `.env.dev` / `.env.dev.example` (see [plan.md](./plan.md) and R-008): `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `JWT_REFRESH_REMEMBER_EXPIRES_IN`, `JWT_STREAM_TICKET_EXPIRES_IN`, `AUTH_COOKIE_SECURE`, `AUTH_COOKIE_SAME_SITE`, optional `AUTH_COOKIE_DOMAIN`.

## Setup

```bash
pnpm install
pnpm models:migrations:run        # applies the new Session migration
pnpm models:migrations:seed       # optional: seed users
pnpm api-client:generate-openapi  # regenerates libs/api-client/openapi.json
pnpm api-client:generate-client   # regenerates libs/api-client/src/lib/api-client.ts
```

Start services (in separate terminals):

```bash
pnpm api:start                     # http://localhost:3001/api/v1
pnpm user-control-panel:start      # http://localhost:4200
pnpm log-stream:start              # http://localhost:3002 (needed for Scenario 6)
```

## Automated validation

```bash
pnpm api:test                      # backend unit tests
pnpm user-control-panel:test       # frontend unit + integration tests
pnpm all:test                      # full suite (CI parity)
pnpm all:lint                      # lint
pnpm all:build                     # build
```

Expected: all green. Coverage thresholds for `user-control-panel` (70%) still met.

## Scenario 1 — credential is unreadable by page scripts (US1, SC-001, SC-007)

1. Sign in from the SPA.
2. In DevTools → Application, inspect `localStorage` and `sessionStorage`: neither `auth_token` nor `user_data` is present.
3. In the console, evaluate every readable location — `localStorage`, `sessionStorage`, `document.cookie`, `window` globals. `document.cookie` contains only `csrf_token`; no access/refresh token value is visible.
4. Confirm authenticated calls (e.g. open Dashboard → rules list) still succeed.
5. Confirm the login response body contains only `user`, no `access_token` (Network tab).

Expected: no session credential anywhere readable; API calls succeed. This is the FR-001/FR-002/FR-003/FR-008/SC-007 proof.

## Scenario 2 — "Remember me" persistence (US2, FR-004/FR-005)

1. Sign in **with** "Remember me". Inspect cookies: `refresh_token` has a `Max-Age` (persistent).
2. Close and reopen the browser. Expected: still signed in (SC-002).
3. Sign out, then sign in **without** "Remember me". Confirm `refresh_token` is a session cookie (no `Max-Age`).
4. Close and reopen the browser. Expected: signed out (SC-003).

## Scenario 3 — session restored from the server (US3, FR-007, SC-004)

1. While signed in, reload a protected page (`/dashboard`).
2. Expected: signed-in state and profile (nickname/email/name/role/country) restored via `GET /auth/me`; no credential re-entry.
3. Clear cookies and reload. Expected: redirected to `/sign-in` (SC-004/FR-007).
4. Click sign out. Expected: `POST /auth/logout` returns success, all cookies cleared, redirected to sign-in (FR-009/FR-022).

## Scenario 4 — CSRF protection (US4, FR-010/FR-011/FR-012, SC-005)

1. Signed in, perform a normal data-changing action (create/edit a rule). Expected: succeeds.
2. Via `curl`/fetch from the app console, repeat the same request **without** `X-CSRF-Token` (cookies included). Expected: `403`, no data change.
3. Repeat with a mismatched `X-CSRF-Token`. Expected: `403`, no data change.
4. Issue a `GET` (e.g. rules list) without the header. Expected: `200` (exempt).
5. Cross-origin `POST` from a different origin. Expected: rejected (CSRF guard and/or CORS) (FR-013).

## Scenario 5 — short-lived access token and transparent renewal (US5, FR-017/FR-018/FR-020, SC-009/SC-012)

1. Temporarily set `JWT_ACCESS_EXPIRES_IN=30s` and use the app for over a minute.
2. Expected: requests after expiry are transparently retried after `POST /auth/refresh`; no visible interruption or re-login (SC-012). The Network tab shows a `401` on the original call followed by a successful refresh and retry.
3. Inspect the `Session` table: each refresh created a new row in the same `familyId` and linked the predecessor via `replacedById`; the predecessor has `revokedAt` set (rotation, FR-020).

## Scenario 6 — log streaming still works via stream ticket (R-006)

1. Open a rule's live logs (requires `log-stream` running).
2. Expected: the SPA calls `GET /auth/stream-ticket`, then opens the SSE connection with `?token=<ticket>`; events stream normally.
3. Confirm the ticket value is not the access credential and that the same ticket is rejected by `GET /api/v1/auth/me` (`401`) — audience separation.

## Scenario 7 — reuse detection and family revocation (US5, FR-021, SC-011)

In a test (unit or scripted) using a captured `refresh_token`:

1. Call `POST /auth/refresh` → succeeds and rotates.
2. Replay the **original** refresh token after the grace window (default 10 s) → `401`, and every `Session` row with that `familyId` is revoked; the user must sign in again (SC-011).

Concurrency check:

3. Present the original token again **within** the grace window → rotation forward succeeds and the family is **not** revoked (no false-positive, spec edge case).

## Scenario 8 — password reset ends all sessions (FR-023, SC-010)

1. Signed in on two clients, trigger forgot-password → verify code → reset password.
2. Expected: all `Session` rows for the user are revoked in the same transaction; refresh attempts on both clients return `401` and they are signed out.

## Scenario 9 — legacy credential cleanup (FR-014)

1. Before deploying, set `localStorage.auth_token = "stale"` and `sessionStorage.user_data = "{}"` in a browser.
2. Load the updated app. Expected: both keys are removed on bootstrap; the stale value is never used; the user is treated as signed out once and must sign in again.

## Scenario 10 — local development over HTTP (R-008)

1. With `AUTH_COOKIE_SECURE=false`, sign in at `http://localhost:4200`. Expected: cookies are set and sent; sign-in works (spec edge case).
2. Verify production config sets `AUTH_COOKIE_SECURE=true` and same-site topology (spec assumption).

## Validation checklist

- [ ] `pnpm all:test` and `pnpm all:lint` pass.
- [ ] No session credential in `localStorage`, `sessionStorage`, or `document.cookie`.
- [ ] "Remember me" persistence semantics match the old localStorage/sessionStorage behavior.
- [ ] `/auth/me` restores state on reload; logout invalidates server-side.
- [ ] State-changing requests without valid CSRF proof → `403` and no mutation; reads unaffected.
- [ ] Access token expires on schedule; renewal is transparent.
- [ ] Reuse outside grace revokes the family; concurrent renewal within grace does not.
- [ ] Password reset revokes all sessions.
- [ ] Legacy stored tokens removed and ignored.
- [ ] Live rule logs stream via the short-lived ticket.
