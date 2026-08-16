# Feature Specification: Rule Setting Description

**Feature Branch**: `fix/TICKET-86cb58wce-Add-description-field-for-Rules-Settings`

**Created**: 2026-08-16

**Status**: Draft

**Input**: User description: "UserRuleSettings.description already exists in the database schema but is not exposed anywhere in the Settings UI. Users need the ability to add, save, and view a free-text description for each rule setting through the existing Create/Update flow."

## Clarifications

### Session 2026-08-16

- Q: When a user clears an existing description and saves, what value should the form send for the description field? → A: Empty string ("").

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add a description when creating a new rule setting (Priority: P1)

A user on the Rules Settings page opens the "Add settings rule" form for any service (e.g. Telegram, Email, Binance), fills in the required fields, optionally enters free text into the Description field, and presses Save. The new setting is created with the description included.

**Why this priority**: This is the primary entry point for capturing a description — without it, users cannot record descriptions for new settings at all.

**Independent Test**: Can be fully tested by creating a new rule setting with a description and verifying the description is stored and shown after reload.

**Acceptance Scenarios**:

1. **Given** a user is on the Rules Settings page and has opened the "Add settings rule" form, **When** they fill in the required fields, enter text in the Description field, and press Save, **Then** the setting is created with the description included.
2. **Given** a user has opened the "Add settings rule" form, **When** they leave the Description field empty and press Save, **Then** the setting is still created successfully with no description.

---

### User Story 2 - Add or edit a description on an existing rule setting (Priority: P1)

A user with an existing rule setting (with or without a description) presses Edit, modifies the Description field, and presses Save. The change is persisted.

**Why this priority**: Editing is how users correct or enrich descriptions after creation; without it, a description could be recorded only at creation time.

**Independent Test**: Can be fully tested by editing an existing setting, changing the description, saving, and verifying the updated description on reload.

**Acceptance Scenarios**:

1. **Given** a user has an existing rule setting without a description, **When** they press Edit, enter a description, and press Save, **Then** the description is persisted and shown on reload.
2. **Given** a user has an existing rule setting with a description, **When** they press Edit, modify the description, and press Save, **Then** the updated description is persisted and shown on reload.
3. **Given** a user has an existing rule setting with a description, **When** they press Edit, clear the description, and press Save, **Then** the description is removed from the stored setting.

---

### User Story 3 - View a rule setting's description (Priority: P2)

A rule setting with a non-empty description shows that description when the setting's card is expanded in view mode. A setting without a description shows no description block at all.

**Why this priority**: Viewing is the consumption side of the feature; it must render stored descriptions correctly and not degrade the existing card layout.

**Independent Test**: Can be fully tested by expanding settings with and without descriptions and verifying the description block renders only when a description exists.

**Acceptance Scenarios**:

1. **Given** a rule setting has a non-empty description in the database, **When** the user expands that setting's card in view mode, **Then** the description text is displayed above the configuration details.
2. **Given** a rule setting has no description (null or empty string), **When** the user expands that setting's card, **Then** no description block is rendered — no empty space or placeholder is shown.

---

### Edge Cases

- What happens when a setting has a description consisting only of whitespace? It should be treated as empty and no description block should render.
- What happens when the user clears an existing description and saves? The form sends an empty string (`""`), the stored value is removed, and the description block disappears on reload.
- What happens when the description contains special characters (line breaks, quotes, emojis)? The text must round-trip and display as entered without corruption.
- What happens when the create/update request fails while saving? The form should behave consistently with the existing save flow for other fields (error surfaced, form remains editable, no data loss).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Create/Edit form MUST include a multi-line text input for description, positioned near the Name/Code fields.
- **FR-002**: The Description field MUST be optional — omitting it MUST NOT block form submission.
- **FR-003**: On Save, the description value MUST be included in the payload sent for both the create and update operations.
- **FR-004**: The setting detail view MUST render the description when present, positioned above the configuration details.
- **FR-005**: The setting detail view MUST NOT render a description block when the description is absent (null or empty string).
- **FR-006**: The description MUST round-trip correctly: the value entered on create/edit MUST match what is displayed after a page reload.
- **FR-007**: Description support MUST apply uniformly across all service-specific Settings groups (Telegram, Email, Binance, Bybit, Kraken, Discord, Slack, SMS/Twilio, OneSignal, WhatsApp, Webhooks), which share the same form and view components.
- **FR-008**: Editing a setting and clearing the description MUST send an empty string (`""`) for the description field, which MUST remove the stored description.
- **FR-009**: Existing settings without a description MUST continue to work unaffected (additive, backward-compatible change).

### Key Entities *(include if feature involves data)*

- **UserRuleSetting**: A rule setting owned by a user for a specific service (Telegram, Email, Binance, etc.). Each setting has a name/code, configuration details, and an optional free-text **description** used to explain the rule's purpose.
- **RuleSettingForm**: The create/edit form for a rule setting; captures the description along with the other required fields.
- **RuleSettingView**: The expanded card view of a rule setting; renders the description above the configuration details when present.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of rule settings created or updated with a description display that exact description after a page reload.
- **SC-002**: 100% of rule settings without a description render no description block (no placeholder, no empty space).
- **SC-003**: Users can complete the add/edit flow with a description without any additional steps beyond entering text in the Description field and pressing Save.
- **SC-004**: Existing rule settings and their configurations remain fully functional and unchanged in appearance when no description is present.

## Assumptions

- The backend already supports the description field end-to-end (create payload, update payload, response, and persistence) — no API or database changes are required.
- The description is plain free text with no rich text or markdown formatting (out of scope).
- No character limit is enforced beyond what the schema/DB already allows (unbounded string).
- The description field is optional for all users; no required-description policy exists.
- All service-specific Settings groups share the same form and view components, so a single implementation covers all services.
- The description is displayed as plain text above the configuration details in the expanded card view, with line breaks preserved as entered.
- Description search and filtering are out of scope.
