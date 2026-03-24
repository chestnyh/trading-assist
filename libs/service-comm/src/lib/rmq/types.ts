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

export interface RmqPublishOptions {
  routingKey: string;
  persistent?: boolean;
  headers?: Record<string, unknown>;
}

export interface RmqConsumeOptions {
  queue: string;
  bindingKeys: string[];
  prefetch?: number;
  durable?: boolean;
}
