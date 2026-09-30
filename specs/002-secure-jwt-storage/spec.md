# Feature Specification: Secure Session Credential Storage

**Input**: User description: "Move JWT access token storage out of browser Web Storage (localStorage/sessionStorage) into a server-managed session credential that page-level scripts cannot read, preserving the existing 'Remember me' behavior, adding protection against cross-site request forgery, and bounding the impact of a compromised credential through short-lived access tokens and a revocable, rotating refresh token — so the fix does not trade one vulnerability class for another and limits the damage of any future compromise."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sign-in credential is unreadable by page scripts (Priority: P1)

A signed-in user browses the application. The credential that keeps them signed in is held by the browser in a way that page-level JavaScript cannot read. If an attacker manages to inject a script into any page (for example through an unsanitized rule name or nickname), that script cannot extract the credential and replay it against the API to impersonate the user.

**Why this priority**: This is the root of the reported vulnerability. Until the credential is out of reach of page scripts, an XSS flaw of any severity escalates into full account takeover, including exposure of the role, email, nickname, and country carried in the credential.

**Independent Test**: Can be fully tested by signing in, attempting to read the session credential from every page-script-accessible location, and confirming it is not readable while authenticated API calls still succeed.

**Acceptance Scenarios**:

1. **Given** a user is signed in, **When** page-level script inspects every browser storage location available to scripts, **Then** the session credential is not present or readable in any of them.
2. **Given** a user is signed in, **When** page-level script attempts to read the credential through document or storage APIs, **Then** the value is not accessible.
3. **Given** a user is signed in, **When** the user performs a normal authenticated action, **Then** the action succeeds without the application ever handling the raw credential on the client.

---

### User Story 2 - "Remember me" behavior is preserved (Priority: P1)

A user signing in decides whether to stay signed in across browser restarts by using the "Remember me" option. Users who opt in remain signed in after closing and reopening the browser without re-entering credentials. Users who do not opt in are signed out when the browser closes.

**Why this priority**: The security change must not regress existing user experience. The persistence semantics of today's storage choice must be reproduced exactly, otherwise the fix breaks a core sign-in promise.

**Independent Test**: Can be fully tested by signing in with and without "Remember me", restarting the browser, and confirming the session persists only in the opted-in case.

**Acceptance Scenarios**:

1. **Given** a user signs in with "Remember me" enabled, **When** the browser is closed and reopened, **Then** the user is still signed in and can use the application without re-entering credentials.
2. **Given** a user signs in without "Remember me", **When** the browser is closed and reopened, **Then** the user is signed out and must sign in again.
3. **Given** a user signs in with "Remember me" enabled, **When** the long-lived session duration elapses without activity, **Then** the user is signed out and must sign in again.

---

### User Story 3 - Session state is restored from the server (Priority: P2)

A user reopens the application or reloads a page. The application asks the server whether the current session is valid and, if so, restores the signed-in state (including profile details such as nickname, role, and country) without the client ever holding the credential itself.

**Why this priority**: Determines whether the user appears signed in after a reload. Without it, the credential change leaves the application unable to know its own auth state, breaking every protected screen.

**Independent Test**: Can be fully tested by reloading a protected page while signed in and confirming the signed-in state and profile are restored.

**Acceptance Scenarios**:

1. **Given** a user has a valid session, **When** they reload the page, **Then** they remain signed in and the application shows their profile without re-entering credentials.
2. **Given** a user has no session or an expired/invalid one, **When** they open a protected page, **Then** they are treated as signed out and redirected to sign in.
3. **Given** a user chooses to sign out, **When** the sign-out completes, **Then** the session is invalidated on the server and the application returns to a signed-out state.

---

### User Story 4 - State-changing requests are protected against cross-site forgery (Priority: P2)

Because the session credential now travels with requests automatically, all requests that change data require proof that the request originated from the application itself. Requests missing valid proof are rejected, so a malicious third-party page cannot silently create, update, or delete data on the user's behalf.

**Why this priority**: Moving the credential into an automatically-sent carrier introduces cross-site request forgery exposure. Without this protection the fix trades one vulnerability for another, which the goals explicitly forbid.

**Independent Test**: Can be fully tested by issuing a data-changing request without valid proof and confirming it is rejected, then repeating with valid proof and confirming it succeeds.

**Acceptance Scenarios**:

1. **Given** a signed-in user, **When** a data-changing request is sent with valid proof of origin, **Then** it is processed normally.
2. **Given** a signed-in user, **When** a data-changing request is sent without valid proof (or with mismatched proof), **Then** it is rejected and no data changes.
3. **Given** a signed-in user, **When** a read-only request is sent, **Then** it is not blocked by the forgery check.

---

### User Story 5 - Impact of a compromised credential is bounded and revocable (Priority: P3)

The credential that authorizes API requests is short-lived, so a copy obtained through any means other than reading it from the browser (for example device compromise, log leakage, or any future flaw) is only useful for a brief window. A separate, longer-lived credential silently renews the short-lived one in the background so the user is not interrupted, but this renewal credential is tracked server-side, can be revoked immediately (on sign-out, password reset, or suspected compromise), and detects and invalidates itself if it is ever presented more than once.

**Why this priority**: This does not close the XSS vector itself (User Story 1 already does that) — it bounds the damage from any other way a credential could leak, and gives the application a way to actually end a session server-side instead of waiting for a long-lived token to expire on its own. It is prioritized below the P1/P2 stories because it is not required to resolve the specific vulnerability reported in the ticket, but is included so the fix does not leave a materially long-lived, non-revocable credential in place.

**Independent Test**: Can be fully tested by confirming the short-lived credential stops working after its short window, that a background renewal keeps the session alive transparently, that sign-out or password reset immediately invalidates the renewal credential server-side, and that presenting an already-used renewal credential a second time invalidates the whole session family.

**Acceptance Scenarios**:

1. **Given** a signed-in user, **When** the short window for the access credential elapses, **Then** the previously issued credential no longer authorizes API requests.
2. **Given** a signed-in user with an active session, **When** the access credential expires during normal use, **Then** the application silently obtains a new one using the renewal credential, without interrupting the user or requiring re-entry of credentials.
3. **Given** a user signs out or resets their password, **When** the action completes, **Then** the associated renewal credential is invalidated server-side and can no longer be used to obtain new access credentials, even if a copy exists elsewhere.
4. **Given** a renewal credential has already been used once to obtain a new access credential, **When** that same renewal credential is presented again, **Then** the request is rejected and the entire session family is invalidated server-side.

---

### Edge Cases

- What happens when a user still has a credential stored in the browser from before the change? It must not be trusted or used; the affected user is signed out once and must sign in again.
- What happens when page script is injected despite the change? It can still trigger requests as the user via the browser (a general XSS consequence) but cannot read, copy, or exfiltrate the credential for use elsewhere or after the session ends.
- What happens when the application and its API are served from different sites? Strict cross-site sending rules may prevent the credential from being attached; the deployment topology must be aligned with the chosen session mechanism.
- What happens when a session expires while the user is mid-action? The server rejects the request as unauthorized and the application returns the user to a signed-out state without losing unsaved input where possible.
- What happens when the user has multiple tabs open and signs out in one? Other tabs converge to the signed-out state on their next request.
- What happens when the credential is missing, malformed, or tampered with? The request is treated as unauthenticated.
- What happens in local development over an insecure connection? The secure-transport requirement of the credential mechanism must be accommodated so local sign-in still works.
- What happens to unauthenticated entry points (such as sign-up) that do not yet use the shared request client? Whether they require forgery proof must be decided explicitly rather than left implicit.
- What happens if the background renewal request itself fails (network error vs. actual invalidation)? A transient network failure must not sign the user out; only an explicit invalidation response should.
- What happens if two tabs both attempt to renew the access credential at nearly the same time? Only one renewal should succeed in rotating the renewal credential; the other must not be treated as reuse of an already-rotated credential and incorrectly trigger family invalidation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: After sign-in, the session credential MUST NOT be stored in any browser location readable by page-level scripts (including web storage, readable cookies, or JavaScript-accessible globals).
- **FR-002**: The credential MUST be transmitted to the API automatically by the browser on subsequent requests, without the client-side application code reading or attaching it.
- **FR-003**: The sign-in response body MUST NOT include the raw credential; it MUST return only non-sensitive profile data.
- **FR-004**: When "Remember me" is enabled, the session MUST persist across browser restarts for the configured long-lived duration.
- **FR-005**: When "Remember me" is disabled, the session MUST end when the browser closes, matching the current session-only behavior.
- **FR-006**: The credential MUST only be accepted by the API when presented as part of a valid session; direct copying/replay outside the browser session context MUST not grant access.
- **FR-007**: The application MUST determine its signed-in state by asking the server for the current user profile on load, rather than by reading a locally stored credential.
- **FR-008**: The client-side auth state MUST NOT expose or retain the raw credential in memory beyond what the platform requires.
- **FR-009**: Sign-out MUST invalidate the session server-side and clear the client-side signed-in state.
- **FR-010**: All data-changing requests (create, update, delete) MUST require proof that the request originated from the application, validated by the server before processing.
- **FR-011**: Data-changing requests lacking valid proof MUST be rejected with a forbidden response and MUST NOT modify any data.
- **FR-012**: Read-only requests (fetching data) MUST remain exempt from the forgery check.
- **FR-013**: Cross-origin requests from outside the application's own origin MUST NOT be granted credentialed access.
- **FR-014**: Pre-existing credentials stored by the previous mechanism MUST be ignored, and stale client-side copies MUST be removed.
- **FR-015**: The credential's identity contents MUST remain unchanged in format; only its lifetime, delivery, and storage location change.
- **FR-016**: Existing unauthenticated flows (email verification, password reset, sign-up) MUST continue to function unchanged unless explicitly brought under the forgery check.
- **FR-017**: The access credential used to authorize regular API requests MUST have a short, fixed lifetime (on the order of minutes), independent of the "Remember me" choice.
- **FR-018**: A separate renewal credential MUST be issued at sign-in, tracked server-side, and used exclusively to obtain new access credentials through a dedicated renewal capability.
- **FR-019**: The renewal credential's lifetime MUST be governed by the "Remember me" choice, per FR-004/FR-005, independently of the access credential's fixed short lifetime.
- **FR-020**: Each use of the renewal credential MUST invalidate it and issue a new one in its place (rotation); the previous value MUST no longer be accepted.
- **FR-021**: If an already-rotated (previously used) renewal credential is presented again, the server MUST invalidate the entire associated session family and require the user to sign in again.
- **FR-022**: Sign-out MUST invalidate the renewal credential server-side immediately, not merely clear it client-side, so a copy made before sign-out can no longer be used.
- **FR-023**: A password reset MUST invalidate all renewal credentials associated with the affected user, ending all existing sessions.
- **FR-024**: The renewal capability MUST be usable only for obtaining a new access credential and MUST NOT accept or process other API operations.

### Key Entities *(include if feature involves data)*

- **Access Credential**: The short-lived signed token that authorizes regular API requests. Held where page scripts cannot read it, renewed automatically in the background before or upon expiry.
- **Renewal Credential**: A separate, longer-lived value used only to obtain new access credentials. Tracked server-side per session, rotated on each use, and immediately invalidated on sign-out, password reset, or detected reuse.
- **Session Family**: The server-side record linking a user's renewal credential lineage, used to detect reuse of an already-rotated renewal credential and invalidate all related credentials together.
- **User Profile**: The non-sensitive identity data returned to the client (identifier, email, nickname, name, role, country). Delivered only through the session-lookup response, never alongside a credential.
- **Forgery-Proof Token**: A second value, issued at sign-in, that the client must present on data-changing requests so the server can confirm the request came from the application.
- **Session State**: The client's derived view of whether a user is signed in, sourced from the server rather than from local storage.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 0% of page-script-accessible storage locations contain any session credential after sign-in (verified by an automated check enumerating all such locations).
- **SC-002**: 100% of users who sign in with "Remember me" remain signed in after a browser restart, without re-entering credentials.
- **SC-003**: 100% of users who sign in without "Remember me" are signed out after a browser restart.
- **SC-004**: 100% of users who sign in are restored to a signed-in state after a page reload, with no credential re-entry.
- **SC-005**: 100% of data-changing requests without valid forgery proof are rejected and cause no data mutation.
- **SC-006**: 100% of legitimate data-changing and read-only requests continue to succeed, with no increase in failed requests attributable to the change.
- **SC-007**: A simulated XSS payload can no longer obtain a credential that authenticates to the API, whether during the session or after it ends.
- **SC-008**: Sign-in task completion rate is unchanged from the current baseline.
- **SC-009**: An access credential captured at any point in time no longer authorizes API requests once its short lifetime has elapsed, with no exceptions.
- **SC-010**: 100% of active sessions are terminated server-side within one renewal cycle of a sign-out or password reset, even for renewal credentials copied before the action.
- **SC-011**: Reuse of an already-rotated renewal credential results in invalidation of its entire session family in 100% of test cases, with no false-positive invalidations from legitimate concurrent renewals (see Edge Cases).
- **SC-012**: Background renewal of the access credential is transparent to the user in 100% of normal-usage sessions (no visible interruption or re-authentication prompt during an active "Remember me" or in-session period).

## Assumptions

- Frontend and API are served from the same site in all current deployments; subdomain-split or cross-site deployments are out of scope and would require a follow-up decision.
- The stateless double-submit style of forgery protection (a client-readable value echoed in a request header and validated server-side) is the chosen approach, as the platform has no server-side session store today; a server-side store of renewal-credential state is introduced specifically to support FR-018.
- The forgery check applies to authenticated data-changing requests; the unauthenticated sign-up entry point is exempt for this change and tracked as a follow-up if needed.
- Credentials currently held in browser storage are invalidated by the change, so every active user signs in once more after deployment.
- Production traffic uses secure transport; local development over insecure transport is accommodated via configuration so sign-in still works.
- JWT claim contents (email, id, nickname, role, country) are unchanged; the previous flat long-lived durations (30 days / 24 hours) are replaced by the access/renewal split described in FR-017–FR-019, with the renewal credential inheriting the "Remember me" duration semantics that previously applied to the single token.
- The session-lookup, sign-out, and renewal capabilities are new additions; all other existing auth endpoints keep their current contracts.
- No changes to the password reset, email verification, or user registration flows are required beyond invalidating renewal credentials on password reset (FR-023).
- Existing tests covering sign-in, session persistence, and the request client will be updated to reflect the new session mechanism, including renewal and rotation behavior.
