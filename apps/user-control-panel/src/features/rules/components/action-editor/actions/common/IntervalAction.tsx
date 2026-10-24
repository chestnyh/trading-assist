import { ChildActionSlot } from '../../ChildActionSlot';
import { bindArgument } from '../../fields/bindArgument';
import { TextField } from '../../fields/TextField';
import { ActionCategory } from '../categories';
import { ActionChildSlot, ActionComponentProps, ActionDefinition } from '../../types';

const DO: ActionChildSlot = { key: 'do', label: 'Action', multiple: false };

function IntervalAction(props: ActionComponentProps) {
  return (
    <>
      <TextField label="Interval (ms)" type="number" {...bindArgument(props, 'interval')} />
      <ChildActionSlot {...props} slot={DO} />
    </>
  );
}

export const intervalAction: ActionDefinition = {
  label: 'Interval',
  category: ActionCategory.Common,
  defaultArguments: { interval: 1000 },
  childSlots: [DO],
  Component: IntervalAction,
};
