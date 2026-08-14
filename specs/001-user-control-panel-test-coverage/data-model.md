# Data Model: User-Control-Panel Test Coverage

**Date**: 2026-08-14
**Feature**: [spec.md](./spec.md)

## Purpose

This feature adds tests only — **no new production data model is introduced**. This document describes the existing domain entities (from the feature spec's Key Entities) in terms of the behaviors and states tests MUST cover, so the plan and tasks have a concrete reference. It is not a schema; persistence is owned by the API, which tests mock.

## Entities

### User

A person who registers, signs in, and manages their trading configuration.

| Field | Notes | Test-relevant behaviors |
|-------|-------|-------------------------|
| First name / last name | Required in sign-up step 1 | Validation errors when empty/invalid; cannot advance |
| Country | Required in sign-up step 1 | CountrySelect renders and validates |
| Trading experience | Sign-up step 2 | Radio group; optional skip |
| Strategy | Sign-up step 2 | Select |
| Risk tolerance | Sign-up step 2 | Radio group |
| Preferred platforms | Sign-up step 2 | Checkbox group |
| Email | Sign-up step 3; sign-in | Format validation; duplicate-account error (409) |
| Nickname | Sign-up step 3 | Validation |
| Password / confirm | Sign-up step 3; sign-in; restore password | Match validation; strength rules |
| News + ToS consent | Sign-up step 3 | Required checkboxes (ToS refine) |
| Verification status | Email verification step 4 | 6-digit code; verified → redirect to sign-in; unverified sign-in error |

**State transitions tested**: `unregistered → registered (unverified) → verified → authenticated`.

### Session

The authentication state (token + user data) restored from storage on reload.

| Field | Notes | Test-relevant behaviors |
|-------|-------|-------------------------|
| Token | Stored in localStorage (remember me) or sessionStorage | `isAuthenticated = !!token` |
| User data | Stored alongside token | Restored on mount |
| Remember me | Sign-in checkbox | localStorage vs sessionStorage persistence |

**State transitions tested**: `anonymous → authenticated` (login), `authenticated → anonymous` (logout clears storage), storage-event cross-tab sync.

### Rule

An automation a user configures; listed, created, updated, viewed, deleted.

| Field | Notes | Test-relevant behaviors |
|-------|-------|-------------------------|
| Name / description | Rule form | Validation; required rule body |
| Rule body | Structured action tree (UI) or JSON (JSON mode) | UI/JSON toggle; parse/serialize round-trip; "Add to Heap" empty-item validation |
| Page / totalCount | List pagination (limit 20) | Pagination controls; page-beyond-data → NotFound |

**State transitions tested**: `loading → loaded | error | empty`, `create`, `update`, `delete` (with confirmation modal), `view details (found | not found)`.

### Rule Log Entry

A time-stamped event emitted by a rule's execution, streamed live.

| Field | Notes | Test-relevant behaviors |
|-------|-------|-------------------------|
| Level / timestamp / payload | Rendered by LogsPanel | Level colors, expandable JSON payloads |
| Stream state | SSE via EventSource | Live / reconnecting / disconnected indicators; reconnect with max attempts; malformed message ignored |

### Service Settings Rule

A per-service configuration managed through the settings page.

| Field | Notes | Test-relevant behaviors |
|-------|-------|-------------------------|
| Service code | One of 10 service groups | Group expand → fetch by serviceCode |
| Detail fields | Validated by DetailField schema | Required, min/max/exact length, pattern, baseUrl exception, array fields |
| Tags | TagPicker | Search/select existing, create new, keyboard support |
| Pagination | limit 20 + hasMore probe | "Load more" |
| Telegram flow | Special onboarding (stages create → receive → waiting → confirm → success) | Bot token entry, receive chat id, confirm, save |

## Relationships

```text
User 1 ─── * Session (one active session)
User 1 ─── * Rule
Rule 1 ─── * RuleLogEntry (live stream)
User 1 ─── * ServiceSettingsRule (per service code)
ServiceSettingsRule * ─── * Tag
```

## Validation Rules (tested via forms)

- Sign-up step 1: personal fields + country required.
- Sign-up step 2: optional (skip allowed).
- Sign-up step 3: email format, password match, ToS consent required.
- Sign-up step 4: email code must match `/^\d{6}$/`.
- Sign-in: email format + password required (client-side zod validation).
- Restore password: email format (step 1); secret code (step 2); new password + match (step 3).
- Rule form: name, description, rule body required; dirty-check disables Save.
- Settings form: DetailField schema (required, min/max/exact length, pattern, baseUrl exception, arrays).

## Notes

- No migrations, no persistence changes, no new entities. This document exists so `tasks.md` can reference concrete behaviors to cover.
