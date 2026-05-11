import type { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import type { ConfirmChannel, ConsumeMessage } from 'amqplib';
import type { RmqConsumeOptions, RmqTopologyOptions } from './types';
import type { JsonValue, MessageEnvelope } from '../transport/types';
import { parseEnvelope } from '../transport/envelope-parser';

export type EnvelopeHandler<TPayload extends JsonValue = JsonValue> = (
  envelope: MessageEnvelope<TPayload>
) => Promise<void> | void;

export interface RmqConsumer {
  close(): Promise<void>;
}

export async function createConsumer(
  connection: AmqpConnectionManager,
  topology: RmqTopologyOptions,
  options: RmqConsumeOptions,
  handler: EnvelopeHandler
): Promise<RmqConsumer> {
  const exchangeType = topology.exchangeType ?? 'topic';

  const channel: ChannelWrapper = connection.createChannel({
    setup: async (ch: ConfirmChannel) => {
      await ch.assertExchange(topology.exchange, exchangeType, { durable: true });

      await ch.assertQueue(options.queue, {
        durable: options.durable ?? true,
      });

      for (const key of options.bindingKeys) {
        await ch.bindQueue(options.queue, topology.exchange, key);
      }

      if (options.prefetch) {
        await ch.prefetch(options.prefetch);
      }

      await ch.consume(options.queue, async (msg: ConsumeMessage | null) => {
        if (!msg) {
          return;
        }

        try {
          const raw = msg.content.toString('utf-8');
          const envelope = parseEnvelope(raw) as MessageEnvelope;
          await handler(envelope);
          ch.ack(msg);
        } catch (error) {
          ch.nack(msg, false, false);
        }
      });
    },
  });

  return {
    async close() {
      await channel.close();
    },
  };
}
