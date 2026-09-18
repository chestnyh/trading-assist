# Phase 0 Research: Secure Session Credential Storage

All Technical Context unknowns are resolved below. Each decision records what was chosen, why, and what was rejected.

## R-001 — Session transport mechanism

**Decision**: Deliver the access credential in an `HttpOnly`, `SameSite=Lax` cookie (`access_token`) set by `apps/api`, and make the API authenticate **only** from that cookie. Remove the `Authorization: Bearer` extractor from the API JWT strategy.

**Rationale**: `HttpOnly` cookies are unreadable by page scripts, directly satisfying FR-001/FR-002/FR-008. Accepting Bearer as well would leave a replayable path if a token leaked through any other channel, violating FR-006. The spec assumes a same-site deployment, and `SameSite=Lax` is sufficient for cross-port local development (site ignores port), so no `SameSite=None`/`Secure` requirement is forced on dev HTTP.

**Alternatives considered**:
- *Keep Bearer + Web Storage*: rejected — this is the reported vulnerability.
- *Cookie plus Bearer fallback*: rejected — violates FR-006 (replay).
- *BFF/proxy pattern*: rejected — no such infrastructure exists and it is a much larger change than the spec calls for.

## R-002 — CSRF protection strategy

**Decision**: Stateless double-submit. On sign-in the API sets a **non-`HttpOnly`** `csrf_token` cookie (256-bit random, base64url). The client reads it and echoes it in an `X-CSRF-Token` header on every state-changing request. A global `CsrfGuard` validates header == cookie with a timing-safe comparison for `POST/PUT/PATCH/DELETE` and returns 403 on mismatch/missing; read-only methods are exempt. Public, pre-session endpoints are exempt via a `@SkipCsrf()` decorator.

**Rationale**: Matches the spec assumption (stateless double-submit; no server-side session store needed for CSRF). `SameSite=Lax` already blocks cross-site POSTs in modern browsers; the token adds defense in depth and covers older/edge behavior. Nothing new to persist.

**Alternatives considered**:
- *Synchronizer token stored server-side*: rejected — requires a session store and more machinery for the same guarantee.
- *HMAC-signed double-submit*: deferred as hardening; the plain form is the spec's stated choice. Noted as a low-risk follow-up.
- *Origin/Referer checking only*: rejected — brittle behind proxies and not a complete control.

**Known limitation (documented, accepted)**: the CSRF cookie is readable by XSS. That is inherent to double-submit and acceptable here because the threat being addressed is *cross-site* forgery, not XSS (XSS can already issue same-origin requests as the user).

## R-003 — Refresh credential format and storage

**Decision**: The refresh credential is an **opaque random token** (`crypto.randomBytes(48)` base64url), not a JWT. Only its SHA-256 hash is persisted, in a new `Session` table in PostgreSQL. It is delivered in an `HttpOnly` `refresh_token` cookie scoped to `Path=/api/v1/auth` so it is sent only to the refresh/logout endpoints.

**Rationale**: Opaque tokens are revocable and rotatable, cannot be self-validated if the DB is unavailable, and their entropy makes a fast hash sufficient (no bcrypt needed). Hashing at rest means a DB read does not yield replayable tokens. Path-scoping the cookie reduces its exposure surface. PostgreSQL is the system of record per the constitution; no new infra.

**Alternatives considered**:
- *Refresh JWT*: rejected — not revocable server-side without a denylist, which reintroduces the same DB state anyway.
- *Redis for session state*: rejected — Redis is the log-transport store; using PostgreSQL keeps one source of truth and avoids an availability dependency for auth.
- *Store raw token*: rejected — weaker at-rest posture.

## R-004 — Rotation, reuse detection, and concurrent-renewal grace

**Decision**: Every successful refresh consumes the presented token and issues a new one in the same **family** (a `familyId` UUID shared across the lineage). The consumed row is marked revoked and linked to its replacement. If a token is presented that is already revoked/replaced:
- within a short grace window (default 10 s) → treat as **legitimate concurrent renewal** (e.g. two tabs): do not revoke the family; rotate forward by issuing a new token in the same family;
- otherwise → treat as **reuse**: revoke the entire family (`revokedAt = now()` for all rows with that `familyId`), forcing re-authentication (FR-021).

**Rationale**: Rotation with reuse detection is the standard refresh-token-rotation (RTR) pattern and satisfies FR-020/FR-021/SC-011. The grace window is required by the spec's edge case about simultaneous tab renewals and prevents false-positive family invalidation. The window is deliberately small to keep the replay surface tiny.

**Alternatives considered**:
- *No grace window*: rejected — would invalidate families on legitimate concurrent renewals (explicit spec edge case).
- *Idempotency keys / return same raw token*: rejected — we only store hashes, and it adds client coordination for no meaningful benefit.
- *Reuse detection by deleting rotated rows*: rejected — deletion destroys the evidence needed to detect reuse.

## R-005 — "Remember me" semantics

**Decision**: `rememberMe` selects the refresh credential's lifetime and cookie persistence, not the access token:
- `rememberMe: true` → server expiry `30d`, refresh cookie given `Max-Age=30d` (persistent, survives browser restart).
- otherwise → server expiry `24h` and a **session cookie** (no `Max-Age`), so it ends when the browser closes, matching today's `sessionStorage` behavior.

The access token is always short-lived (15 min) and independent of the choice.

**Rationale**: Reproduces the existing localStorage-vs-sessionStorage distinction exactly (FR-004/FR-005) at the only place persistence matters (FR-019), and mirrors the spec's note that the renewal credential inherits the old durations (30 d / 24 h).

**Alternatives considered**: per-access-token "remember me" (rejected — reintroduces a long-lived authorizer, contradicting FR-017); remember-me as a client-side flag (rejected — must be server-enforced).

## R-006 — Access token lifetime, audience, and stream ticket

**Decision**: Access JWTs are signed with `expiresIn = JWT_ACCESS_EXPIRES_IN` (default `15m`) and an audience claim `aud: "api"`. The API's `JwtStrategy` verifies `audience: "api"`. To preserve the `log-stream` SSE feature (which today receives the raw JWT as a `?token=` query param), the API exposes `GET /auth/stream-ticket`, returning a **separate** short-lived JWT (`JWT_STREAM_TICKET_EXPIRES_IN`, default `60s`) with `aud: "log-stream"` and a `purpose: "stream"` claim. `apps/log-stream`'s strategy verifies `audience: "log-stream"`.

**Rationale**: The client can no longer read the session credential, so SSE cannot reuse it. A narrow, minutes-long ticket that is only valid for the stream audience satisfies FR-006 (session credential remains non-replayable) and FR-008 (raw session credential never retained client-side) without exposing the session to a second service. Audience separation prevents a stream ticket from being replayed against the API and vice versa. This scope was explicitly confirmed with the product owner.

**Alternatives considered**:
- *Out of scope / accept broken log streaming*: rejected by the owner.
- *`log-stream` reads the access cookie directly via `credentials: 'include'`*: viable but couples a second service to the access-cookie contract and forces SSE reconnects to handle the 15-min access expiry; rejected in favour of the narrower ticket.
- *Long-lived separate secret per service*: rejected — unnecessary; audience claim + shared secret is sufficient.

## R-007 — Client auth state, silent renewal, and legacy cleanup

**Decision**: `AuthContext` derives auth state from `GET /auth/me` on bootstrap, never from storage. The Orval mutator adds `credentials: 'include'` to every request, injects `X-CSRF-Token` from the readable cookie on state-changing requests, removes the `Authorization` header logic, and transparently handles a 401 by calling `POST /auth/refresh` once and retrying the original request (never for `/auth/refresh`, `/auth/login`, or `/auth/me`). On bootstrap the app also removes any legacy `auth_token`/`user_data` from `localStorage` and `sessionStorage` (FR-014). Logout calls `POST /auth/logout` and broadcasts via `BroadcastChannel` so other tabs converge.

**Rationale**: FR-007/FR-009 require server-sourced state and server-side invalidation; a cookie-only design means the client has no token to store. Refresh-on-401 delivers FR-018/FR-020/SC-012 transparently. A single retry with an endpoint guard prevents loops. Legacy cleanup is a one-time, harmless write on load. BroadcastChannel covers the multi-tab edge case without polling.

**Alternatives considered**:
- *Poll `/me` periodically*: rejected — needless traffic; refresh-on-401 is sufficient.
- *Keep React state holding a token*: rejected — violates FR-008.
- *`window.storage` events for tab sync*: rejected — no credential is in storage anymore; BroadcastChannel is the correct primitive.

## R-008 — Cookie attribute policy and local development

**Decision**: Cookie attributes are driven by config (`libs/configs`): `AUTH_COOKIE_SECURE` (default `false` in dev, `true` in production), `AUTH_COOKIE_SAME_SITE` (default `lax`), optional `AUTH_COOKIE_DOMAIN` (unset → host-only). `access_token` and `csrf_token` use `Path=/`; `refresh_token` uses `Path=/api/v1/auth`. CORS `allowedHeaders` gains `X-CSRF-Token`; the existing explicit origin allowlist and `credentials: true` are kept. `cookie-parser` middleware is registered in `apps/api/src/main.ts`.

**Rationale**: `Secure` must be off for plain-HTTP local development (spec edge case) but on in production; making it explicit and configurable avoids a broken local sign-in while keeping production safe. Host-only cookies work because SPA and API are same-site.

**Alternatives considered**: hard-coding `Secure` (breaks dev) or `SameSite=None` (unnecessary and requires `Secure`).

## R-009 — Migration and backward compatibility

**Decision**: Add a `Session` Prisma model and migration. Because access tokens are now cookie-only and all clients sign in again, pre-existing browser-stored tokens are simply ignored and cleaned up (FR-014). The JWT claim set is unchanged (FR-015). `JWT_EXPIRES_IN` is retained for `log-stream`'s `JwtModule` defaults but no longer governs API access tokens.

**Rationale**: Avoids a token-compatibility shim; the spec explicitly accepts a one-time re-sign-in. Keeps the existing claim contract.

**Alternatives considered**: dual-mode acceptance of old tokens during a transition window (rejected — contradicts FR-006/FR-014).

## R-010 — Test strategy

**Decision**:
- Backend unit tests (Jest, node): `SessionService` (create/rotate/reuse/grace/family revoke/expiry), `CsrfGuard` (allow/deny/exempt), `AuthService` (cookie issuance, no token in login body, logout revoke, password-reset family revocation, stream-ticket audience), `JwtStrategy` (cookie-only, audience).
- Frontend unit tests (Jest, jsdom): mutator (credentials, CSRF header, 401→refresh→retry and no-loop), `AuthContext` (bootstrap via `/me`, login, logout, legacy storage cleanup).
- Integration: update `int-tests/auth.integration.spec.tsx`, `SignIn.spec.tsx`, `app.spec.tsx` for the token-free login body and cookie-session mocks.
- Migration is exercised through the existing Prisma migration targets.

**Rationale**: Satisfies Constitution Principle V for every behavior that can move money or leak data, and keeps tests deterministic by mocking `fetch`/Prisma.

**Alternatives considered**: relying on the existing integration tests alone (rejected — rotation/reuse and CSRF are security-critical and need direct unit coverage).

## Resolved NEEDS CLARIFICATION

The Technical Context had no residual `NEEDS CLARIFICATION` after the above decisions. The one genuinely open item discovered during exploration — how `log-stream` SSE obtains a credential once the session token is `HttpOnly` — was escalated and resolved with the owner as **R-006 (short-lived stream ticket)**.
