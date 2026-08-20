---

description: "Task list for rule setting description feature implementation"
---

# Tasks: Rule Setting Description

**Input**: Design documents from `specs/001-add-rule-setting-description-ui/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included per the project constitution (Tested Code, NON-NEGOTIABLE) and the plan's constitution check — unit tests for schema, form payload, view rendering, and hook DTO construction.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Nx monorepo** (per plan.md): app code in `apps/user-control-panel/src/features/settings/components/`, shared schema in `libs/api-validator/src/lib/schemas/`
- Tests are co-located next to components: `ComponentName.spec.tsx`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No project scaffolding needed — the Nx monorepo, app, and lib projects already exist. This phase confirms the working baseline.

- [X] T001 Verify `pnpm nx test api-validator` and `pnpm nx test user-control-panel` pass on the current `dev` baseline before any changes

**Checkpoint**: Baseline green — implementation can begin.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The shared contract change and state threading that ALL user stories depend on. Must be complete before any story.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Relax `description` validation from `z.string().min(10).optional()` to `z.string().optional()` in `libs/api-validator/src/lib/schemas/rules-settings.ts` (line 10) — this propagates to `UpdateUserRuleSettingDtoSchema` via `.partial()`, the NestJS DTO decorators, and the client mutator (`libs/api-client/src/lib/mutator.ts` lines 37-38)
- [X] T003 Add `description?: string` to the `SettingItem` type in `apps/user-control-panel/src/features/settings/components/useServiceRuleSettings.ts` (lines 17-26)
- [X] T004 Map `rule.description` into `SettingItem` in `mapRulesToSettings` in `apps/user-control-panel/src/features/settings/components/useServiceRuleSettings.ts` (lines 43-61), normalizing `null`/`undefined` to `""`
- [X] T005 Add `description: ""` to the new-setting initializer in `addNewSetting` in `apps/user-control-panel/src/features/settings/components/useServiceRuleSettings.ts` (line 216)
- [X] T006 [P] Add schema tests in `libs/api-validator/src/lib/schemas/rules-settings.spec.ts`: `description` accepts empty string `""`, accepts strings shorter than 10 chars, accepts multi-line/unicode text, and is optional (omitted passes)
- [X] T007 [P] Add `description` to the create/update DTO construction in `apps/user-control-panel/src/features/settings/components/useServiceRuleSettings.ts` — `saveNewSetting` (lines 120-126) and `saveExistingSetting` (lines 151-156) must include `description: data.description`

**Checkpoint**: Schema accepts free text; `SettingItem` carries `description`; DTOs send it. User stories can now proceed.

---

## Phase 3: User Story 1 - Add a description when creating a new rule setting (Priority: P1) 🎯 MVP

**Goal**: A user can enter free text in a Description field when creating a new rule setting, and it is persisted with the setting.

**Independent Test**: Create a new rule setting with a description via the "Add settings rule" form; verify the create request payload includes the description and the saved card shows it after reload.

### Tests for User Story 1

- [X] T008 [P] [US1] Add `RuleSettingForm.spec.tsx` test: rendering the form with a description input, typing into it, and asserting `onSave` is called with `description` in the payload — in `apps/user-control-panel/src/features/settings/components/RuleSettingForm.spec.tsx`

### Implementation for User Story 1

- [X] T009 [P] [US1] Add `initialDescription?: string` prop and `description` state to `RuleSettingForm` in `apps/user-control-panel/src/features/settings/components/RuleSettingForm.tsx` (state block lines 41-50)
- [X] T010 [P] [US1] Add the multi-line Description input to `RuleSettingForm` in `apps/user-control-panel/src/features/settings/components/RuleSettingForm.tsx`, positioned after Code and before Tags/configuration, styled to match existing form inputs (reuse `apps/user-control-panel/src/shared/ui/forms/TextArea.tsx` or an equivalent `<textarea>` with the form's input styling)
- [X] T011 [P] [US1] Include `description: description.trim()` in the `onSave` payload in `handleSave` in `apps/user-control-panel/src/features/settings/components/RuleSettingForm.tsx` (lines 94-113); keep it optional — empty description must not block submission (FR-002)
- [X] T012 [US1] Thread `description` through `RuleSetting` in `apps/user-control-panel/src/features/settings/components/RuleSetting.tsx`: accept a `description` prop, pass it as `initialDescription` to `RuleSettingForm` in edit mode (lines 63-91), and include it in the `onSave` handler

**Checkpoint**: User Story 1 fully functional — new settings persist their description end-to-end.

---

## Phase 4: User Story 2 - Add or edit a description on an existing rule setting (Priority: P1)

**Goal**: A user can add, modify, or clear the description of an existing rule setting through the Edit flow, and the change persists.

**Independent Test**: Edit an existing setting, modify/clear the description, save; verify the update request sends the new value (or `""` when cleared) and the stored value changes after reload.

### Tests for User Story 2

- [X] T013 [P] [US2] Add `useServiceRuleSettings.spec.ts` test: `saveExistingSetting` builds an `UpdateUserRuleSettingDto` including `description`; clearing sends `description: ""`; `mapRulesToSettings` surfaces `rule.description` — in `apps/user-control-panel/src/features/settings/components/useServiceRuleSettings.spec.ts` (mock `@trading-bot/api-client` with the partial-spread pattern and mock `useAuth`)

### Implementation for User Story 2

- [X] T014 [P] [US2] Pass `description={setting.description}` from `SimpleServiceSettingsGroup` to `RuleSetting` in `apps/user-control-panel/src/features/settings/components/service-groups/SimpleServiceSettingsGroup.tsx` (line 77-91)
- [X] T015 [P] [US2] Pass `description={setting.description}` from `TelegramRuleSetting` to `RuleSetting` in `apps/user-control-panel/src/features/settings/components/TelegramRuleSetting.tsx` (line 236-252); do not touch the chatId PATCH (it sends only `configuration`)
- [X] T016 [US2] Confirm `saveExistingSetting` (via T007) sends the trimmed description and `""` on clear; verify the edit-save flow works end-to-end through `RuleSetting` → `RuleSettingForm` → `saveSetting`

**Checkpoint**: User Stories 1 AND 2 both work — description can be created, edited, and cleared.

---

## Phase 5: User Story 3 - View a rule setting's description (Priority: P2)

**Goal**: A rule setting with a non-empty description shows it above the configuration details in the expanded card; a setting without one shows no block.

**Independent Test**: Expand settings with and without descriptions; verify the description renders above the configuration details only when non-empty (whitespace-only treated as empty).

### Tests for User Story 3

- [X] T017 [P] [US3] Add `RuleSettingView.spec.tsx` tests: renders the description text above the configuration details when provided; renders no description block for `undefined`, `""`, and whitespace-only values — in `apps/user-control-panel/src/features/settings/components/RuleSettingView.spec.tsx`

### Implementation for User Story 3

- [X] T018 [P] [US3] Add a `description` prop to `RuleSettingView` in `apps/user-control-panel/src/features/settings/components/RuleSettingView.tsx`
- [X] T019 [US3] Render the description block in `RuleSettingView` in `apps/user-control-panel/src/features/settings/components/RuleSettingView.tsx`: inside the expanded body (lines 140-154), above the configuration details, conditionally rendered only when `description.trim().length > 0` (FR-004, FR-005); preserve line breaks with `whitespace-pre-line`

**Checkpoint**: All user stories now independently functional — view mode shows descriptions exactly as stored.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T020 [P] Run `pnpm nx test api-validator` and `pnpm nx test user-control-panel` and fix any failures (respect 70% global coverage thresholds in `apps/user-control-panel/jest.config.ts`)
- [X] T021 [P] Run `pnpm nx lint user-control-panel` and `pnpm nx lint api-validator` and fix any violations
- [X] T022 Run the quickstart.md validation scenarios (5 scenarios + curl smoke tests) against a running API/SPA and record results
- [X] T023 Confirm no regression for existing settings without a description (FR-009) — settings created before this feature render unchanged

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — depends on T009-T012 (form input + payload + threading)
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — depends on T007 (DTO `description`); uses the form created in US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) — depends on T003/T004 (`SettingItem.description`)

### Within Each User Story

- Tests MUST be written and FAIL before implementation (T008 before T009-T012; T013 before T014-T016; T017 before T018-T019)
- Schema → state threading → form/UI → view rendering
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- T006, T007 (Phase 2) run in parallel (different files)
- T008-T011 (US1) run in parallel after T003/T004
- T013-T015 (US2) run in parallel after T007
- T017, T018 (US3) run in parallel
- T020, T021 (Polish) run in parallel
- Different user stories can be worked on in parallel by different team members once Phase 2 completes

---

## Parallel Example: User Story 1

```bash
# Launch all US1 tasks together (after Phase 2):
Task: "Add RuleSettingForm.spec.tsx test asserting description in onSave payload"
Task: "Add initialDescription prop + description state to RuleSettingForm.tsx"
Task: "Add multi-line Description input to RuleSettingForm.tsx"
Task: "Include description.trim() in onSave payload in RuleSettingForm.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (create-with-description)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- The shared schema change (T002) touches `libs/api-validator` — run its tests (T006) before UI stories to keep the contract green
