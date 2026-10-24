import { ActionTypeSelect } from './ActionTypeSelect';
import { getActionDefinition, getDefaultArguments } from './actionTree';
import { FIELD_ROW } from './fields/fieldLayout';
import { ActionNode, ActionType } from './types';
import { CARD, SMALL_BUTTON_DANGER, SUBTLE_SURFACE } from '../../../../shared/ui/styles';

type ActionEditorProps = {
  action: ActionNode;
  onChange?: (action: ActionNode) => void;
  onDelete?: () => void;
  depth?: number;
  readOnly?: boolean;
  allowedActionTypes?: ActionType[];
};

export function ActionEditor({ action, onChange, onDelete, depth = 0, readOnly = false, allowedActionTypes }: ActionEditorProps) {
  const ActionComponent = getActionDefinition(action.type)?.Component;

  const setType = (type: ActionNode['type']) => {
    onChange?.({ ...action, type, arguments: getDefaultArguments(type) });
  };

  const setArgument = (key: string, value: unknown) => {
    onChange?.({ ...action, arguments: { ...action.arguments, [key]: value } });
  };

  return (
    <div className={`${depth % 2 === 0 ? SUBTLE_SURFACE : CARD} p-4 my-3`} style={{ marginLeft: depth ? 16 : 0 }}>
      <div className={FIELD_ROW}>
        <ActionTypeSelect
          id={`action-type-${action.id}`}
          value={action.type}
          allowedActionTypes={allowedActionTypes}
          readOnly={readOnly}
          onChange={setType}
        />
        {!readOnly && onDelete && (
          <button type="button" onClick={onDelete} className={SMALL_BUTTON_DANGER}>
            Delete
          </button>
        )}
      </div>

      {ActionComponent && <ActionComponent action={action} readOnly={readOnly} depth={depth} setArgument={setArgument} />}
    </div>
  );
}
