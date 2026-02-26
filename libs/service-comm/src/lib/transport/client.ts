import type { ServiceCommTransport, SubscriptionHandle } from './transport';
import type {
  EnvelopeHandler,
  JsonValue,
  MessageEnvelope,
  PublishCommand,
  SubscribeCommand,
} from './types';

export class ServiceCommClient {
  constructor(private readonly transport: ServiceCommTransport) {}

  publish<TPayload extends JsonValue>(
    envelope: MessageEnvelope<TPayload>,
    command: PublishCommand
  ): Promise<void> {
    return this.transport.publish(envelope, command);
  }

  subscribe<TPayload extends JsonValue>(
    command: SubscribeCommand,
    handler: EnvelopeHandler<TPayload>
  ): Promise<SubscriptionHandle> {
    return this.transport.subscribe(command, handler);
  }

  close(): Promise<void> {
    return this.transport.close();
  }
}
