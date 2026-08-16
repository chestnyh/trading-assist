# Data Model: Rule Setting Description

**Feature**: [spec.md](./spec.md) | **Date**: 2026-08-16

## Entities

### UserRuleSetting (existing, unchanged persistence)

Represents a rule setting owned by a user for a specific service. The `description` attribute already exists in the database; this feature only exposes it in the UI.

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | integer | PK, autoincrement | |
| `name` | string | required, min 3 | |
| `code` | string | required, min 1, unique per `[authorId, code]` | |
| `description` | string | **optional, nullable** | The feature's focus; free text, no length cap |
| `serviceCode` | enum | required | Telegram, Email, Binance, Bybit, Kraken, Discord, Slack, SMS/Twilio, OneSignal, WhatsApp, Webhooks |
| `configuration` | JSON | required, defaults `{}` | Service-specific key/value config |
| `tags` | relation | optional | Many-to-many via `RuleSettingsToRuleSettingsTags` |
| `authorId` | integer | required | Owner relation |

**State transitions**: None new. A setting's description transitions only via create (set) and update (set/modify/clear). No lifecycle states exist for the description itself.

## Validation Rules

| Rule | Source |
|------|--------|
| Description is optional — omitting it never blocks submission | FR-002 |
| Description accepts any text, including empty string `""` and any length | Spec clarification + relaxed schema |
| Description consisting only of whitespace is treated as absent for rendering | Spec edge case |
| Clearing the description on edit sends `""` and removes the stored value | FR-008 + clarification |
| A present description must survive a round-trip unchanged (reload from API) | FR-006 |

## Data Flow (UI Layer)

```
API RuleSettingResponseDto
  └─ mapRulesToSettings()          → SettingItem.description (new field)
       └─ RuleSetting.description  → RuleSettingView (view mode: render when non-empty)
                                    └─ RuleSettingForm (edit mode: initialDescription)

RuleSettingForm onSave { ..., description }
  └─ saveSetting() → saveNewSetting()/saveExistingSetting()
       └─ CreateUserRuleSettingDto { ..., description }   (create)
       └─ UpdateUserRuleSettingDto { ..., description }   (update)
            └─ mutator zod validation (relaxed schema) → API → Prisma
```

## Affected Data Types

### `SettingItem` (new field — `apps/user-control-panel/src/features/settings/components/useServiceRuleSettings.ts`)

```ts
export type SettingItem = {
  clientId: string;
  id?: number;
  name: string;
  code: string;
  tags: string[];
  description?: string;              // NEW
  details: { label: string; value: string }[];
  isNew?: boolean;
  isEditing?: boolean;
};
```

### Form save payload (new field — `RuleSettingForm`)

```ts
{
  name: string;
  code: string;
  tags: string[];
  description?: string;              // NEW
  details: { label: string; value: string }[];
}
```

### Shared zod schema (changed — `libs/api-validator/src/lib/schemas/rules-settings.ts`)

```ts
// Before:
description: z.string().min(10).optional(),
// After:
description: z.string().optional(),
```

This single change propagates to `UpdateUserRuleSettingDtoSchema` (via `.partial()`), the NestJS DTO validators, and the client mutator. `RuleSettingResponseDtoSchema` already requires `z.string()` (matches the non-nullable Prisma `String?` being returned as `string`); it needs no change.

## Contracts / Interfaces

See [contracts/](./contracts/) for the create/update/response wire contracts.
