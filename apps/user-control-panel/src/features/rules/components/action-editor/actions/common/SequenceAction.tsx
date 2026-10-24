import { ChildActionSlot } from '../../ChildActionSlot';
import { ActionCategory } from '../categories';
import { ActionChildSlot, ActionComponentProps, ActionDefinition } from '../../types';

const DO: ActionChildSlot = { key: 'do', label: 'Actions', multiple: true };

function SequenceAction(props: ActionComponentProps) {
  return <ChildActionSlot {...props} slot={DO} />;
}

export const sequenceAction: ActionDefinition = {
  label: 'Sequence',
  category: ActionCategory.Common,
  defaultArguments: {},
  childSlots: [DO],
  Component: SequenceAction,
};
