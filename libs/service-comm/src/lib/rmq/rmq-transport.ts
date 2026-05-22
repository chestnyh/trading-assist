import type { AmqpConnectionManager } from 'amqp-connection-manager';
import type {
  JsonValue,
  MessageEnvelope,
  PublishCommand,
  SubscribeCommand,
  EnvelopeHandler,
} from '../transport/types';
import type {
  ServiceCommTransport,
  SubscriptionHandle,
} from '../transport/transport';
import type { RmqConnectionOptions, RmqTopologyOptions } from './types';
import { createRmqConnection } from './connection';
import { createPublisher, type RmqPublisher } from './publisher';
import { createConsumer, type RmqConsumer } from './consumer';

export interface RmqTransportOptions {
  connection: RmqConnectionOptions;
  topology: RmqTopologyOptions;
}

export class RmqTransport implements ServiceCommTransport {
  private connection: AmqpConnectionManager;
  private publisherPromise: Promise<RmqPublisher> | null = null;
  private subscriptions: SubscriptionHandle[] = [];

  constructor(private readonly options: RmqTransportOptions) {
    this.connection = createRmqConnection(options.connection);
  }

  private async getPublisher(): Promise<RmqPublisher> {
    if (!this.publisherPromise) {
      this.publisherPromise = createPublisher(this.connection, this.options.topology);
    }
    return this.publisherPromise;
  }

  async publish<TPayload extends JsonValue>(
    envelope: MessageEnvelope<TPayload>,
    command: PublishCommand
  ): Promise<void> {
    const publisher = await this.getPublisher();
    await publisher.publish(envelope, {
      routingKey: command.topic,
      persistent: true,
      headers: command.headers,
    });
  }

  async subscribe<TPayload extends JsonValue>(
    command: SubscribeCommand,
    handler: EnvelopeHandler<TPayload>
  ): Promise<SubscriptionHandle> {
    const consumer: RmqConsumer = await createConsumer(
      this.connection,
      this.options.topology,
      {
        queue: command.consumerGroup,
        bindingKeys: command.topics,
        prefetch: command.prefetch,
        durable: true,
      },
      handler as unknown as (envelope: MessageEnvelope) => Promise<void> | void
    );

    const handle: SubscriptionHandle = {
      close: () => consumer.close(),
    };

    this.subscriptions.push(handle);
    return handle;
  }

  async close(): Promise<void> {
    for (const sub of this.subscriptions) {
      await sub.close();
    }

    if (this.publisherPromise) {
      const publisher = await this.publisherPromise;
      await publisher.close();
    }

    await this.connection.close();
  }
}

export function createRmqTransport(options: RmqTransportOptions): RmqTransport {
  return new RmqTransport(options);
}
