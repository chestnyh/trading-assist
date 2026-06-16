import { ActionTypeConfig } from './types';

export const ACTION_TYPES: ActionTypeConfig[] = [
  {
    value: 'log',
    label: 'Log',
    category: 'Common',
    fields: [
      { key: 'message', label: 'Message', type: 'text', defaultValue: '' },
      { key: 'level', label: 'Level', type: 'select', defaultValue: 'info', options: ['info', 'warn', 'error', 'debug'] },
      { key: 'data', label: 'Data', type: 'text', defaultValue: '', optional: true },
    ],
  },
  {
    value: 'debug',
    label: 'Debug',
    category: 'Common',
    fields: [{ key: 'message', label: 'Message', type: 'text', defaultValue: '' }],
  },
  {
    value: 'add_to_heap',
    label: 'Add to Heap',
    category: 'Common',
    fields: [{ key: 'items', label: 'Items', type: 'keyValueList', defaultValue: [{ key: 'key.to.add', value: '__sequenceContext__.value.to.add' }] }],
  },
  {
    value: 'delete_from_heap',
    label: 'Delete from Heap',
    category: 'Common',
    fields: [{ key: 'keys', label: 'Keys', type: 'stringList', defaultValue: ['some.value.key.to.delete'] }],
  },
  {
    value: 'if_then',
    label: 'If Then',
    category: 'Common',
    childSlots: [
      { key: 'if', label: 'If', multiple: false, allowedActionTypes: ['resolve', 'includes'] },
      { key: 'then', label: 'Then', multiple: true },
    ],
  },
  {
    value: 'parallel',
    label: 'Parallel',
    category: 'Common',
    childSlots: [{ key: 'do', label: 'Actions', multiple: true }],
  },
  {
    value: 'sequence',
    label: 'Sequence',
    category: 'Common',
    childSlots: [{ key: 'do', label: 'Actions', multiple: true }],
  },
  {
    value: 'resolve',
    label: 'Resolve',
    category: 'Common',
    fields: [
      { key: 'expression', label: 'Expression', type: 'text', defaultValue: '' },
      { key: 'saveTo', label: 'Save To', type: 'text', defaultValue: '', optional: true },
    ],
  },
  {
    value: 'timeout',
    label: 'Timeout',
    category: 'Common',
    fields: [{ key: 'timeout', label: 'Timeout (ms)', type: 'number', defaultValue: 90000 }],
    childSlots: [{ key: 'do', label: 'Action', multiple: false }],
  },
  {
    value: 'interval',
    label: 'Interval',
    category: 'Common',
    fields: [{ key: 'interval', label: 'Interval (ms)', type: 'number', defaultValue: 1000 }],
    childSlots: [{ key: 'do', label: 'Action', multiple: false }],
  },
  {
    value: 'for_each',
    label: 'For Each',
    category: 'Common',
    fields: [{ key: 'arr', label: 'Array Path', type: 'text', defaultValue: '__heap__.items' }],
    childSlots: [{ key: 'do', label: 'Actions', multiple: true }],
  },
  {
    value: 'cron',
    label: 'Cron',
    category: 'Common',
    fields: [{ key: 'schedule', label: 'Schedule', type: 'text', defaultValue: '* * * * *' }],
    childSlots: [{ key: 'do', label: 'Action', multiple: false }],
  },
  {
    value: 'includes',
    label: 'Includes',
    category: 'Common',
    fields: [
      { key: 'arr', label: 'Array Path', type: 'text', defaultValue: '__heap__.items' },
      { key: 'check', label: 'Check', type: 'text', defaultValue: '' },
      { key: 'saveTo', label: 'Save To', type: 'text', defaultValue: '', optional: true },
    ],
  },
  {
    value: 'stop_sequence',
    label: 'Stop Sequence',
    category: 'Common',
    fields: [],
  },
  {
    value: 'binance_get_ticker',
    label: 'Get Ticker (Legacy)',
    category: 'Binance',
    fields: [
      { key: 'symbol', label: 'Symbol', type: 'text', defaultValue: 'BTCUSDT' },
      { key: 'resultKey', label: 'Result Key', type: 'text', defaultValue: '', optional: true },
    ],
  },
  {
    value: 'binance_spot_get_ticker',
    label: 'Spot Get Ticker',
    category: 'Binance',
    fields: [
      { key: 'symbol', label: 'Symbol', type: 'text', defaultValue: 'BTCUSDT' },
      { key: 'resultKey', label: 'Result Key', type: 'text', defaultValue: '', optional: true },
    ],
  },
  {
    value: 'binance_spot_get_klines',
    label: 'Spot Get Klines',
    category: 'Binance',
    fields: [
      { key: 'symbol', label: 'Symbol', type: 'text', defaultValue: 'BTCUSDT' },
      { key: 'interval', label: 'Interval', type: 'text', defaultValue: '1m' },
      { key: 'limit', label: 'Limit', type: 'number', defaultValue: 1 },
      { key: 'resultKey', label: 'Result Key', type: 'text', defaultValue: '', optional: true },
    ],
  },
  {
    value: 'binance_um_futures_get_ticker',
    label: 'UM Futures Get Ticker',
    category: 'Binance',
    fields: [
      { key: 'symbol', label: 'Symbol', type: 'text', defaultValue: 'BTCUSDT' },
      { key: 'resultKey', label: 'Result Key', type: 'text', defaultValue: '', optional: true },
    ],
  },
  {
    value: 'binance_um_features_exchange_info',
    label: 'UM Futures Exchange Info',
    category: 'Binance',
    fields: [{ key: 'resultKey', label: 'Result Key', type: 'text', defaultValue: '', optional: true }],
  },
  {
    value: 'telegram_send_message',
    label: 'Telegram Send Message',
    category: 'Telegram',
    fields: [
      { key: 'botId', label: 'Bot ID', type: 'text', defaultValue: '' },
      { key: 'message', label: 'Message', type: 'text', defaultValue: '' },
    ],
  },
];
