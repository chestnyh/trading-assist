import { bindArgument } from '../../fields/bindArgument';
import { SelectField } from '../../fields/SelectField';
import { TextField } from '../../fields/TextField';
import { ActionCategory } from '../categories';
import { ActionComponentProps, ActionDefinition } from '../../types';

const LEVELS = ['info', 'warn', 'error', 'debug'];

function LogAction(props: ActionComponentProps) {
  return (
    <>
      <TextField label="Message" type="text" {...bindArgument(props, 'message')} />
      <SelectField label="Level" options={LEVELS} {...bindArgument(props, 'level')} />
      <TextField label="Data" type="text" {...bindArgument(props, 'data')} />
    </>
  );
}

export const logAction: ActionDefinition = {
  label: 'Log',
  category: ActionCategory.Common,
  defaultArguments: { message: '', level: 'info' },
  optionalArguments: ['data'],
  Component: LogAction,
};
