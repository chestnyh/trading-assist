# Auth Session API Contract

Base path: `/api/v1` (global prefix in `apps/api/src/main.ts`). This contract is the source of truth for the regenerated OpenAPI document and Orval client (`libs/api-client`). All requests from the SPA are sent with `credentials: 'include'`.

## Cookie contract

| Cookie | `HttpOnly` | `SameSite` | `Secure` | `Path` | Persistence | Purpose |
|---|---|---|---|---|---|---|
| `access_token` | yes | `Lax` (configurable) | configurable (off in local HTTP dev, on in prod) | `/` | `Max-Age` = access TTL (15 min) | Authorizes API requests. Never readable by page scripts. |
| `refresh_token` | yes | `Lax` (configurable) | configurable | `/api/v1/auth` | `Max-Age=30d` when "Remember me"; session cookie otherwise | Renews the access credential. Sent only to `/auth/*`. |
| `csrf_token` | **no** | `Lax` (configurable) | configurable | `/` | matches refresh persistence | Double-submit value echoed in `X-CSRF-Token`. |

Rules:
- The API accepts the access credential **only** from the `access_token` cookie; `Authorization: Bearer` is no longer accepted (FR-006).
- Cookies are host-only unless `AUTH_COOKIE_DOMAIN` is configured (R-008).

## Request header contract

| Header | When required | Value |
|---|---|---|
| `X-CSRF-Token` | All authenticated `POST`/`PUT`/`PATCH`/`DELETE` requests | The current `csrf_token` cookie value |
| `Content-Type` | Requests with a body | `application/json` (existing) |

A missing or mismatched header on a state-changing authenticated request → **403 Forbidden** with `{ statusCode: 403, message: "Invalid or missing CSRF token" }`, and no state change (FR-011). `GET`/`HEAD`/`OPTIONS` are exempt (FR-012). Public pre-session endpoints are exempt via `@SkipCsrf()` (see below).

## Endpoints

### `POST /auth/login` (modified)

Request `application/json`:
```json
{ "email": "user@example.com", "password": "secret", "rememberMe": true }
```
`rememberMe` optional (default `false`).

Success `200` — response body contains **no credential** (FR-003):
```json
{
  "user": { "id": 1, "nickname": "johndoe123", "email": "user@example.com", "name": "John Doe", "role": "USER", "country": "UA" }
}
```
Response sets `Set-Cookie: access_token`, `refresh_token` (persistent iff `rememberMe`), `csrf_token`.

Errors:
- `400` — email not verified (existing behavior).
- `401` — invalid credentials (existing behavior).

### `GET /auth/me` (new) — session lookup

Requires a valid `access_token` cookie. Read-only, CSRF-exempt, no body.

Success `200`:
```json
{ "id": 1, "nickname": "johndoe123", "email": "user@example.com", "name": "John Doe", "role": "USER", "country": "UA" }
```
`401` when the access credential is missing/invalid/expired — the client then calls `/auth/refresh` and retries (FR-007).

### `POST /auth/refresh` (new) — renew + rotate

Requires `refresh_token` cookie and a valid `X-CSRF-Token` header. No request body.

Success `200`:
```json
{ "user": { "id": 1, "nickname": "johndoe123", "email": "user@example.com", "name": "John Doe", "role": "USER", "country": "UA" } }
```
Response rotates and rewrites `access_token`, `refresh_token` (same family), and `csrf_token`.

Errors:
- `401` — missing/expired/revoked refresh token.
- `403` — CSRF failure.
- Reuse of an already-rotated refresh token (outside the grace window) → `401` **and** the entire family is revoked (FR-021).

### `POST /auth/logout` (new)

Requires `access_token` (best effort), `refresh_token`, and `X-CSRF-Token`. No body.

Success `200` (or `204`): `{ "success": true }`.
Effects: revoke the presented refresh token's entire family server-side (FR-022), clear all three cookies (FR-009). Idempotent — succeeds even if the session was already invalid.

### `GET /auth/stream-ticket` (new)

Requires a valid `access_token` cookie. Read-only, CSRF-exempt.

Success `200`:
```json
{ "ticket": "<jwt aud=log-stream>", "expiresIn": 60 }
```
`401` when unauthenticated. `ticket` is a narrowly-scoped, short-lived JWT accepted only by `apps/log-stream` (`aud: "log-stream"`, `purpose: "stream"`); it is not accepted by the API (FR-006, R-006).

### Existing endpoints (unchanged)

`POST /auth/verify-email`, `POST /auth/forgot-password`, `POST /auth/verify-password-reset`, `POST /auth/reset-password`, `POST /users` keep their current request/response contracts.

- These are public/pre-session and are annotated `@SkipCsrf()` (FR-016, spec assumption that sign-up stays exempt).
- `POST /auth/reset-password` additionally revokes **all** `Session` rows for the affected user inside the same transaction as the password update (FR-023). No response change.

## CSRF enforcement map

| Surface | CSRF required |
|---|---|
| `POST /auth/login` | no (no CSRF cookie exists yet) |
| `POST /auth/refresh` | yes |
| `POST /auth/logout` | yes |
| `GET /auth/me`, `GET /auth/stream-ticket` | no (safe methods) |
| `rules`, `rules-settings`, `tags` controllers | yes for POST/PUT/PATCH/DELETE; GET exempt |
| `POST /users`, verify/forgot/reset password endpoints | no (`@SkipCsrf()`) |

Enforcement is global (`CsrfGuard`) so new mutation endpoints are protected by default; exemptions are explicit and auditable.

## CORS contract

`apps/api/src/main.ts` keeps the explicit origin allowlist and `credentials: true`, and adds `X-CSRF-Token` to `allowedHeaders`. `apps/log-stream` already allows `credentials: true` and needs no cookie support (it receives the ticket as a query param).
