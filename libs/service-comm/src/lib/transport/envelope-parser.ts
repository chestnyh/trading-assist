import type { MessageEnvelope, JsonValue } from './types';

export function parseEnvelope(raw: string): MessageEnvelope {
  const parsed = JSON.parse(raw) as unknown;

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid envelope: not an object');
  }

  const env = parsed as Partial<MessageEnvelope>;

  if (typeof env.type !== 'string') {
    throw new Error('Invalid envelope: type must be a string');
  }

  if (typeof env.producer !== 'string') {
    throw new Error('Invalid envelope: producer must be a string');
  }

  if (typeof env.timestamp !== 'string') {
    throw new Error('Invalid envelope: timestamp must be a string');
  }

  if (!('payload' in env)) {
    throw new Error('Invalid envelope: payload is required');
  }

  return env as MessageEnvelope<JsonValue>;
}

export function unpackEnvelope<TPayload extends JsonValue>(envelope: MessageEnvelope<TPayload>): {
  topic: string;
  payload: TPayload;
} {
  return {
    topic: envelope.type,
    payload: envelope.payload,
  };
}
