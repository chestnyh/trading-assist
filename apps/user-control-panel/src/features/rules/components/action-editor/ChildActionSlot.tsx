import { ActionEditor } from './ActionEditor';
import { createActionNode, isActionNode } from './actionTree';
import { ActionChildSlot, ActionComponentProps, ActionNode } from './types';
import { SMALL_BUTTON_PRIMARY } from '../../../../shared/ui/styles';

type ChildActionSlotProps = ActionComponentProps & {
  slot: ActionChildSlot;
};

export function ChildActionSlot({ action, slot, readOnly, depth, setArgument }: ChildActionSlotProps) {
  const value = action.arguments[slot.key];
  const children = (Array.isArray(value) ? value : [value]).filter(isActionNode);
  const canAdd = !readOnly && (slot.multiple || children.length === 0);

  const setChildren = (next: ActionNode[]) => setArgument(slot.key, slot.multiple ? next : next[0]);

  return (
    <div className="mt-4 border-t border-neutral-200 dark:border-neutral-800 pt-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-sm font-semibold text-neutral-950 dark:text-white">{slot.label}</span>
        {canAdd && (
          <button type="button" onClick={() => setChildren([...children, createActionNode()])} className={SMALL_BUTTON_PRIMARY}>
            Add Action
          </button>
        )}
      </div>

      {children.map((child, index) => (
        <ActionEditor
          key={child.id}
          action={child}
          onChange={(next) => setChildren(children.map((current, i) => (i === index ? next : current)))}
          onDelete={() => setChildren(children.filter((_, i) => i !== index))}
          depth={depth + 1}
          readOnly={readOnly}
          allowedActionTypes={slot.allowedActionTypes}
        />
      ))}
    </div>
  );
}
