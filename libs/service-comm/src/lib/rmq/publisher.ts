import type { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager';
import type { MessageEnvelope, PublishOptions, RmqTopologyOptions } from './types';

export interface RmqPublisher {
  publish<TPayload>(
    envelope: MessageEnvelope<TPayload>,
    options: PublishOptions
  ): Promise<void>;
  close(): Promise<void>;
}

export async function createPublisher(
  connection: AmqpConnectionManager,
  topology: RmqTopologyOptions
): Promise<RmqPublisher> {
  const exchangeType = topology.exchangeType ?? 'topic';

  const channel: ChannelWrapper = connection.createChannel({
    setup: async (ch) => {
      await ch.assertExchange(topology.exchange, exchangeType, { durable: true });
    },
  });

  return {
    async publish<TPayload>(
      envelope: MessageEnvelope<TPayload>,
      options: PublishOptions
    ) {
      const contentType = options.contentType ?? 'application/json';
      const payload = Buffer.from(JSON.stringify(envelope), 'utf-8');

      await channel.publish(topology.exchange, options.routingKey, payload, {
        contentType,
        persistent: options.persistent ?? true,
        headers: options.headers,
      });
    },

    async close() {
      await channel.close();
    },
  };
}
