# api-validator

This library provides **schema-based validation** for API request DTOs.

It is designed to be a **single source of truth** for validation schemas that are used:

- in `api` to validate incoming request bodies
- in `api-client` to validate outgoing request bodies

Under the hood it uses [`zod`](https://github.com/colinhacks/zod), but the public API is built around the concepts of:

- `SchemaValidator` (a wrapper around a schema)
- `@Validate(...)` (a class decorator attached to DTO)
- `SchemaValidationPipe` (a NestJS pipe that reads the decorator metadata and validates the value)

## Building

Run `nx build api-validator` to build the library.

## Running unit tests

Run `nx test api-validator` to execute the unit tests via [Jest](https://jestjs.io).

## How it is used

### In `api`

1) Enable the global pipe once (usually in `apps/api/src/main.ts`):

```ts
app.useGlobalPipes(
  new SchemaValidationPipe(),
  new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })
);
```

2) Attach a schema validator to a DTO class:

```ts
import { Validate, CreateUserDtoSchemaValidator } from '@trading-bot/api-validator';

@Validate(CreateUserDtoSchemaValidator)
export class CreateUserDto {
  nickname: string;
  email: string;
  // ...
}
```

### In `api-client`

`api-client` should import schemas directly from `@trading-bot/api-validator` so both client and server share the same schemas.

## Where schemas live

Schemas and validators are exported from `@trading-bot/api-validator`.
For example, user-related DTO schemas are located in:

`libs/api-validator/src/lib/schemas/user.ts`
