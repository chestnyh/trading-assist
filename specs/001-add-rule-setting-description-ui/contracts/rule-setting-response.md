# Contract: Rule Setting Response

**Endpoints**: `GET /api/v1/rules-settings` (list, paginated), `POST /api/v1/rules-settings`, `PATCH /api/v1/rules-settings/:id`

**Auth**: `JwtAuthGuard` (Bearer token)

**Source of truth**: `RuleSettingResponseDto` + `RuleSettingResponseDtoSchema`

## Response Shape

```jsonc
{
  "id": 1,                            // number, required
  "name": "My Binance Bot",           // string, required
  "code": "BINANCE_MAIN_01",          // string, required
  "description": "Rule for spot trading", // string, required (may be "" for settings without a description)
  "configuration": { "ApiKey": "..." },   // unknown/JSON, required
  "authorId": 7,                      // number, required
  "serviceCode": "BINANCE",           // enum, optional
  "tags": ["crypto"]                  // string[], optional
}
```

## Change Summary

- **No change.** `description` is already `z.string()` (required, non-null). Prisma stores `String?`; existing settings without a description are returned with `""` (or null-coalesced by the response mapping) and the schema accepts it.
- The UI must treat both `undefined` and `""` (and whitespace-only) as "no description".
