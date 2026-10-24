import { bindArgument } from '../../fields/bindArgument';
import { TextField } from '../../fields/TextField';
import { ActionCategory } from '../categories';
import { ActionComponentProps, ActionDefinition } from '../../types';

function GetTickerAction(props: ActionComponentProps) {
  return (
    <>
      <TextField label="Symbol" type="text" {...bindArgument(props, 'symbol')} />
      <TextField label="Result Key" type="text" {...bindArgument(props, 'resultKey')} />
    </>
  );
}

export const getTickerAction: ActionDefinition = {
  label: 'Get Ticker (Legacy)',
  category: ActionCategory.Binance,
  defaultArguments: { symbol: 'BTCUSDT' },
  optionalArguments: ['resultKey'],
  Component: GetTickerAction,
};
