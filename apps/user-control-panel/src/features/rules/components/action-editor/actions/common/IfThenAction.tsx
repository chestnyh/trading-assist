import { ChildActionSlot } from '../../ChildActionSlot';
import { ActionCategory } from '../categories';
import { ActionChildSlot, ActionComponentProps, ActionDefinition } from '../../types';

const IF: ActionChildSlot = { key: 'if', label: 'If', multiple: false, allowedActionTypes: ['resolve', 'includes'] };
const THEN: ActionChildSlot = { key: 'then', label: 'Then', multiple: true };

function IfThenAction(props: ActionComponentProps) {
  return (
    <>
      <ChildActionSlot {...props} slot={IF} />
      <ChildActionSlot {...props} slot={THEN} />
    </>
  );
}

export const ifThenAction: ActionDefinition = {
  label: 'If Then',
  category: ActionCategory.Common,
  defaultArguments: {},
  childSlots: [IF, THEN],
  Component: IfThenAction,
};
