import { bindArgument } from '../../fields/bindArgument';
import { TextField } from '../../fields/TextField';
import { ActionCategory } from '../categories';
import { ActionComponentProps, ActionDefinition } from '../../types';

function DebugAction(props: ActionComponentProps) {
  return <TextField label="Message" type="text" {...bindArgument(props, 'message')} />;
}

export const debugAction: ActionDefinition = {
  label: 'Debug',
  category: ActionCategory.Common,
  defaultArguments: { message: '' },
  Component: DebugAction,
};
