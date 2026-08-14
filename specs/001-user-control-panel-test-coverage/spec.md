# Feature Specification: User-Control-Panel Test Coverage

**Feature Branch**: `001-user-control-panel-test-coverage`

**Created**: 2026-08-14

**Status**: Draft

**Input**: User description: "Add and verify test coverage for the user-control-panel project. Acceptance criteria: Add tests for the mainPage feature. Verify that the Dashboard component renders correctly. Verify that the Dashboard is displayed only for authorized users. Add tests for the Not Found feature. Add tests for the Sign Up feature. Add tests for the Restore Password feature. Add tests for the Rules feature. Add tests for the Settings feature. After all existing features are covered, identify any other important functionality in user-control-panel that should be tested. The whole user-control-panel project should have approximately 100% test coverage. Important context: I have already implemented tests for this task. Do not assume that existing tests are correct or complete. The purpose of this specification is to define what behavior must be covered by tests."

## User Scenarios & Testing *(mandatory)*

**Who benefits**: The user-control-panel is a web application that lets traders configure trading bots, rules, and service integrations, manage their account, and monitor rule execution logs. The "users" of this feature are the development team and future maintainers; the "behavior that must be covered by tests" is the user-facing functionality of the application. Each user story below is a behavioral area that automated tests MUST verify.

### User Story 1 - Main landing page, dashboard, and route authorization (Priority: P1)

As a visitor or signed-in user, I can open the app: unauthenticated visitors see the public marketing landing page, and signed-in users can reach a protected Dashboard. The application MUST verify through tests that the landing page renders and that the Dashboard is rendered ONLY for authorized users.

**Why this priority**: This is the entry point and the core authorization gate of the application. If the public landing page or the Dashboard/auth-gating breaks, every user journey is affected. Tests here verify the foundation for all other features.

**Independent Test**: A test renders the public landing page and asserts its key sections render; a separate test renders the app as an unauthenticated user requesting `/dashboard` and asserts redirection to sign-in, and as an authenticated user asserts the Dashboard renders. Delivers verified entry-point and authorization behavior.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user, **When** they open the app at the root path, **Then** the public landing page (hero, "How it works", testimonials, FAQ, calls-to-action) renders without requiring authentication.
2. **Given** an unauthenticated user, **When** they navigate to the Dashboard path, **Then** they are redirected to the sign-in page.
3. **Given** an authenticated user, **When** they navigate to the Dashboard path, **Then** the Dashboard component renders.
4. **Given** an authenticated user, **When** they visit the Dashboard, **Then** the app chrome (header, sidebar with navigation to Dashboard/Rules/Settings, footer) renders around it.

### User Story 2 - Sign-up (registration) flow (Priority: P1)

As a new trader, I can register through a multi-step sign-up wizard. Tests MUST verify that each step renders and validates correctly, that registration succeeds or fails with appropriate feedback, and that email verification is handled.

**Why this priority**: Registration is a mandatory onboarding path and includes multi-step validation and API interactions; regressions here block new users from creating accounts.

**Independent Test**: A test drives the wizard from step 1 through step 4: enters personal information, trading preferences, account credentials, and an email verification code, asserting per-step validation errors, successful account creation, and verification handling. Delivers verified registration behavior.

**Acceptance Scenarios**:

1. **Given** a user on the sign-up page, **When** they complete step 1 (personal info) with invalid data, **Then** validation errors are shown and they cannot advance.
2. **Given** a user on the sign-up page, **When** they complete all steps with valid data, **Then** the account creation request is submitted and they are taken to the email-verification step.
3. **Given** a user at the verification step, **When** they enter a valid 6-digit code, **Then** their email is verified and they are redirected to sign in.
4. **Given** an API failure during registration (e.g., duplicate account, network error), **When** the user submits, **Then** a user-friendly error is shown and the user stays in the flow.
5. **Given** a signed-in user, **When** they visit the sign-up page, **Then** they are redirected away (the sign-up route is only for unauthenticated users).

### User Story 3 - Sign-in and session behavior (Priority: P1)

As a returning user, I can sign in with email and password, choose to stay signed in, and sign out. Tests MUST verify client-side validation, successful authentication, session persistence, error handling, and logout.

**Why this priority**: Sign-in is the authorization entry point; session handling (remember me, logout) underpins the protected areas of the app.

**Independent Test**: A test fills the sign-in form, submits valid credentials, and asserts navigation to the Dashboard and token persistence; another test asserts invalid credentials show an error and the user remains on the page; a third asserts logout clears the session. Delivers verified authentication behavior.

**Acceptance Scenarios**:

1. **Given** a user on the sign-in page, **When** they submit valid credentials with "Remember me" checked, **Then** they are authenticated, navigated to the Dashboard, and the session persists across reloads.
2. **Given** a user on the sign-in page, **When** they submit invalid or unverified credentials, **Then** a user-friendly error is displayed and they are not authenticated.
3. **Given** a signed-in user, **When** they sign out, **Then** the session is cleared and they are returned to the sign-in page.
4. **Given** a returning user with a stored session, **When** they reopen the app, **Then** they are recognized as authenticated (session restored).

### User Story 4 - Restore password flow (Priority: P1)

As a user who forgot their password, I can request a reset via email, verify a secret code, and set a new password. Tests MUST verify each of the three steps, including validation and error handling.

**Why this priority**: Password recovery is a security-critical path; broken recovery locks users out of their accounts.

**Independent Test**: A test walks the three-step flow: requests a reset code for an email, verifies the code, and sets a new password, asserting navigation to sign-in on success and error handling at each step. Delivers verified password-recovery behavior.

**Acceptance Scenarios**:

1. **Given** a user on the restore-password page, **When** they submit a valid email, **Then** a reset request is sent and they advance to the code step.
2. **Given** a user at the code step, **When** they enter a valid secret code, **Then** they advance to the new-password step.
3. **Given** a user at the new-password step, **When** they submit matching valid passwords, **Then** the password is reset and they are redirected to sign in.
4. **Given** a user at the code step, **When** too many attempts are made, **Then** a "maximum attempts exceeded" state is shown with an option to request a new code.

### User Story 5 - Rules management (Priority: P1)

As a trader, I can list, create, update, view, and delete automation rules; I can paginate through a large list; I can view a rule's details including its structured action tree and live execution logs. Tests MUST verify all of these behaviors.

**Why this priority**: Rules are the central value-delivering feature of the product; list, CRUD, pagination, details, and live logs all involve substantial logic (validation, SSE streaming, tree parsing) that needs coverage.

**Independent Test**: Tests render the rules list (loading, empty, error, populated, paginated states), create/update/delete a rule through the form, view rule details and logs, and unit-test the action-tree parse/serialize utilities. Delivers verified rules behavior.

**Acceptance Scenarios**:

1. **Given** a signed-in user on the rules page, **When** rules are loading, **Then** a loading indicator is shown; when loading fails, an error alert with retry is shown; when no rules exist, an empty state with a "add a rule" action is shown.
2. **Given** a signed-in user on the rules page, **When** rules exist, **Then** they are listed with edit and delete actions, and pagination controls appear when there are more than one page of rules.
3. **Given** a signed-in user on the add/update rule page, **When** they submit valid rule data, **Then** the rule is created/updated and they are returned to the rules list; invalid data shows validation errors.
4. **Given** a signed-in user viewing a rule's details, **When** the rule exists, **Then** its description, structured action tree, JSON view, and execution logs are displayed; when it does not exist, a not-found state is shown.
5. **Given** a rule with a live log stream, **When** the user opens the details page, **Then** log entries appear in real time and the stream reconnects on failure.

### User Story 6 - Settings and service integrations (Priority: P1)

As a trader, I can manage settings for the services my rules integrate with (Telegram, Email, Discord, Slack, SMS Twilio, OneSignal, WhatsApp Business, Binance, Bybit, Kraken): expand a service group, list its settings rules, add, edit, delete, and paginate; the Telegram group has a guided onboarding flow. Tests MUST verify these behaviors.

**Why this priority**: Settings configure how rules connect to external services; broken settings management breaks rule execution against those services.

**Independent Test**: Tests render the settings page with all service groups, expand a generic group and add/edit/delete/paginate its settings rules, and drive the Telegram onboarding flow from bot-token entry to chat-id confirmation. Delivers verified settings behavior.

**Acceptance Scenarios**:

1. **Given** a signed-in user on the settings page, **When** the page loads, **Then** all service groups are shown and expandable.
2. **Given** a signed-in user, **When** they expand a generic service group, **Then** its settings rules load (with loading/error states) and they can add, edit, delete, and load more settings.
3. **Given** a signed-in user, **When** they expand the Telegram group and follow the onboarding flow, **Then** they can enter a bot token, receive a chat id, confirm it, and save the setting.
4. **Given** a user editing a setting, **When** they submit invalid data, **Then** validation errors are shown and the setting is not saved.

### User Story 7 - Not-found handling (Priority: P2)

As a user, when I navigate to an unknown path, I see a not-found page with a way back to the Dashboard. Tests MUST verify the not-found page renders and its navigation works, and that the routing rules decide correctly between not-found and sign-in redirect based on authentication.

**Why this priority**: A graceful 404 is a low-effort, high-visibility UX guarantee; it also exercises the catch-all routing behavior shared with authorization.

**Independent Test**: A test renders the not-found page and asserts its content and "Go to Dashboard" navigation; a routing test asserts unknown paths show not-found for authenticated users and redirect to sign-in for unauthenticated users. Delivers verified 404 behavior.

**Acceptance Scenarios**:

1. **Given** any user, **When** they navigate to an unknown path while authenticated, **Then** a not-found page with a "Go to Dashboard" action is shown.
2. **Given** an unauthenticated user, **When** they navigate to an unknown path, **Then** they are redirected to sign-in.

### User Story 8 - Shared UI components (Priority: P2)

As a developer, I rely on reusable shared components (header, footer, sidebar, buttons, forms, modals, avatars, theme toggle, JSON editor). Tests MUST verify they render and behave as intended, since they are reused across features.

**Why this priority**: Shared components underpin every feature; a regression in one affects the whole app, so they need direct coverage.

**Independent Test**: Component tests render each shared component in isolation and assert rendering, interactions (dropdowns, modals, toggles, form fields, validation), and navigation. Delivers verified shared UI behavior.

**Acceptance Scenarios**:

1. **Given** the header, **When** rendered for an unauthenticated user, **Then** it shows a sign-in action; when rendered for an authenticated user, **Then** it shows the user menu with sign-out.
2. **Given** the sidebar, **When** rendered, **Then** navigation items for Dashboard, Rules, and Settings render, and the sidebar collapses/expands.
3. **Given** a confirmation modal, **When** opened, **Then** it shows its message, confirms or cancels, and closes on Escape with body scroll locked.
4. **Given** the theme toggle, **When** clicked, **Then** the theme switches between light and dark and the choice is persisted.
5. **Given** shared form controls and the JSON editor, **When** used, **Then** they render labels, errors, and callbacks correctly.

### User Story 9 - Remaining important functionality identification (Priority: P3)

As a maintainer, after the primary features are covered, I need the remaining important functionality in the app to be identified and tested, so the overall coverage target is reached.

**Why this priority**: The acceptance criteria require identifying anything else that matters beyond the named features; this closes the gap to the overall coverage goal.

**Independent Test**: A review of the source tree identifies uncovered important behaviors (e.g., layout components, route guards, auth context edge cases, live-log stream handling, action-editor branch paths) and tests are added for them. Delivers verified completeness.

**Acceptance Scenarios**:

1. **Given** the completed feature coverage, **When** the source tree is reviewed, **Then** important functionality not in the named features (layout, route guards, contexts, data helpers) has dedicated tests.
2. **Given** the full test suite, **When** coverage is measured, **Then** the whole project's coverage is approximately 100% (see Success Criteria).

### Edge Cases

- Unauthenticated navigation to every protected path (`/dashboard`, `/rules*`, `/settings`) redirects to sign-in; authenticated navigation to auth-only paths (`/sign-in`, `/sign-up`, `/restore-password`) redirects away.
- Sign-up with an already-registered email or a network failure shows a user-friendly error and keeps the user in the flow.
- Sign-in with invalid credentials, an unverified email, or a server error shows the appropriate error and does not authenticate.
- Password reset with too many code attempts, an expired session, mismatched passwords, or a network failure is handled without losing the user.
- Rules list with no rules (empty state), a load failure (error + retry), a deleted rule, a rule that no longer exists (not found), and a page beyond available data.
- Rule log stream: disconnection, reconnection attempts, and malformed messages are handled without crashing.
- Settings: a service group that fails to load, a setting deleted while editing, an invalid setting value, and the Telegram flow error path.
- Shared components: modal Escape/overlay close, dropdown outside-click, theme persistence, and JSON editor error state.
- Unknown routes: authenticated users see not-found; unauthenticated users are redirected to sign-in.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST have automated tests covering the public landing page (mainPage feature) that verify its key sections render.
- **FR-002**: The system MUST have automated tests verifying that the Dashboard component renders correctly.
- **FR-003**: The system MUST have automated tests verifying that the Dashboard is displayed only for authorized users, and that unauthenticated users are redirected to sign-in.
- **FR-004**: The system MUST have automated tests covering the Not Found feature, including its rendering and navigation.
- **FR-005**: The system MUST have automated tests covering the Sign Up feature, including the multi-step wizard, validation, account creation, and email verification.
- **FR-006**: The system MUST have automated tests covering the Sign In feature, including validation, authentication, session persistence, and error handling.
- **FR-007**: The system MUST have automated tests covering the Restore Password feature, including the request-code, verify-code, and new-password steps.
- **FR-008**: The system MUST have automated tests covering the Rules feature, including list states, create/update/delete, pagination, details, action tree, and live logs.
- **FR-009**: The system MUST have automated tests covering the Settings feature, including service groups, settings CRUD and pagination, validation, and the Telegram onboarding flow.
- **FR-010**: The system MUST have automated tests covering shared UI components reused across features (header, footer, sidebar, buttons, forms, modals, avatars, theme toggle, JSON editor).
- **FR-011**: After the named features are covered, the system MUST have tests for any other important functionality identified in the user-control-panel (e.g., layout, route guards, auth and rules contexts, live-log stream handling, action-editor branch paths).
- **FR-012**: The tests MUST run deterministically in CI and verify behavior through user-observable outcomes rather than implementation details.
- **FR-013**: The full user-control-panel test suite MUST achieve approximately 100% coverage of the project's source code.

### Key Entities *(include if feature involves data)*

- **User**: A person who registers, signs in, and manages their trading configuration. Key attributes: name, country, trading experience, strategy, risk tolerance, platforms, email, nickname, password, verification status.
- **Rule**: An automation a user configures (name, description, structured action tree/rule body) that is listed, created, updated, viewed, and deleted; produces execution logs.
- **Rule Log Entry**: A time-stamped event emitted by a rule's execution, streamed live to the details page.
- **Service Settings Rule**: A per-service configuration (Telegram, Email, Discord, Slack, SMS Twilio, OneSignal, WhatsApp Business, Binance, Bybit, Kraken) with detail fields and tags, managed through the settings page.
- **Session**: The authentication state (token plus user data) that persists across reloads when "remember me" is used and is cleared on logout.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The test suite covers the mainPage feature (landing page) with tests verifying its sections render.
- **SC-002**: The test suite verifies the Dashboard renders and is accessible only to authenticated users (unauthenticated users are redirected).
- **SC-003**: The test suite verifies the Not Found feature (rendering and navigation).
- **SC-004**: The test suite verifies the Sign Up flow (wizard steps, validation, registration, email verification).
- **SC-005**: The test suite verifies the Sign In flow (validation, authentication, session persistence, logout).
- **SC-006**: The test suite verifies the Restore Password flow (request, verify, reset).
- **SC-007**: The test suite verifies the Rules feature (list states, CRUD, pagination, details, action tree, live logs).
- **SC-008**: The test suite verifies the Settings feature (service groups, settings CRUD, pagination, validation, Telegram flow).
- **SC-009**: The test suite verifies shared UI components and any other important functionality identified beyond the named features.
- **SC-010**: The user-control-panel project achieves approximately 100% test coverage overall (all coverage metrics — statements, branches, functions, lines — at or above 90%).
- **SC-011**: All tests pass deterministically in CI (no flaky or environment-dependent tests).

## Assumptions

- The tests are written and executed with the project's established test setup (jsdom environment, React Testing Library conventions, mocked API layer per the testing guidelines).
- "Approximately 100%" is interpreted as all coverage metrics (statements, branches, functions, lines) at or above 90% overall, since 100% on every metric including all branches is not a realistic, useful target for a real application.
- Existing tests are not assumed correct or complete; the specification defines the behavior that must be covered regardless of what tests already exist.
- Test-only helper files (e.g., API mock shims, asset stubs, test setup) are excluded from coverage measurement, as they are not application behavior.
- No source code or production behavior is changed by this feature; only tests are added.
- The app's routing model (public landing, auth-only routes, protected routes, catch-all not-found/redirect) is as implemented in `src/app/app.tsx` and its route guard components.
- Coverage is measured by the project's existing coverage tooling and reported per metric; the current baseline is approximately 87% statements / 77% branches / 88% functions / 89% lines.
