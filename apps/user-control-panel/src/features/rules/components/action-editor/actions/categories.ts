// Values are the optgroup labels; their order is the order shown in the action type select.
export const ActionCategory = {
  Common: 'Common',
  Binance: 'Binance',
  Telegram: 'Telegram',
} as const;

export type ActionCategory = (typeof ActionCategory)[keyof typeof ActionCategory];
