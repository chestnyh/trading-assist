export type ActionType =
  | ''
  | 'log'
  | 'debug'
  | 'add_to_heap'
  | 'delete_from_heap'
  | 'if_then'
  | 'parallel'
  | 'sequence'
  | 'resolve'
  | 'timeout'
  | 'interval'
  | 'for_each'
  | 'cron'
  | 'includes'
  | 'stop_sequence'
  | 'binance_spot_get_ticker'
  | 'binance_spot_get_klines'
  | 'binance_um_futures_get_ticker'
  | 'binance_um_features_exchange_info'
  | 'telegram_send_message';

export type ActionNode = {
  id: string;
  type: ActionType;
  arguments: Record<string, unknown>;
};

export type ActionFieldType = 'text' | 'number' | 'select' | 'json' | 'keyValueList' | 'stringList';

export type ActionFieldConfig = {
  key: string;
  label: string;
  type: ActionFieldType;
  defaultValue: unknown;
  optional?: boolean;
  options?: string[];
};

export type ActionChildSlotConfig = {
  key: string;
  label: string;
  multiple: boolean;
  allowedActionTypes?: ActionType[];
};

export type ActionTypeConfig = {
  value: Exclude<ActionType, ''>;
  label: string;
  category: 'Common' | 'Binance' | 'Telegram';
  fields?: ActionFieldConfig[];
  childSlots?: ActionChildSlotConfig[];
};
