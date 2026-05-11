# Libraries

This folder contains shared libraries that are used — or intended to be used — across multiple services in the monorepo. Each library has a single responsibility and is published under the `@trading-bot` npm scope.

## Libraries Overview

### [api-client](./api-client)

Auto-generated typed HTTP client produced from the OpenAPI spec of the `api` service. Do not edit it manually — regenerate it when the API spec changes.

[Detailed documentation](./api-client/README.md) 

Import path - `@trading-bot/api-client`

---

### [configs](./configs)

The entry point for everything configuration-related in the project. Any service or script that needs to read configuration should use this library. Loads environment-specific configuration automatically based on `NODE_ENV` and provides concrete subclasses for different use cases: long-running services, standalone scripts, and devops/infrastructure tooling.

[Detailed documentation](./configs/README.md)

Import path - `@trading-bot/configs`

---

### [crypto-utils](./crypto-utils)

Password hashing and verification utilities.

[Detailed documentation](./crypto-utils/README.md)

Import path - `@trading-bot/crypto-utils`

---

### [models](./models)

Shared database client used across services. Connects using individual parameters and includes a module for dependency injection. Has migrations and seed script.

[Detailed documentation](./models/README.md)

Import path - `@trading-bot/models`

---

### [object-navigator](./object-navigator)

Utility for reading from and writing to deeply nested object structures using path-based keys.

[Detailed documentation](./object-navigator/README.md)

Import path - `@trading-bot/object-navigator`

---

### [service-comm](./service-comm)

Publish/subscribe library for inter-service communication with a transport-agnostic core API. A framework integration wrapper is provided for dependency injection usage.

[Detailed documentation](./service-comm/README.md)

Import path - `@trading-bot/service-comm`

---

## Adding a new library

New libraries should be generated with Nx:

```bash
pnpm nx generate @nx/js:library --name=<library-name> --directory=libs/<library-name>
```

Follow the same conventions:
- Export public API through `src/index.ts`
- Use the `@trading-bot/<library-name>` package name in `package.json`
- Keep each library focused on a single concern
- Update this README with a short description
