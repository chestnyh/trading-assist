import { bindArgument } from '../../fields/bindArgument';
import { TextField } from '../../fields/TextField';
import { ActionCategory } from '../categories';
import { ActionComponentProps, ActionDefinition } from '../../types';

function SpotGetTickerAction(props: ActionComponentProps) {
  return (
    <>
      <TextField label="Symbol" type="text" {...bindArgument(props, 'symbol')} />
      <TextField label="Result Key" type="text" {...bindArgument(props, 'resultKey')} />
    </>
  );
}

export const spotGetTickerAction: ActionDefinition = {
  label: 'Spot Get Ticker',
  category: ActionCategory.Binance,
  defaultArguments: { symbol: 'BTCUSDT' },
  optionalArguments: ['resultKey'],
  Component: SpotGetTickerAction,
};
