# @trading-bot/logger

Shared logger library used by services in this monorepo.

## Features

- Implements NestJS `LoggerService` interface.
- Produces structured log entries with standard fields (timestamp, level, message, service, environment, pid, error, meta).
- Console output is enabled by default and can be disabled.
- Optional Elasticsearch transport (enabled only when explicitly configured).

## Installation / usage

In a NestJS service:

- Add `LoggerModule` to your root module (usually `ApiModule` / `AppModule`) using `forRoot` or `forRootAsync`.
- In `main.ts`, enable `bufferLogs: true` and set the app logger with `app.useLogger(app.get(LoggerService))`.

Example:

```ts
import { LoggerModule, LoggerService } from '@trading-bot/logger';

LoggerModule.forRoot({
  service: 'api',
  environment: 'development',
  enableConsole: true,
  enableElasticsearch: false,
});

// main.ts
const app = await NestFactory.create(ApiModule, { bufferLogs: true });
app.useLogger(app.get(LoggerService));
```

## Configuration

### Console

- `enableConsole` (default: `true`) controls whether the logger prints human-friendly lines to stdout/stderr.

Environment variable used by services config:

- `LOG_ENABLE_CONSOLE` (`true` / `false`)

### Elasticsearch

To send logs to Elasticsearch you must:

- Set `enableElasticsearch: true`
- Provide `elasticsearch.node` and `elasticsearch.index`

Environment variables used by services config:

- `LOG_ENABLE_ELASTICSEARCH` (`true` / `false`)
- `LOG_ELASTICSEARCH_NODE` (e.g. `http://localhost:9200`)
- `LOG_ELASTICSEARCH_INDEX` (e.g. `logs-trading-bot`)

#### Authorization

If Elasticsearch is protected (common for staging/production), configure **one** of the following:

- `LOG_ELASTICSEARCH_AUTH_HEADER`
  - Value is used as-is in `Authorization` header.
- `LOG_ELASTICSEARCH_API_KEY`
  - Will be sent as `Authorization: ApiKey <value>`
- `LOG_ELASTICSEARCH_USERNAME` + `LOG_ELASTICSEARCH_PASSWORD`
  - Will be sent as `Authorization: Basic <base64(username:password)>`

Notes:

- When no auth variables are provided, no `Authorization` header is sent.
- Only the configured headers are sent; sensitive values should never be committed.

#### Examples: Elasticsearch with credentials

Using a raw authorization header (recommended when your infra provides a ready header value):

```bash
LOG_ENABLE_ELASTICSEARCH=true
LOG_ELASTICSEARCH_NODE=https://your-es-host:9200
LOG_ELASTICSEARCH_INDEX=logs-trading-bot
LOG_ELASTICSEARCH_AUTH_HEADER="Bearer <token>"
```

Using Elasticsearch API key:

```bash
LOG_ENABLE_ELASTICSEARCH=true
LOG_ELASTICSEARCH_NODE=https://your-es-host:9200
LOG_ELASTICSEARCH_INDEX=logs-trading-bot
LOG_ELASTICSEARCH_API_KEY="<base64-api-key>"
```

Using Basic auth:

```bash
LOG_ENABLE_ELASTICSEARCH=true
LOG_ELASTICSEARCH_NODE=https://your-es-host:9200
LOG_ELASTICSEARCH_INDEX=logs-trading-bot
LOG_ELASTICSEARCH_USERNAME="elastic"
LOG_ELASTICSEARCH_PASSWORD="<password>"
```

## Why not `@elastic/elasticsearch`?

This library uses `fetch` to keep the transport lightweight and dependency-free.
If we later need bulk indexing, retry/backoff, sniffing, or richer ES features,
we can switch to the official client.
