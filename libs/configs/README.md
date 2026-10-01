# Trading Bot Configs Library

The single place where the apps and tools of the trading-assist monorepo get their configuration.

It loads raw values from a configuration source (an env file or `process.env`), applies defaults, and exposes them through typed getters. Each kind of consumer has its own config set:

- `ServicesConfigs`: backend services such as the API and auto-trader. NestJS apps get it through `ServicesConfigsModule`.
- `DevopsConfigs`: deployment and database migration tooling.
- `ScriptConfigs`: local development scripts.

## Features

- **Separate config sets**: services, DevOps tooling and scripts each get only the keys they need.
- **Pluggable sources**: values come from a dotenv file or `process.env`; a new source is one `ConfigSource` implementation.
- **Per-environment loading**: `ServicesConfigs` picks its source from `NODE_ENV` (`.env.dev`, `.env.api-int-tests`, or `process.env` in production).
- **Defaults**: missing values fall back to defaults defined in the config set.
- **Typed getters**: `getNumber` and `getBoolean` parse values; `required.*` getters throw on missing or invalid values instead of returning `undefined`.
- **NestJS integration**: `ServicesConfigsModule` is global and injects a fully loaded `ServicesConfigs` anywhere.

## How it works

### Loading flow

Every config set extends the abstract `Configs` class and is loaded with `setUp()`:

```typescript
const configs = await new ServicesConfigs().setUp();
```

1. **Pick a source.** The constructor calls `setUpConfigSource()`, which returns a `ConfigSource`.
2. **Load raw values.** `setUp()` calls the source's `load()`. The result is kept as the *initial* config (`getAllInitial()`).
3. **Build the final config.** `setUpConfigsFromInit()` picks the keys the set needs, renames or derives values, and applies defaults. Getters only read from this final config (`getAll()`).

Values are not available until `setUp()` has resolved. In NestJS apps, `ServicesConfigsModule` takes care of this (see [Usage](#usage)).

### Config sources

`ConfigSource` is the abstraction over where values come from, so each config set can choose its source independently:

| Source | Reads from | Used by |
|---|---|---|
| `EnvFileConfigSource` | A dotenv file in the workspace root (`${VAR}` references are expanded) | `ServicesConfigs` outside production, `DevopsConfigs`, `ScriptConfigs` |
| `ProcessEnvConfigSource` | `process.env` as is | `ServicesConfigs` in production |

`ServicesConfigs` picks its source from `NODE_ENV`:

| `NODE_ENV` | Source |
|---|---|
| `production` | `process.env` |
| `api-int-tests` | `.env.api-int-tests` |
| anything else | `.env.dev` |

The workspace root is found by walking up from the library until a directory with `pnpm-workspace.yaml` is found.

`dotenv` and `dotenv-expand` are dev dependencies loaded lazily, so production (which only uses `process.env`) never needs them.

### Reading values

All values are stored as strings. Getters return `undefined` when a value is missing or can't be parsed:

```typescript
configs.get('API_BASE_URL');      // string | undefined
configs.getNumber('API_PORT');    // number | undefined
configs.getBoolean('LOG_ENABLE_CONSOLE'); // boolean | undefined ("true" / "false", case-insensitive)
```

`required` has the same getters, but they throw if the value is missing, empty or invalid:

```typescript
configs.required.get('JWT_SECRET');      // string
configs.required.getNumber('API_PORT');  // number
```

## Usage

### 1. NestJS apps

`ServicesConfigsModule` is global, so import it once in the app's root module:

```typescript
import { Module } from '@nestjs/common';
import { ServicesConfigsModule } from '@trading-bot/configs';

@Module({
  imports: [ServicesConfigsModule],
})
export class AppModule {}
```

Then inject `ServicesConfigs` anywhere. It is already loaded when injected:

```typescript
import { Injectable } from '@nestjs/common';
import { ServicesConfigs } from '@trading-bot/configs';

@Injectable()
export class DatabaseService {
  constructor(private readonly configs: ServicesConfigs) {}

  getConnectionString(): string {
    const host = this.configs.required.get('DB_HOST');
    const port = this.configs.required.getNumber('DB_PORT');
    const user = this.configs.required.get('DB_USER');
    const password = this.configs.required.get('DB_PASSWORD');
    const database = this.configs.required.get('DB_NAME');

    return `postgresql://${user}:${password}@${host}:${port}/${database}`;
  }
}
```

Use `required.*` for values the service cannot work without, so a missing value fails loudly instead of turning into `undefined`.

### 2. Configuring other modules

Modules with async setup (`registerAsync`, `forRootAsync`) can inject `ServicesConfigs` into their factory. No extra `imports` are needed because the module is global:

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ServicesConfigs } from '@trading-bot/configs';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ServicesConfigs],
      useFactory: (configs: ServicesConfigs) => ({
        secret: configs.required.get('JWT_SECRET'),
        signOptions: { expiresIn: configs.get('JWT_EXPIRES_IN') },
      }),
    }),
  ],
})
export class AuthModule {}
```

### 3. Outside NestJS

Scripts and build configs create the config set themselves and wait for `setUp()`:

```typescript
import { ScriptConfigs } from '@trading-bot/configs';

const configs = await new ScriptConfigs().setUp();
const profile = configs.get('DOCKER_PROFILE');
```

Where top-level `await` isn't available (for example, a webpack config), wrap it in an async function. webpack accepts an async function as its config export.

### 4. Configuration keys

Keys without a default are `undefined` when not set.

#### `ServicesConfigs`

Loaded from `process.env` in production, `.env.api-int-tests` for API integration tests, and `.env.dev` otherwise.

| Key | Default | Description |
|---|---|---|
| **API** | | |
| `API_BASE_URL` | | Public base URL of the API |
| `API_HOST` | `http://localhost` | API host |
| `API_PORT` | `3001` | API port |
| **Database** | | |
| `DB_HOST` | | Database host |
| `DB_PORT` | `5432` | Database port |
| `DB_USER` | | Database user |
| `DB_PASSWORD` | | Database password |
| `DB_NAME` | | Database name |
| **RabbitMQ** | | |
| `RMQ_HOST` | `localhost` | RabbitMQ host |
| `RMQ_PORT` | `5672` | RabbitMQ AMQP port |
| `RMQ_MANAGEMENT_PORT` | `15672` | RabbitMQ management UI port |
| `RMQ_USER` | `guest` | RabbitMQ user |
| `RMQ_PASSWORD` | `guest` | RabbitMQ password |
| **Redis** | | |
| `REDIS_HOST` | `localhost` | Redis host |
| `REDIS_PORT` | `6379` | Redis port |
| `REDIS_PASSWORD` | empty | Redis password |
| **Logging** | | |
| `LOG_ENABLE_CONSOLE` | | Log to the console (`true` / `false`) |
| `LOG_ENABLE_ELASTICSEARCH` | | Send logs to Elasticsearch (`true` / `false`) |
| `LOG_ELASTICSEARCH_NODE` | | Elasticsearch node URL |
| `LOG_ELASTICSEARCH_INDEX` | | Elasticsearch index for logs |
| `LOG_ELASTICSEARCH_AUTH_HEADER` | | Raw `Authorization` header for Elasticsearch |
| `LOG_ELASTICSEARCH_API_KEY` | | Elasticsearch API key |
| `LOG_ELASTICSEARCH_USERNAME` | | Elasticsearch username |
| `LOG_ELASTICSEARCH_PASSWORD` | | Elasticsearch password |
| **Log stream** | | |
| `LOG_STREAM_PORT` | `3002` | Log-stream service port |
| `LOG_STREAM_BASE_URL` | | Public base URL of the log-stream service |
| **Auth** | | |
| `JWT_SECRET` | | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | `24h` | JWT lifetime for the log-stream module |
| `JWT_ACCESS_EXPIRES_IN` | `15m` | Session access credential lifetime |
| `JWT_REFRESH_EXPIRES_IN` | `24h` | Renewal credential lifetime without "Remember me" |
| `JWT_REFRESH_REMEMBER_EXPIRES_IN` | `30d` | Renewal credential lifetime with "Remember me" |
| `JWT_STREAM_TICKET_EXPIRES_IN` | `60s` | Log-stream ticket lifetime |
| `AUTH_REFRESH_GRACE_MS` | | Concurrent-renewal grace window before reuse detection |
| `AUTH_COOKIE_SAME_SITE` | `lax` | `SameSite` policy for auth cookies |
| `AUTH_COOKIE_DOMAIN` | | Cookie domain; unset means host-only cookies |
| `MAX_PASSWORD_RESET_ATTEMPTS` | `5` | Password reset attempts allowed |
| **Outbox** | | |
| `OUTBOX_CLEANUP_BATCH_SIZE` | `500` | Outbox records removed per cleanup run |
| `OUTBOX_CLEANUP_INTERVAL_MS` | `60000` | Interval between cleanup runs |
| `OUTBOX_RETENTION_HOURS` | `24` | How long processed outbox records are kept |

#### `DevopsConfigs`

Loaded from `.env.devops`.

| Key | Default | Description |
|---|---|---|
| **AWS ECR** | | |
| `AWS_ECR_REGION` | | ECR region |
| `AWS_ECR_ACCOUNT_ID` | | AWS account ID that owns the registry |
| `AWS_ECR_REPO_NAMESPACE` | | Namespace for image repositories |
| `AWS_ECR_ACCESS_KEY_ID` | | Access key ID for ECR |
| `AWS_ECR_SECRET_ACCESS_KEY` | | Secret access key for ECR |
| **AWS EC2 (SSH)** | | |
| `AWS_EC2_SSH_HOST` | | EC2 host to deploy to |
| `AWS_EC2_SSH_USER` | | SSH user |
| `AWS_EC2_SSH_PORT` | | SSH port |
| `AWS_EC2_SSH_PEM_PATH` | | Path to the SSH private key (`.pem`) |
| **Database** | | |
| `DB_HOST` | | Database host |
| `DB_PORT` | | Database port |
| `DB_USER` | | Database user |
| `DB_PASSWORD` | | Database password |
| `DB_NAME` | | Database name |
| `DB_MIGRATION_USER` | | User for running migrations |
| `DB_MIGRATION_PASSWORD` | | Password for the migration user |

#### `ScriptConfigs`

Loaded from `.env.dev`.

| Key | Default | Description |
|---|---|---|
| `DOCKER_PROJECT_NAME` | | Docker Compose project name |
| `DOCKER_DB_VOLUME` | | Volume for database data |
| `DOCKER_RMQ_VOLUME` | | Volume for RabbitMQ data |
| `DOCKER_PROFILE` | `external` | Docker Compose profile to run (also used when set to empty) |

## Extending

### Adding a key

1. Add it in `setUpConfigsFromInit()` of the config set, with a default if it has one:
   ```typescript
   NEW_KEY: this.initialConfig['NEW_KEY'] ?? 'default',
   ```
2. Add it to the matching `.env.*.example` file(s).
3. List it in the [Configuration keys](#4-configuration-keys) table.

### Adding a config set

Extend `Configs` and implement two methods:

```typescript
import { join } from 'node:path';
import { Configs } from './configs';
import { findWorkspaceRoot } from './workspace-root';
import { EnvFileConfigSource } from './sources/env-file.source';

export class MyConfigs extends Configs {
  protected setUpConfigSource() {
    return new EnvFileConfigSource(join(findWorkspaceRoot(), '.env.my'));
  }

  protected setUpConfigsFromInit() {
    this.configs = {
      MY_KEY: this.initialConfig['MY_KEY'],
    };
  }
}
```

Then export it from `src/index.ts`.

## Best Practices

1. **In NestJS apps, inject `ServicesConfigs`** instead of creating new instances, so the whole app shares one loaded config.
2. **Fail fast on required values**: use `required.*` for anything the app can't run without.
3. **Keep `.env.*.example` files in sync** with the real `.env.*` files; `check-envs` reports keys missing on either side.
4. **Never commit secrets**: only `.env.*.example` files belong in version control.