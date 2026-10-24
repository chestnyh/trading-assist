import { ChildActionSlot } from '../../ChildActionSlot';
import { bindArgument } from '../../fields/bindArgument';
import { TextField } from '../../fields/TextField';
import { ActionCategory } from '../categories';
import { ActionChildSlot, ActionComponentProps, ActionDefinition } from '../../types';

const DO: ActionChildSlot = { key: 'do', label: 'Action', multiple: false };

function TimeoutAction(props: ActionComponentProps) {
  return (
    <>
      <TextField label="Timeout (ms)" type="number" {...bindArgument(props, 'timeout')} />
      <ChildActionSlot {...props} slot={DO} />
    </>
  );
}

export const timeoutAction: ActionDefinition = {
  label: 'Timeout',
  category: ActionCategory.Common,
  defaultArguments: { timeout: 90000 },
  childSlots: [DO],
  Component: TimeoutAction,
};
