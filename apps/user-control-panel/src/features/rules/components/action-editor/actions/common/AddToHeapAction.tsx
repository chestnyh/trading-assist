import { bindArgument } from '../../fields/bindArgument';
import { KeyValueListField } from '../../fields/KeyValueListField';
import { ActionCategory } from '../categories';
import { ActionComponentProps, ActionDefinition } from '../../types';

function AddToHeapAction(props: ActionComponentProps) {
  return <KeyValueListField label="Items" {...bindArgument(props, 'items')} />;
}

export const addToHeapAction: ActionDefinition = {
  label: 'Add to Heap',
  category: ActionCategory.Common,
  defaultArguments: { items: [{ key: 'key.to.add', value: '__sequenceContext__.value.to.add' }] },
  Component: AddToHeapAction,
};
