import { ChildActionSlot } from '../../ChildActionSlot';
import { bindArgument } from '../../fields/bindArgument';
import { TextField } from '../../fields/TextField';
import { ActionCategory } from '../categories';
import { ActionChildSlot, ActionComponentProps, ActionDefinition } from '../../types';

const DO: ActionChildSlot = { key: 'do', label: 'Actions', multiple: true };

function ForEachAction(props: ActionComponentProps) {
  return (
    <>
      <TextField label="Array Path" type="text" {...bindArgument(props, 'arr')} />
      <ChildActionSlot {...props} slot={DO} />
    </>
  );
}

export const forEachAction: ActionDefinition = {
  label: 'For Each',
  category: ActionCategory.Common,
  defaultArguments: { arr: '__heap__.items' },
  childSlots: [DO],
  Component: ForEachAction,
};
