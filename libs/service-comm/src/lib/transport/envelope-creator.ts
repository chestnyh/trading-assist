import type { JsonValue, MessageEnvelope } from './types';

export function getEnvelopeCreator(producer: string) {
  return <TPayload extends JsonValue>(topic: string, payload: TPayload): MessageEnvelope<TPayload> => ({
    type: topic,
    producer,
    timestamp: new Date().toISOString(),
    payload,
  });
}
