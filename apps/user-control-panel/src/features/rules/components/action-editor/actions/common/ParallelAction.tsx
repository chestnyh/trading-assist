import { ChildActionSlot } from '../../ChildActionSlot';
import { ActionCategory } from '../categories';
import { ActionChildSlot, ActionComponentProps, ActionDefinition } from '../../types';

const DO: ActionChildSlot = { key: 'do', label: 'Actions', multiple: true };

function ParallelAction(props: ActionComponentProps) {
  return <ChildActionSlot {...props} slot={DO} />;
}

export const parallelAction: ActionDefinition = {
  label: 'Parallel',
  category: ActionCategory.Common,
  defaultArguments: {},
  childSlots: [DO],
  Component: ParallelAction,
};
