import { bindArgument } from '../../fields/bindArgument';
import { TextField } from '../../fields/TextField';
import { ActionCategory } from '../categories';
import { ActionComponentProps, ActionDefinition } from '../../types';

function ResolveAction(props: ActionComponentProps) {
  return (
    <>
      <TextField label="Expression" type="text" {...bindArgument(props, 'expression')} />
      <TextField label="Save To" type="text" {...bindArgument(props, 'saveTo')} />
    </>
  );
}

export const resolveAction: ActionDefinition = {
  label: 'Resolve',
  category: ActionCategory.Common,
  defaultArguments: { expression: '' },
  optionalArguments: ['saveTo'],
  Component: ResolveAction,
};
