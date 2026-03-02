import { buildAmqpUrl } from './rmq/connection';

describe('service-comm', () => {
  it('buildAmqpUrl should encode vhost', () => {
    const url = buildAmqpUrl({
      host: 'localhost',
      port: 5672,
      username: 'guest',
      password: 'guest',
      vhost: '/',
    });

    expect(url).toContain('amqp://guest:guest@localhost:5672/');
  });
});
