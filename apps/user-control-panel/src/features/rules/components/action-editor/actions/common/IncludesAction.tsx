import { bindArgument } from '../../fields/bindArgument';
import { TextField } from '../../fields/TextField';
import { ActionCategory } from '../categories';
import { ActionComponentProps, ActionDefinition } from '../../types';

function IncludesAction(props: ActionComponentProps) {
  return (
    <>
      <TextField label="Array Path" type="text" {...bindArgument(props, 'arr')} />
      <TextField label="Check" type="text" {...bindArgument(props, 'check')} />
      <TextField label="Save To" type="text" {...bindArgument(props, 'saveTo')} />
    </>
  );
}

export const includesAction: ActionDefinition = {
  label: 'Includes',
  category: ActionCategory.Common,
  defaultArguments: { arr: '__heap__.items', check: '' },
  optionalArguments: ['saveTo'],
  Component: IncludesAction,
};
