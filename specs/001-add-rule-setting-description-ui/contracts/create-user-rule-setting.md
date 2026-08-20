# Contract: Create Rule Setting

**Endpoint**: `POST /api/v1/rules-settings`

**Auth**: `JwtAuthGuard` (Bearer token)

**Source of truth**: `CreateUserRuleSettingDto` + `CreateUserRuleSettingDtoSchema` (`libs/api-validator/src/lib/schemas/rules-settings.ts`)

## Request Body

```jsonc
{
  "name": "My Binance Bot",          // string, required, min 3
  "code": "BINANCE_MAIN_01",         // string, required, min 1
  "description": "Rule for spot trading",  // string, OPTIONAL — accepts any text incl. empty; CHANGED from min(10)
  "serviceCode": "BINANCE",          // enum, required
  "tags": ["crypto", "binance"],     // string[], optional
  "configuration": { "ApiKey": "..." }  // record<string, unknown>, required
}
```

## Success Response — `201 Created`

```jsonc
{
  "id": 1,
  "name": "My Binance Bot",
  "code": "BINANCE_MAIN_01",
  "description": "Rule for spot trading",   // string (may be "")
  "configuration": { "ApiKey": "..." },
  "authorId": 7,
  "serviceCode": "BINANCE",
  "tags": ["crypto", "binance"]
}
```

## Error Responses

| Status | Meaning |
|--------|---------|
| `400` | Zod validation failure (e.g. name < 3 chars) |
| `401` | Missing/invalid token |

## Change Summary

- `description`: `z.string().min(10).optional()` → `z.string().optional()` (accepts empty string and any length).
- No other contract fields change.
