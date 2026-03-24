import type {
  EnvelopeHandler,
  JsonValue,
  MessageEnvelope,
  PublishCommand,
  SubscribeCommand,
} from './types';

export interface SubscriptionHandle {
  close(): Promise<void>;
}

export interface ServiceCommTransport {
  publish<TPayload extends JsonValue>(
    envelope: MessageEnvelope<TPayload>,
    command: PublishCommand
  ): Promise<void>;

  subscribe<TPayload extends JsonValue>(
    command: SubscribeCommand,
    handler: EnvelopeHandler<TPayload>
  ): Promise<SubscriptionHandle>;

  close(): Promise<void>;
}
