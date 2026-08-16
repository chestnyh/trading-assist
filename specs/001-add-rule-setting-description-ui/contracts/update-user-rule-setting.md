# Contract: Update Rule Setting

**Endpoint**: `PATCH /api/v1/rules-settings/:id`

**Auth**: `JwtAuthGuard` (Bearer token)

**Source of truth**: `UpdateUserRuleSettingDto` + `UpdateUserRuleSettingDtoSchema` (`CreateUserRuleSettingDtoSchema.partial()` in `libs/api-validator/src/lib/schemas/rules-settings.ts`)

## Request Body

All fields optional (partial update). Sending `description: ""` explicitly **clears** the stored description.

```jsonc
{
  "name": "My Binance Bot",          // string, optional, min 3 if present
  "code": "BINANCE_MAIN_01",         // string, optional, min 1 if present
  "description": "",                 // string, OPTIONAL — accepts any text incl. empty (CHANGED); "" clears
  "tags": ["crypto"],                // string[], optional
  "configuration": { "ApiKey": "..." }  // record<string, unknown>, optional
}
```

## Success Response — `200 OK`

```jsonc
{
  "id": 1,
  "name": "My Binance Bot",
  "code": "BINANCE_MAIN_01",
  "description": "",                 // string (may be "")
  "configuration": { "ApiKey": "..." },
  "authorId": 7,
  "serviceCode": "BINANCE",
  "tags": ["crypto"]
}
```

## Error Responses

| Status | Meaning |
|--------|---------|
| `400` | Zod validation failure |
| `401` | Missing/invalid token |
| `404` | Setting not found or not owned by user |

## Change Summary

- `description`: inherits the create schema change (`min(10)` removed) via `.partial()`.
- Semantics: omitting `description` = no change; `description: ""` = clear to empty.
