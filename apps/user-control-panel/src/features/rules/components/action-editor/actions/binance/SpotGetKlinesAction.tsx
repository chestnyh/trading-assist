import { bindArgument } from '../../fields/bindArgument';
import { TextField } from '../../fields/TextField';
import { ActionCategory } from '../categories';
import { ActionComponentProps, ActionDefinition } from '../../types';

function SpotGetKlinesAction(props: ActionComponentProps) {
  return (
    <>
      <TextField label="Symbol" type="text" {...bindArgument(props, 'symbol')} />
      <TextField label="Interval" type="text" {...bindArgument(props, 'interval')} />
      <TextField label="Limit" type="number" {...bindArgument(props, 'limit')} />
      <TextField label="Result Key" type="text" {...bindArgument(props, 'resultKey')} />
    </>
  );
}

export const spotGetKlinesAction: ActionDefinition = {
  label: 'Spot Get Klines',
  category: ActionCategory.Binance,
  defaultArguments: { symbol: 'BTCUSDT', interval: '1m', limit: 1 },
  optionalArguments: ['resultKey'],
  Component: SpotGetKlinesAction,
};
