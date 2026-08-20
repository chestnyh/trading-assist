# Implementation Plan: Rule Setting Description

**Branch**: `fix/TICKET-86cb58wce-Add-description-field-for-Rules-Settings` | **Date**: 2026-08-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-add-rule-setting-description-ui/spec.md`

**Note**: This template is filled in by the `$speckit-plan` command; its definition describes the execution workflow.

## Summary

The backend already persists `description` on rule settings end-to-end (DTO → zod → service → Prisma → response → client types → OpenAPI), but the user-control-panel never sends or displays it. This feature threads `description` through the settings UI: a multi-line input in the create/edit form, inclusion in the create/update payloads, and rendering in the expanded card view when present (hidden when absent). One shared-library contract change is required: the zod schema currently requires `min(10)` when description is present, which rejects empty strings (the clarified clear behavior) and short free-text — it must be relaxed to `z.string().optional()`.

## Technical Context

**Language/Version**: TypeScript (Nx monorepo); React 18 + Tailwind CSS for the user-control-panel app; NestJS for the API.

**Primary Dependencies**: `@trading-bot/api-client` (orval-generated client + zod-validating fetch mutator), `@trading-bot/api-validator` (shared zod schemas), `lucide-react` (icons). No form library — the settings form uses plain React `useState` with a hand-rolled `useMemo`-computed error object.

**Storage**: PostgreSQL via Prisma (`UserRuleSettings.description String?` — already present, nullable). No migration required.

**Testing**: Jest 29 + React Testing Library (`userEvent`, never `fireEvent`). Per-app config `apps/user-control-panel/jest.config.ts` (jsdom, 70% global coverage thresholds). API layer is mocked via `jest.mock('@trading-bot/api-client')` (partial-spread pattern from `SignUp.spec.tsx`).

**Target Platform**: Web (user-control-panel SPA).

**Project Type**: Web application (React frontend + NestJS API in an Nx monorepo).

**Performance Goals**: N/A for this feature — no measurable performance impact (static form field + read-only text render).

**Constraints**: Shared zod schema must accept empty string and arbitrary-length text (spec clarification + backend contract). No database migration. Backward compatible — existing settings without a description continue to work.

**Scale/Scope**: 11 service groups (Telegram, Email, Binance, Bybit, Kraken, Discord, Slack, SMS/Twilio, OneSignal, WhatsApp, Webhooks) sharing the same form/view components.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Justification |
|------|--------|---------------|
| Clean Code | ✅ PASS | No new abstractions; change follows existing component patterns exactly |
| Simple UI/UX | ✅ PASS | One optional free-text field; progressive disclosure respected (description hidden when absent) |
| Microservice Architecture | ✅ PASS | No cross-service coupling; contract change stays within the shared api-validator library consumed by both app and API |
| Shared Libraries as Separate Projects | ✅ PASS | The one shared change (zod schema) lives in the existing `api-validator` library project, not inlined in the app |
| Tested Code (NON-NEGOTIABLE) | ✅ PASS | New unit tests for form payload, view rendering, hook DTO construction, and schema behavior; existing 70% coverage thresholds respected |

**Post-design re-check (after Phase 1)**: ✅ All gates still pass. Design artifacts confirm: no new projects or services introduced, single shared-schema change in `api-validator` (required for the clarified empty-string contract, not a convenience), form/view changes confined to the existing settings feature, and test plan covers the previously untested settings components. No Complexity Tracking entries required.

**Complexity Tracking**: No violations — the single shared-library change is required to make the clarified empty-string behavior valid, not a convenience.

## Project Structure

### Documentation (this feature)

```text
specs/001-add-rule-setting-description-ui/
├── plan.md              # This file ($speckit-plan command output)
├── research.md          # Phase 0 output ($speckit-plan command)
├── data-model.md        # Phase 1 output ($speckit-plan command)
├── quickstart.md        # Phase 1 output ($speckit-plan command)
├── contracts/           # Phase 1 output ($speckit-plan command)
└── tasks.md             # Phase 2 output ($speckit-tasks command - NOT created by $speckit-plan)
```

### Source Code (repository root)

```text
apps/user-control-panel/src/features/settings/components/
├── RuleSettingForm.tsx            # + description input (TextArea), state, payload
├── RuleSettingView.tsx            # + description prop + conditional render
├── RuleSetting.tsx                # + description prop, threads to Form/View
├── useServiceRuleSettings.ts      # + description on SettingItem, mapping, DTOs
├── TelegramRuleSetting.tsx        # + pass setting.description through to RuleSetting
├── service-groups/SimpleServiceSettingsGroup.tsx  # + pass s.description to RuleSetting
└── *.spec.tsx                     # new tests (RuleSettingForm, RuleSettingView, useServiceRuleSettings)

libs/api-validator/src/lib/schemas/rules-settings.ts  # description: z.string().optional()
libs/api-validator/src/lib/schemas/rules-settings.spec.ts  # + new schema tests
```

**Structure Decision**: Follows the existing Nx project layout — all changes live in the existing `user-control-panel` app (settings feature) plus the single shared schema in the `api-validator` lib. No new projects, no new directories. Tests are co-located next to components per repo conventions.
