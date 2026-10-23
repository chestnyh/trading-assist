import { ActionTypeSelect } from './ActionTypeSelect';
import { createActionNode, getActionConfig, getDefaultArguments, isActionNode } from './actionTree';
import { ActionField } from './fields/ActionField';
import { FIELD_ROW } from './fields/fieldLayout';
import { ActionChildSlotConfig, ActionNode, ActionType } from './types';
import { CARD, SMALL_BUTTON_DANGER, SMALL_BUTTON_PRIMARY, SUBTLE_SURFACE } from '../../../../shared/ui/styles';

type ActionEditorProps = {
  action: ActionNode;
  onChange?: (action: ActionNode) => void;
  onDelete?: () => void;
  depth?: number;
  readOnly?: boolean;
  allowedActionTypes?: ActionType[];
};

export function ActionEditor({ action, onChange, onDelete, depth = 0, readOnly = false, allowedActionTypes }: ActionEditorProps) {
  const config = getActionConfig(action.type);

  const setType = (type: ActionType) => {
    onChange?.({ ...action, type, arguments: getDefaultArguments(type) });
  };

  const setArgument = (key: string, value: unknown) => {
    onChange?.({ ...action, arguments: { ...action.arguments, [key]: value } });
  };

  const getChildren = (slot: ActionChildSlotConfig): ActionNode[] => {
    const value = action.arguments[slot.key];
    return (Array.isArray(value) ? value : [value]).filter(isActionNode);
  };

  const setChildren = (slot: ActionChildSlotConfig, children: ActionNode[]) => {
    setArgument(slot.key, slot.multiple ? children : children[0]);
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

      {config?.fields?.map((field) => (
        <ActionField
          key={field.key}
          field={field}
          inputId={`action-${field.key}-${action.id}`}
          value={action.arguments[field.key] ?? field.defaultValue}
          readOnly={readOnly}
          onChange={(value) => setArgument(field.key, value)}
        />
      ))}

      {config?.childSlots?.map((slot) => {
        const children = getChildren(slot);
        const canAdd = !readOnly && (slot.multiple || children.length === 0);

        return (
          <div key={slot.key} className="mt-4 border-t border-neutral-200 dark:border-neutral-800 pt-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-sm font-semibold text-neutral-950 dark:text-white">{slot.label}</span>
              {canAdd && (
                <button
                  type="button"
                  onClick={() => setChildren(slot, [...children, createActionNode()])}
                  className={SMALL_BUTTON_PRIMARY}
                >
                  Add Action
                </button>
              )}
            </div>

            {children.map((child, index) => (
              <ActionEditor
                key={child.id}
                action={child}
                onChange={(next) => setChildren(slot, children.map((current, i) => (i === index ? next : current)))}
                onDelete={() => setChildren(slot, children.filter((_, i) => i !== index))}
                depth={depth + 1}
                readOnly={readOnly}
                allowedActionTypes={slot.allowedActionTypes}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
