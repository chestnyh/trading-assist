# Contracts: User-Control-Panel Test Coverage

**Date**: 2026-08-14
**Feature**: [spec.md](../spec.md)

## Purpose

This feature adds tests only — **no new external interfaces are introduced**. The contracts documented here are the app's existing behavioral contracts (routing/authorization model and user-facing flows) that the new tests MUST verify. They serve as the reference for test scenarios in `tasks.md` and the validation scenarios in [quickstart.md](../quickstart.md).

## Contract 1: Routing & Authorization Model

Implemented in `src/app/app.tsx` with route guards (`AuthRoute`, `ProtectedRoute`, `RedirectToSignIn`).

| Path | Access | Behavior |
|------|--------|----------|
| `/`, `/main` | Public | Main landing page renders |
| `/sign-in` | Auth-only | Signed-in users → redirected to `/dashboard`; anonymous users see sign-in form |
| `/sign-up` | Auth-only | Signed-in users → redirected; anonymous users see 4-step sign-up wizard |
| `/restore-password` | Auth-only | Anonymous users see 3-step password reset |
| `/dashboard` | Protected | Anonymous → redirected to `/sign-in` (with `state.from`); authenticated users see Dashboard |
| `/rules`, `/rules/add`, `/rules/:id`, `/rules/:id/update` | Protected | Rules list / add / details / update |
| `/settings` | Protected | Settings page |
| `*` (unknown) | Varies | Authenticated → NotFound page; anonymous → redirected to `/sign-in` |

**Test contract**: Every path in the table MUST be verified for both authenticated and anonymous users.

## Contract 2: Authentication Flows

### Sign-in (`/sign-in`)

- Client-side validation: email format + password required (zod).
- "Remember me" → token in localStorage; otherwise sessionStorage.
- Success → navigate to `/dashboard`.
- Failure paths: invalid credentials (401), unverified email (400), network error, server error (5xx) — each shows a user-friendly error; user stays on page.
- "Forgot password?" → `/restore-password`; "Create account" → `/sign-up`.
- Logout (via user menu) → clears storage → `/sign-in`.

### Sign-up (`/sign-up`)

4-step wizard in `AuthLayout` with `FormProgressBar`:
- Step 1: first name, last name, country (required; validation blocks advance).
- Step 2: trading experience, strategy, risk tolerance, platforms (optional; can skip / go back).
- Step 3: email, nickname, password + confirm, news/ToS checkboxes; submit → create-user API; error paths (409 duplicate, network, 500); on success stores `emailVerificationToken`, advances to step 4.
- Step 4: 6-digit code (`/^\d{6}$/`); verify API; success screen → auto-redirect to `/sign-in` after ~2s; missing-token handling.
- Context persists steps 1–2 + verification token + current step in localStorage; reload clamps to a valid step.

### Restore password (`/restore-password`)

3-step flow:
- Step 1: enter email → forgot-password API → advance; network/validation errors handled.
- Step 2: enter secret code → verify API; back button; 429 (max attempts) → "Request New Code" (resets state); 401 (session expired); missing token.
- Step 3: new password + confirm → reset-password API → clear token → navigate to `/sign-in`; mismatch/validation errors handled.

## Contract 3: Rules Management (`/rules*`)

- List: loading → Spinner; error → ErrorAlert + Retry; empty → EmptyState with "add a rule"; populated → RuleItem rows (edit → `/rules/:id/update`, delete → ConfirmationModal); pagination when totalCount > 20; page beyond data → NotFound.
- Add (`/rules/add`): RuleForm; save → addRule → `/rules`.
- Update (`/rules/:id/update`): prefill by id; save → updateRule → `/rules`; missing → NotFound.
- Details (`/rules/:id`): back link, name/description, structured action tree (read-only), JSON view, live execution logs (SSE via `useRuleLogs`: no-token guard, connect, receive entries, malformed-message ignore, reconnect 3s / max 10 attempts, cleanup on unmount).

## Contract 4: Settings (`/settings`)

- Page lists 10 collapsible service groups: Telegram, Email, Discord, Slack, SMS Twilio, OneSignal, WhatsApp Business, Binance, Bybit, Kraken.
- Generic groups (via `SimpleServiceSettingsGroup`): lazy-load on expand (loading/error states), RuleSetting cards, add/edit/delete, "Load more" pagination (limit 20 + hasMore probe).
- Telegram group (via `TelegramSettingsGroup` + `TelegramRuleSetting`): onboarding stages create → receive → waiting → confirm → success; bot-token entry → receive chat id → instructions → confirm/edit → save.
- RuleSetting edit form: DetailField validation; TagPicker (search/select/create tags, keyboard support, debounce 250ms).
- Hook `useServiceRuleSettings`: per-service CRUD, optimistic local state (`isNew`/`isEditing`), UUID client ids.

## Contract 5: Shared UI Behaviors

- **Header**: unauthenticated → AuthButton ("Sign In"); authenticated → UserMenuButton (avatar dropdown, logout).
- **Sidebar**: nav to Dashboard/Rules/Settings, collapse/expand (w-72 ↔ w-20), active route, Management collapse group.
- **Footer**: Privacy/Terms links, copyright.
- **ConfirmationModal**: portal, Escape-to-close, overlay close, body scroll lock, loading state on confirm.
- **ThemeToggle**: light/dark via localStorage + `data-theme`.
- **TypewriterText / FloatingBlobs**: decorative; render correctly.
- **Forms**: Input (password visibility toggle, disabled, errors), Select, TextArea, Radio, Checkbox, CheckboxGroup, CountrySelect, FieldLabel.
- **JsonEditorField**: wraps jsoneditor; modes tree/code/view; resize handle; error styling; onChange via editor instance.
- **Button**: variants (primary/outline/error/text), icons, disabled, loading.
- **UserAvatar**: initials, fallback, src.
- **Alert / ErrorAlert / Spinner**: render with content.

## Contract 6: Contexts (Auth, Rules, SignUp)

- **AuthContext**: session restore from localStorage/sessionStorage; login (rememberMe persistence); logout clears; `isAuthenticated` derivation; cross-tab storage sync; signUp via users API.
- **RulesContext**: auto-fetch page 1 on mount; fetchRules(page); getRuleById; addRule/updateRule/deleteRule (token-gated); rules/totalCount/currentPage/selectedRule.
- **SignUpContext**: reducer-driven per-step state; per-step validateAndGetResult; registerUser storing emailVerificationToken; localStorage persistence + migration from old 1–4 step format + step-validity clamping.

## Notes

- These contracts are derived from the current implementation (`src/app/app.tsx`, feature directories, contexts) and the feature spec's user stories. They define what tests must verify; they are not new API specifications.
- The API-layer contract is mocked in tests per the testing guidelines (mock `@trading-bot/api-client` / `@trading-bot/api-validator`, not fetch).
