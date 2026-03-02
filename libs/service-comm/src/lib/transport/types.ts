export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface MessageEnvelope<TPayload extends JsonValue = JsonValue> {
  type: string;
  producer: string;
  timestamp: string;
  correlationId?: string;
  messageId?: string;
  payload: TPayload;
  meta?: Record<string, JsonValue>;
}

export interface PublishCommand {
  topic: string;
  headers?: Record<string, unknown>;
}

export interface SubscribeCommand {
  consumerGroup: string;
  topics: string[];
  prefetch?: number;
}

export type EnvelopeHandler<TPayload extends JsonValue = JsonValue> = (
  envelope: MessageEnvelope<TPayload>
) => Promise<void> | void;
