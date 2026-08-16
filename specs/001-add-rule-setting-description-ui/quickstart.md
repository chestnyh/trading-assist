# Quickstart: Rule Setting Description

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Date**: 2026-08-16

This is a validation/run guide proving the feature works end-to-end. Implementation details live in `tasks.md` (generated next). Contracts: [contracts/](./contracts/). Data model: [data-model.md](./data-model.md).

## Prerequisites

- Running API (NestJS) with PostgreSQL (Prisma) — `description` column already exists, no migration.
- Running user-control-panel SPA.
- Authenticated user (JWT bearer).

## Validation Scenarios

### Scenario 1 — Create a setting with a description

1. Open the Rules Settings page (`Settings.tsx`).
2. Expand any service group (e.g. Email).
3. Click **Add settings rule**.
4. Fill required fields (Name, Code, and service configuration), enter text into the **Description** field.
5. Press **Save**.

**Expected**: Setting is created; the API returns `201`; the description appears above the configuration details when the card is expanded.

### Scenario 2 — Create a setting without a description

1. Same flow, but leave the Description field empty.
2. Press **Save**.

**Expected**: Creation succeeds (`201`); no description block renders on the expanded card — no empty space or placeholder.

### Scenario 3 — Edit an existing description

1. Expand a setting that has a description.
2. Press the edit (pencil) button.
3. Modify the Description field and press **Save**.

**Expected**: Update succeeds (`200`); the new description displays after reload.

### Scenario 4 — Clear an existing description

1. Edit a setting that has a description.
2. Clear the Description field and press **Save**.

**Expected**: The PATCH payload sends `description: ""`; the stored description is removed; no description block renders after reload.

### Scenario 5 — Round-trip

1. Create a setting with a distinctive description (multi-line, special characters).
2. Reload the page and expand the group.

**Expected**: The description renders exactly as entered (line breaks preserved), matching the value returned by the API.

## Automated Checks

```bash
# Schema unit tests (description accepts empty/any length)
pnpm nx test api-validator

# User-control-panel component + hook tests
pnpm nx test user-control-panel
```

Coverage thresholds: 70% global (`apps/user-control-panel/jest.config.ts`).

## Manual API Smoke Test

```bash
# Create with description
curl -X POST "$API_BASE_URL/api/v1/rules-settings" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Smoke Bot","code":"SMOKE_01","description":"short","serviceCode":"EMAIL","configuration":{}}'

# Update — clear the description (empty string)
curl -X PATCH "$API_BASE_URL/api/v1/rules-settings/1" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"description":""}'
```

**Expected**: Both succeed (no 400 validation error) — verifying the relaxed schema accepts short/empty descriptions.
