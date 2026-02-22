# service-comm

Reusable service-to-service communication library built on RabbitMQ.

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

- `createRmqConnection(options)`
- `createPublisher(connection, topology)`
- `createConsumer(connection, topology, subscribeOptions, handler)`

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

### Publish (core)

```ts
import {
  createRmqConnection,
  createPublisher,
  type MessageEnvelope,
} from '@trading-bot/service-comm';

const connection = createRmqConnection({
  host: 'localhost',
  port: 5672,
  username: 'guest',
  password: 'guest',
});

const publisher = await createPublisher(connection, {
  exchange: 'service_comm.topic',
});

const envelope: MessageEnvelope<{ ruleId: string }> = {
  type: 'api.rule.created',
  producer: 'api',
  timestamp: new Date().toISOString(),
  payload: { ruleId: '123' },
};

await publisher.publish(envelope, { routingKey: envelope.type });
```

### Consume (core)

```ts
import {
  createRmqConnection,
  createConsumer,
} from '@trading-bot/service-comm';

const connection = createRmqConnection({
  host: 'localhost',
  port: 5672,
  username: 'guest',
  password: 'guest',
});

await createConsumer(
  connection,
  { exchange: 'service_comm.topic' },
  {
    queue: 'auto-trader.api.rule.created',
    bindingKeys: ['api.rule.created'],
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
        connection: {
          host: cfg.get('RMQ_HOST'),
          port: Number(cfg.get('RMQ_PORT')),
          username: cfg.get('RMQ_USER'),
          password: cfg.get('RMQ_PASSWORD'),
        },
        topology: {
          exchange: 'service_comm.topic',
        },
      }),
    }),
  ],
})
export class AppModule {}
```

## Building

Run `nx build service-comm` to build the library.

## Running unit tests

Run `nx test service-comm` to execute the unit tests via [Jest](https://jestjs.io).
