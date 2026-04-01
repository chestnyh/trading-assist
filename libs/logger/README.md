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

### Elasticsearch

To send logs to Elasticsearch you must:

- Set `enableElasticsearch: true`
- Provide `elasticsearch.node` and `elasticsearch.index`

#### Authorization

If Elasticsearch is protected (common for staging/production), pass one of the following via module options:

- `elasticsearch.auth: { header: string }`
  - Value is used as-is in `Authorization` header.
- `elasticsearch.auth: { apiKey: string }`
  - Will be sent as `Authorization: ApiKey <value>`
- `elasticsearch.auth: { username: string; password: string }`
  - Will be sent as `Authorization: Basic <base64(username:password)>`

Notes:

- When no auth options are provided, no `Authorization` header is sent.
- Only the configured headers are sent; sensitive values should never be committed.

#### Examples: Elasticsearch with credentials

Using a raw authorization header (recommended when your infra provides a ready header value):

```ts
LoggerModule.forRoot({
  service: 'api',
  environment: 'staging',
  enableConsole: true,
  enableElasticsearch: true,
  elasticsearch: {
    node: 'https://your-es-host:9200',
    index: 'logs-trading-bot',
    auth: {
      header: 'Bearer <token>',
    },
  },
});
```

Using Elasticsearch API key:

```ts
LoggerModule.forRoot({
  service: 'api',
  environment: 'staging',
  enableConsole: true,
  enableElasticsearch: true,
  elasticsearch: {
    node: 'https://your-es-host:9200',
    index: 'logs-trading-bot',
    auth: {
      apiKey: '<base64-api-key>',
    },
  },
});
```

Using Basic auth:

```ts
LoggerModule.forRoot({
  service: 'api',
  environment: 'staging',
  enableConsole: true,
  enableElasticsearch: true,
  elasticsearch: {
    node: 'https://your-es-host:9200',
    index: 'logs-trading-bot',
    auth: {
      username: 'elastic',
      password: '<password>',
    },
  },
});
```

Using `forRootAsync`:

```ts
LoggerModule.forRootAsync({
  inject: [ServicesConfigs],
  useFactory: (cfg: ServicesConfigs) => ({
    service: 'api',
    environment: cfg.get('NODE_ENV')!,
    enableConsole: cfg.get('LOG_ENABLE_CONSOLE') === 'true',
    enableElasticsearch: cfg.get('LOG_ENABLE_ELASTICSEARCH') === 'true',
    elasticsearch:
      cfg.get('LOG_ELASTICSEARCH_NODE') && cfg.get('LOG_ELASTICSEARCH_INDEX')
        ? {
            node: cfg.get('LOG_ELASTICSEARCH_NODE')!,
            index: cfg.get('LOG_ELASTICSEARCH_INDEX')!,
            auth: cfg.get('LOG_ELASTICSEARCH_AUTH_HEADER')
              ? { header: cfg.get('LOG_ELASTICSEARCH_AUTH_HEADER')! }
              : cfg.get('LOG_ELASTICSEARCH_API_KEY')
                ? { apiKey: cfg.get('LOG_ELASTICSEARCH_API_KEY')! }
                : cfg.get('LOG_ELASTICSEARCH_USERNAME') && cfg.get('LOG_ELASTICSEARCH_PASSWORD')
                  ? {
                      username: cfg.get('LOG_ELASTICSEARCH_USERNAME')!,
                      password: cfg.get('LOG_ELASTICSEARCH_PASSWORD')!,
                    }
                  : undefined,
          }
        : undefined,
  }),
});
```

## Why not `@elastic/elasticsearch`?

This library uses `fetch` to keep the transport lightweight and dependency-free.
If we later need bulk indexing, retry/backoff, sniffing, or richer ES features,
we can switch to the official client.
