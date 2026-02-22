import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import type { AmqpConnectionManager } from 'amqp-connection-manager';
import { SERVICE_COMM_OPTIONS } from './service-comm.constants';
import type {
  JsonValue,
  MessageEnvelope,
  PublishOptions,
  SubscribeOptions,
} from '../rmq/types';
import type { ServiceCommModuleOptions } from './service-comm.module';
import { createRmqConnection } from '../rmq/connection';
import { createPublisher, type RmqPublisher } from '../rmq/publisher';
import { createConsumer, type EnvelopeHandler, type RmqConsumer } from '../rmq/consumer';

@Injectable()
export class ServiceCommService implements OnModuleDestroy {
  private connection: AmqpConnectionManager;
  private publisherPromise: Promise<RmqPublisher> | null = null;
  private consumers: RmqConsumer[] = [];

  constructor(
    @Inject(SERVICE_COMM_OPTIONS) private readonly options: ServiceCommModuleOptions
  ) {
    this.connection = createRmqConnection(options.connection);
  }

  private getPublisher(): Promise<RmqPublisher> {
    if (!this.publisherPromise) {
      this.publisherPromise = createPublisher(this.connection, this.options.topology);
    }
    return this.publisherPromise;
  }

  async publish<TPayload extends JsonValue>(
    envelope: MessageEnvelope<TPayload>,
    options: PublishOptions
  ): Promise<void> {
    const publisher = await this.getPublisher();
    await publisher.publish(envelope, options);
  }

  async subscribe<TPayload extends JsonValue>(
    options: SubscribeOptions,
    handler: EnvelopeHandler<TPayload>
  ): Promise<void> {
    const consumer = await createConsumer(
      this.connection,
      this.options.topology,
      options,
      handler as EnvelopeHandler
    );

    this.consumers.push(consumer);
  }

  async onModuleDestroy(): Promise<void> {
    for (const consumer of this.consumers) {
      await consumer.close();
    }

    if (this.publisherPromise) {
      const publisher = await this.publisherPromise;
      await publisher.close();
    }

    await this.connection.close();
  }
}
