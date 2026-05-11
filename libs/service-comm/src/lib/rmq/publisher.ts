import type { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import type { ConfirmChannel, Options } from 'amqplib';
import type { RmqPublishOptions, RmqTopologyOptions } from './types';
import type { JsonValue, MessageEnvelope } from '../transport/types';

export interface RmqPublisher {
  publish<TPayload extends JsonValue>(
    envelope: MessageEnvelope<TPayload>,
    options: RmqPublishOptions
  ): Promise<void>;
  close(): Promise<void>;
}

export async function createPublisher(
  connection: AmqpConnectionManager,
  topology: RmqTopologyOptions
): Promise<RmqPublisher> {
  const exchangeType = topology.exchangeType ?? 'topic';

  const channel: ChannelWrapper = connection.createChannel({
    setup: async (ch: ConfirmChannel) => {
      await ch.assertExchange(topology.exchange, exchangeType, { durable: true });
    },
  });

  return {
    async publish<TPayload extends JsonValue>(
      envelope: MessageEnvelope<TPayload>,
      options: RmqPublishOptions
    ) {
      const payload = Buffer.from(JSON.stringify(envelope), 'utf-8');

      const publishOptions: Options.Publish = {
        contentType: 'application/json',
        persistent: options.persistent ?? true,
        headers: options.headers,
      };

      await channel.publish(
        topology.exchange,
        options.routingKey,
        payload,
        publishOptions
      );
    },

    async close() {
      await channel.close();
    },
  };
}
