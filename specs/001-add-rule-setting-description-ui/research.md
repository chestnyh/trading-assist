# Research: Rule Setting Description

**Feature**: [spec.md](./spec.md) | **Date**: 2026-08-16

## Resolved Unknowns

### R1: Does the backend already support `description` end-to-end?

**Decision**: Yes — no API or database changes needed (except the shared zod schema, see R2).

**Rationale**: Verified across every layer:

| Layer | File | State |
|-------|------|-------|
| Nest DTO (create) | `apps/api/src/api/rules-settings/dto/create-user-rule-setting.dto.ts:13-14` | `description?: string`, optional |
| Nest DTO (update) | `.../dto/update-user-rule-setting.dto.ts:7` | inherited via `PartialType` |
| Nest DTO (response) | `.../dto/rule-setting-response.dto.ts:14-15` | `description: string` (required) |
| Service persist | `rules-settings.service.ts:22` (create), `:88-107` (update) | written to Prisma; `mapToResponse` spreads it |
| Prisma | `libs/models/prisma/schema.prisma:87` | `description String?` (nullable) |
| API client types | `libs/api-client/src/lib/api-client.ts:274,286,298` | create `?`, response required, update `?` |
| OpenAPI | `libs/api-client/openapi.json:1341,1394,1452` | optional on create/update, required on response |

**Alternatives considered**: None — the field provably already flows through; only the UI layer drops it.

### R2: Does the existing zod validation accept empty string and arbitrary length?

**Decision**: No — a shared-library contract change is required. `description` must be relaxed from `z.string().min(10).optional()` to `z.string().optional()`.

**Rationale**: The shared schema at `libs/api-validator/src/lib/schemas/rules-settings.ts:10` is applied in three places: the NestJS DTO decorators, the client-side fetch mutator (`libs/api-client/src/lib/mutator.ts:37-38` validates the request body before sending), and `UpdateUserRuleSettingDtoSchema = CreateUserRuleSettingDtoSchema.partial()`. With the clarified empty-string-on-clear behavior (spec FR-008) and the "free-text, unbounded" requirement, `min(10)` rejects valid input at the client before it ever reaches the server. No UI sends `description` today, so the min-10 rule is currently dead code with no backward-compat cost to relax.

**Alternatives considered**:
- Keep `min(10)` + `or(z.literal(""))` and enforce a 10-char minimum in the form — rejected: contradicts the free-text spec framing and adds UI validation burden.
- Omit the field on clear — rejected: the server treats missing update fields as "no change", so clearing would silently not work (breaks FR-008).

### R3: How does the settings UI thread data today, and where does description fit?

**Decision**: `description` threads through `SettingItem` → `RuleSetting` → `RuleSettingForm` / `RuleSettingView`, mirroring how `name`/`code`/`tags` flow today.

**Rationale**: `useServiceRuleSettings` owns the `SettingItem` shape (line 17-26) and maps API responses in `mapRulesToSettings` (line 43-61). The form payload shape `{ name, code, tags, details }` (RuleSettingForm `onSave`, line 105-112) is built by `RuleSetting` in edit mode and consumed by `saveSetting` → `saveNewSetting`/`saveExistingSetting`, which build the DTOs (lines 120-126, 151-156). `SimpleServiceSettingsGroup` renders `RuleSetting` per item (line 77-91); `TelegramRuleSetting` renders `RuleSetting` with `setting.*` props (line 236-252). All these need `description` added.

**Alternatives considered**: None — adding a parallel optional field to the existing flow is the minimal, consistent change.

### R4: Is there a reusable multi-line input component?

**Decision**: Yes — `apps/user-control-panel/src/shared/ui/forms/TextArea.tsx` exists and is used by `RuleForm.tsx` and `ActionEditor.tsx`.

**Rationale**: Reusing the shared component follows the "Shared Libraries as Separate Projects" constitution principle. Caveat: its styling tokens differ from the settings form's raw inputs (`border-2 border-accent`, `text-body-md`, `FieldLabel` vs `border border-border`, `text-primary`, custom labels). Two acceptable options: (a) reuse `TextArea` as-is for visual consistency with other forms, or (b) render a raw `<textarea>` styled to match the existing settings form inputs. Either satisfies FR-001 (multi-line text input).

**Alternatives considered**: Raw `<textarea>` matching current form styling.

### R5: What are the test conventions?

**Decision**: Jest 29 + React Testing Library, `userEvent` only, co-located `ComponentName.spec.tsx` files; mock `@trading-bot/api-client` with the partial-spread pattern; mock `useAuth` from `AuthContext`.

**Rationale**: `apps/user-control-panel/jest.config.ts` uses jsdom, setupTests, and 70% global coverage thresholds. The settings feature currently has zero tests; existing form tests (SignIn.spec.tsx) demonstrate the pattern. Testing guidelines (`apps/user-control-panel/_docs/testing-guidelines.md`) mandate mocking the API layer, not fetch, and `userEvent` over `fireEvent`. `RuleSettingForm` calls `useAuth()` for the `TagPicker` token, so tests must mock `AuthContext`.

**Alternatives considered**: MSW — not installed; guidelines explicitly prefer module mocks.

### R6: Does the Telegram chatId flow interfere with description?

**Decision**: No — Telegram's onboarding updates only `configuration` (lines 178-184) and never touches description, so no description handling is needed in that path.

**Rationale**: `TelegramRuleSetting.tsx` builds `UpdateUserRuleSettingDto = { configuration }` only. The `RuleSetting` it renders receives `setting.description` for display/edit; the chatId-specific PATCH is orthogonal.

**Alternatives considered**: None.

### R7: Where does the description render in the view?

**Decision**: In the expanded card body, above the configuration details (spec FR-004), rendered only when non-empty (FR-005).

**Rationale**: The spec positions it "above the configuration details". `RuleSettingView` already has an expanded body block (`details.map(...)` rows); description becomes a leading block inside that expanded area, conditionally rendered on a non-empty value. The existing `topSlot` (Telegram progress bar) is unrelated and stays where it is.

**Alternatives considered**: Header area (between `topSlot` and the header row) — rejected: spec says "above the configuration details", i.e. inside the expanded body.

### R8: How are empty/whitespace descriptions treated?

**Decision**: A description is "present" only if non-empty after trimming. Empty or whitespace-only values render no block and are persisted as `""` on clear.

**Rationale**: Spec edge cases (whitespace-only treated as empty) + clarified clear behavior (send `""`). The form trims on save like other fields; the view checks `description.trim().length > 0`.

**Alternatives considered**: Preserve raw whitespace — rejected, spec edge case explicitly says whitespace-only = empty.
