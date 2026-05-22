import type { AmqpConnectionManager } from 'amqp-connection-manager';
import { connect } from 'amqp-connection-manager';
import type { RmqConnectionOptions } from './types';

export function buildAmqpUrl(options: RmqConnectionOptions): string {
  const vhost = options.vhost ?? '/';
  const encodedVhost = encodeURIComponent(vhost);
  return `amqp://${encodeURIComponent(options.username)}:${encodeURIComponent(
    options.password
  )}@${options.host}:${options.port}/${encodedVhost}`;
}

export function createRmqConnection(
  options: RmqConnectionOptions
): AmqpConnectionManager {
  const url = buildAmqpUrl(options);
  return connect([url], {
    heartbeatIntervalInSeconds: options.heartbeatSeconds ?? 5,
    reconnectTimeInSeconds: 5,
  });
}
