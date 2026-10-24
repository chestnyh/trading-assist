import { bindArgument } from '../../fields/bindArgument';
import { TextField } from '../../fields/TextField';
import { ActionCategory } from '../categories';
import { ActionComponentProps, ActionDefinition } from '../../types';

function UmFuturesExchangeInfoAction(props: ActionComponentProps) {
  return <TextField label="Result Key" type="text" {...bindArgument(props, 'resultKey')} />;
}

export const umFuturesExchangeInfoAction: ActionDefinition = {
  label: 'UM Futures Exchange Info',
  category: ActionCategory.Binance,
  defaultArguments: {},
  optionalArguments: ['resultKey'],
  Component: UmFuturesExchangeInfoAction,
};
