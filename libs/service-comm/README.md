# service-comm

Reusable service-to-service communication library with a transport-agnostic API.

Design goals:
- Provide a small, reusable API for publishing and consuming events.
- Keep core implementation framework-agnostic.
- Provide a thin NestJS wrapper for DI-friendly usage.

This is implemented as **event-driven first** (topic exchange + routing keys). The API is designed so that adding RPC later is straightforward.

## RabbitMQ quick notes

Key elements we use:
- **Exchange**: entry point where publishers send messages.
- **Routing key**: used by the exchange to route messages.
- **Queue**: where messages accumulate and from where consumers read.
- **Binding**: connects queue to exchange using one or more routing keys.
- **Consumer ack/nack**: acknowledge processing success/failure.

## Topology conventions (proposed)

- **Exchange**: `service_comm.topic` (type `topic`, durable)
- **Routing keys**: dot-separated event names, e.g.
  - `api.rule.created`
  - `auto_trader.rule.execute`
- **Queue naming**: consumer-specific
  - `auto-trader.api.rule.created`

## Public API

### Core (framework-agnostic)

- `ServiceCommTransport` + `ServiceCommClient`
- RMQ adapter: `createRmqTransport(...)` / `RmqTransport`

Message format is `MessageEnvelope<T>` (JSON):
- `type`: event name
- `producer`: service name
- `timestamp`: ISO string
- `payload`: JSON payload

### Nest wrapper

- `ServiceCommModule.forRoot(...)` / `ServiceCommModule.forRootAsync(...)`
- `ServiceCommService.publish(...)`
- `ServiceCommService.subscribe(...)`

## Examples

### Publish (core, transport-agnostic)

```ts
import {
  ServiceCommClient,
  createRmqTransport,
  type MessageEnvelope,
} from '@trading-bot/service-comm';

const transport = createRmqTransport({
  connection: {
    host: 'localhost',
    port: 5672,
    username: 'guest',
    password: 'guest',
  },
  topology: {
    exchange: 'service_comm.topic',
  },
});

const client = new ServiceCommClient(transport);

const envelope: MessageEnvelope<{ ruleId: string }> = {
  type: 'api.rule.created',
  producer: 'api',
  timestamp: new Date().toISOString(),
  payload: { ruleId: '123' },
};

await client.publish(envelope, { topic: envelope.type });
```

### Consume (core, transport-agnostic)

```ts
import {
  ServiceCommClient,
  createRmqTransport,
} from '@trading-bot/service-comm';

const transport = createRmqTransport({
  connection: {
    host: 'localhost',
    port: 5672,
    username: 'guest',
    password: 'guest',
  },
  topology: {
    exchange: 'service_comm.topic',
  },
});

const client = new ServiceCommClient(transport);

await client.subscribe(
  {
    consumerGroup: 'auto-trader.api.rule.created',
    topics: ['api.rule.created'],
    prefetch: 10,
  },
  async (envelope) => {
    // handle envelope.payload
  }
);
```

### Nest integration

```ts
import { Module } from '@nestjs/common';
import { ServicesConfigs, ServicesConfigsModule } from '@trading-bot/configs';
import { ServiceCommModule } from '@trading-bot/service-comm';

@Module({
  imports: [
    ServicesConfigsModule,
    ServiceCommModule.forRootAsync({
      inject: [ServicesConfigs],
      useFactory: (cfg: ServicesConfigs) => ({
        rmq: {
          connection: {
            host: cfg.get('RMQ_HOST'),
            port: Number(cfg.get('RMQ_PORT')),
            username: cfg.get('RMQ_USER'),
            password: cfg.get('RMQ_PASSWORD'),
          },
          topology: {
            exchange: 'service_comm.topic',
          },
        }
      }),
    }),
  ],
})
export class AppModule {}
```

## Building

Run `pnpm nx build service-comm` to build the library.

## Running unit tests

Run `pnpm nx test service-comm` to execute the unit tests via [Jest](https://jestjs.io).
