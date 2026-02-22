export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface MessageEnvelope<TPayload extends JsonValue = JsonValue> {
  /** Event name / routing key */
  type: string;
  /** Producer service name */
  producer: string;
  /** ISO timestamp */
  timestamp: string;
  /** Correlation ID for tracing across services */
  correlationId?: string;
  /** Unique message ID */
  messageId?: string;
  /** Actual business payload */
  payload: TPayload;
  /** Any extra metadata (kept JSON for portability) */
  meta?: Record<string, JsonValue>;
}

export interface RmqConnectionOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  vhost?: string;
  heartbeatSeconds?: number;
}

export interface RmqTopologyOptions {
  exchange: string;
  exchangeType?: 'topic' | 'direct' | 'fanout' | 'headers';
}

export interface PublishOptions {
  routingKey: string;
  persistent?: boolean;
  contentType?: string;
  headers?: Record<string, unknown>;
}

export interface SubscribeOptions {
  queue: string;
  bindingKeys: string[];
  prefetch?: number;
  durable?: boolean;
}
