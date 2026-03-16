import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { SERVICE_COMM_OPTIONS } from './service-comm.constants';
import type { ServiceCommModuleOptions } from './service-comm.module';
import { ServiceCommClient } from '../transport/client';
import type {
  EnvelopeHandler,
  JsonValue,
  MessageEnvelope,
  PublishCommand,
  SubscribeCommand,
} from '../transport/types';
import type { SubscriptionHandle } from '../transport/transport';
import { createRmqTransport, type RmqTransport } from '../rmq/rmq-transport';

@Injectable()
export class ServiceCommService implements OnModuleDestroy {
  private client: ServiceCommClient;
  private transport: RmqTransport | null = null;
  private subscriptions: SubscriptionHandle[] = [];

  constructor(
    @Inject(SERVICE_COMM_OPTIONS) private readonly options: ServiceCommModuleOptions
  ) {
    if ('transport' in options) {
      this.client = new ServiceCommClient(options.transport);
      return;
    }

    this.transport = createRmqTransport(options.rmq);
    this.client = new ServiceCommClient(this.transport);
  }

  async publish<TPayload extends JsonValue>(
    envelope: MessageEnvelope<TPayload>,
    command: PublishCommand
  ): Promise<void> {
    await this.client.publish(envelope, command);
  }

  async subscribe<TPayload extends JsonValue>(
    command: SubscribeCommand,
    handler: EnvelopeHandler<TPayload>
  ): Promise<SubscriptionHandle> {
    const subscription = await this.client.subscribe(command, handler);
    this.subscriptions.push(subscription);
    return subscription;
  }

  async onModuleDestroy(): Promise<void> {
    for (const sub of this.subscriptions) {
      await sub.close();
    }

    await this.client.close();
  }
}
