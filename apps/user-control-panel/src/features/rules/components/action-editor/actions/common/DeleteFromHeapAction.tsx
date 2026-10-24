import { bindArgument } from '../../fields/bindArgument';
import { StringListField } from '../../fields/StringListField';
import { ActionCategory } from '../categories';
import { ActionComponentProps, ActionDefinition } from '../../types';

function DeleteFromHeapAction(props: ActionComponentProps) {
  return <StringListField label="Keys" {...bindArgument(props, 'keys')} />;
}

export const deleteFromHeapAction: ActionDefinition = {
  label: 'Delete from Heap',
  category: ActionCategory.Common,
  defaultArguments: { keys: ['some.value.key.to.delete'] },
  Component: DeleteFromHeapAction,
};
