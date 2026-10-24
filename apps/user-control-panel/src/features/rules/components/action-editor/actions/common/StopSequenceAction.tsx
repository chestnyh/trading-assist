import { ActionCategory } from '../categories';
import { ActionDefinition } from '../../types';

function StopSequenceAction() {
  return null;
}

export const stopSequenceAction: ActionDefinition = {
  label: 'Stop Sequence',
  category: ActionCategory.Common,
  defaultArguments: {},
  Component: StopSequenceAction,
};
