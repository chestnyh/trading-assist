# Phase 1 Data Model: Secure Session Credential Storage

Entities derived from the spec's Key Entities and FR-017–FR-024. Only one new persisted entity is introduced; the access credential, CSRF token, and stream ticket are stateless values.

## Persistence (PostgreSQL / Prisma)

### `Session` (new) — refresh credential row / session family lineage

One row per issued refresh token. A *session family* is the set of rows sharing `familyId`; it represents one sign-in lineage.

| Field | Type | Notes |
|---|---|---|
| `id` | `String @id @default(uuid())` | Row identifier; also recorded as `replacedById` on the rotated predecessor. |
| `userId` | `Int` | Owner. Relation to `User`, `onDelete: Cascade`. |
| `familyId` | `String` | UUID shared by every rotation in the lineage; the unit of revocation for reuse detection (FR-021). |
| `tokenHash` | `String @unique` | SHA-256 (hex) of the opaque refresh token. The raw token is never stored (R-003). |
| `rememberMe` | `Boolean @default(false)` | Captures the sign-in choice; drives `expiresAt` and cookie persistence (FR-004/FR-005/FR-019). |
| `expiresAt` | `DateTime` | Server-side expiry (`30d` when `rememberMe`, else `24h`). Enforced on every use. |
| `revokedAt` | `DateTime?` | Set on rotation, logout, password reset, or family invalidation. Non-null ⇒ not usable. |
| `replacedById` | `String?` | The `id` of the successor row created by rotation; used to recognize rotated tokens for grace handling. |
| `createdAt` | `DateTime @default(now())` | Issuance time. |
| `lastUsedAt` | `DateTime?` | Set on each successful rotation; used only for the concurrent-renewal grace window (R-004). |

Indexes / constraints:

```prisma
@@index([familyId])
@@index([userId])
@@unique([tokenHash])
```

`User` gains the back-relation: `sessions Session[]`.

**Validation rules**
- `tokenHash` is unique; lookup is by hash of the presented token.
- A row is *usable* only if `revokedAt IS NULL`, `replacedById IS NULL`, and `expiresAt > now()`.
- A row is *rotated* if `replacedById IS NOT NULL` (or `revokedAt`/`lastUsedAt` was set by rotation).
- Rotation always creates a new row in the **same** `familyId`; the predecessor's `replacedById` points at it.

**State transitions**

```text
        issue (login)
             │
             ▼
        ┌─────────┐   refresh (valid)   ┌──────────────┐
        │ ACTIVE  │ ──────────────────▶ │  ROTATED     │
        └─────────┘   create successor  │ (revokedAt + │
             │                          │ replacedById)│
             │ logout / password reset   └──────┬───────┘
             │ / family reuse detected          │ presented again
             ▼                                  ├─ within grace ──▶ rotate forward (new ACTIVE, family kept)
        ┌──────────┐                            └─ past grace ────▶ REUSE
        │ REVOKED  │                                 ▼
        │ (family) │                          revoke entire family → all rows REVOKED, user re-authenticates
        └──────────┘
             ▲
             └── expiresAt < now() ⇒ treated as unusable; a reuse of an expired rotated token still revokes the family if identifiable
```

## Stateless values (not persisted)

### Access Credential
- JWT, HS256, claims **unchanged**: `sub` (user id), `email`, `nickname`, `role`, `country` (FR-015), plus `aud: "api"` (R-006).
- Lifetime: `JWT_ACCESS_EXPIRES_IN` (default `15m`), independent of "Remember me" (FR-017).
- Delivered in `HttpOnly`, `SameSite=Lax`, `Secure`-configurable cookie `access_token`, `Path=/` (FR-001/FR-002/FR-003).
- Not returned in any response body (FR-003).

### Renewal Credential
- The raw opaque value lives only in the `refresh_token` cookie; the `Session` row stores its hash (FR-018).
- Delivered `HttpOnly`, `Path=/api/v1/auth`, session-cookie unless `rememberMe` (FR-019).
- Usable only at `POST /auth/refresh` (FR-024).

### Session Family
- Identified by `Session.familyId`; invalidated atomically on reuse (FR-021), logout (FR-022), or password reset (FR-023).

### Forgery-Proof Token (CSRF)
- `csrf_token` cookie: 256-bit random base64url, **not** `HttpOnly`, `SameSite=Lax`, `Path=/`, `Secure`-configurable.
- Rotated on login and on each successful refresh; cleared on logout.
- Validated by `CsrfGuard` against `X-CSRF-Token` on authenticated state-changing requests (FR-010/FR-011); read-only requests exempt (FR-012).

### Stream Ticket
- JWT, HS256, claims `{ sub, aud: "log-stream", purpose: "stream" }`, `expiresIn = JWT_STREAM_TICKET_EXPIRES_IN` (default `60s`).
- Returned in the `GET /auth/stream-ticket` JSON body (not a cookie); used only as the `token` query param to `apps/log-stream`.
- Cannot authorize API calls (API verifies `aud: "api"`) (FR-006, R-006).

## Entities from the spec — mapping

| Spec entity | Realization |
|---|---|
| Access Credential | `access_token` HttpOnly cookie (short-lived JWT, aud `api`) |
| Renewal Credential | `refresh_token` HttpOnly cookie + `Session` row (hash only) |
| Session Family | `Session.familyId` grouping |
| User Profile | Login/`/auth/me` response body: `{ id, nickname, email, name, role, country }` |
| Forgery-Proof Token | `csrf_token` cookie ↔ `X-CSRF-Token` header (double-submit) |
| Session State | Client state from `GET /auth/me` (not storage) |

## Relationship to existing models

- `User` (unchanged fields) — new `sessions Session[]` relation.
- `PasswordReset` (unchanged) — `AuthService.resetPassword` additionally revokes all of the user's sessions (FR-023).
- No other model changes; JWT claim format is untouched.
