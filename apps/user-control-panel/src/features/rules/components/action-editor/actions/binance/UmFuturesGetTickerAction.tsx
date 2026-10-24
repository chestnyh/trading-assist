import { bindArgument } from '../../fields/bindArgument';
import { TextField } from '../../fields/TextField';
import { ActionCategory } from '../categories';
import { ActionComponentProps, ActionDefinition } from '../../types';

function UmFuturesGetTickerAction(props: ActionComponentProps) {
  return (
    <>
      <TextField label="Symbol" type="text" {...bindArgument(props, 'symbol')} />
      <TextField label="Result Key" type="text" {...bindArgument(props, 'resultKey')} />
    </>
  );
}

export const umFuturesGetTickerAction: ActionDefinition = {
  label: 'UM Futures Get Ticker',
  category: ActionCategory.Binance,
  defaultArguments: { symbol: 'BTCUSDT' },
  optionalArguments: ['resultKey'],
  Component: UmFuturesGetTickerAction,
};
