import { ACTION_TYPES, canActionHaveChildren, createActionNode, getDefaultArguments } from './actionTree';
import { ActionNode, ActionType } from './types';

type ActionEditorProps = {
  action: ActionNode;
  onChange?: (action: ActionNode) => void;
  onDelete?: () => void;
  depth?: number;
  readOnly?: boolean;
};

export function ActionEditor({ action, onChange, onDelete, depth = 0, readOnly = false }: ActionEditorProps) {
  const handleTypeChange = (type: ActionType) => {
    onChange?.({
      ...action,
      type,
      arguments: getDefaultArguments(type),
    });
  };

  const handleAddChild = () => {
    const newChild = createActionNode();
    const currentDo = action.arguments.do;
    const nextDo = currentDo
      ? Array.isArray(currentDo)
        ? [...currentDo, newChild]
        : [currentDo, newChild]
      : newChild;

    onChange?.({
      ...action,
      arguments: {
        ...action.arguments,
        do: nextDo,
      },
    });
  };

  const handleChildChange = (index: number, child: ActionNode) => {
    const currentDo = action.arguments.do;
    if (Array.isArray(currentDo)) {
      const nextDo = [...currentDo];
      nextDo[index] = child;
      onChange?.({ ...action, arguments: { ...action.arguments, do: nextDo } });
      return;
    }

    onChange?.({ ...action, arguments: { ...action.arguments, do: child } });
  };

  const handleDeleteChild = (index: number) => {
    const currentDo = action.arguments.do;
    if (Array.isArray(currentDo)) {
      const nextDo = currentDo.filter((_, childIndex) => childIndex !== index);
      onChange?.({
        ...action,
        arguments: {
          ...action.arguments,
          do: nextDo.length === 1 ? nextDo[0] : nextDo,
        },
      });
      return;
    }

    onChange?.({ ...action, arguments: { ...action.arguments, do: undefined } });
  };

  const children = action.arguments.do
    ? Array.isArray(action.arguments.do)
      ? action.arguments.do
      : [action.arguments.do]
    : [];

  return (
    <div className="rounded-xl border-2 border-border bg-bg-secondary/30 p-4 my-3" style={{ marginLeft: depth ? 16 : 0 }}>
      <div className="flex flex-col md:flex-row gap-3 md:items-center mb-3">
        <label className="font-medium text-primary md:w-28" htmlFor={`action-type-${action.id}`}>Select Type</label>
        <select
          id={`action-type-${action.id}`}
          value={action.type}
          disabled={readOnly}
          onChange={(event) => handleTypeChange(event.target.value as ActionType)}
          className="flex-1 rounded-md border-2 border-border bg-background px-3 py-2 text-primary disabled:opacity-70"
        >
          <option value="">Select Type</option>
          {ACTION_TYPES.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
        {!readOnly && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-md border border-error px-4 py-2 text-error hover:bg-error/10"
          >
            Delete
          </button>
        )}
      </div>

      {action.type === 'interval' && (
        <div className="flex flex-col md:flex-row gap-3 md:items-center mb-3">
          <label className="font-medium text-primary md:w-28" htmlFor={`action-interval-${action.id}`}>Milliseconds</label>
          <input
            id={`action-interval-${action.id}`}
            type="number"
            value={action.arguments.interval ?? ''}
            disabled={readOnly}
            onChange={(event) => onChange?.({
              ...action,
              arguments: { ...action.arguments, interval: Number(event.target.value) || 0 },
            })}
            className="flex-1 rounded-md border-2 border-border bg-background px-3 py-2 text-primary disabled:opacity-70"
          />
        </div>
      )}

      {action.type === 'timeout' && (
        <div className="flex flex-col md:flex-row gap-3 md:items-center mb-3">
          <label className="font-medium text-primary md:w-28" htmlFor={`action-timeout-${action.id}`}>Milliseconds</label>
          <input
            id={`action-timeout-${action.id}`}
            type="number"
            value={action.arguments.timeout ?? ''}
            disabled={readOnly}
            onChange={(event) => onChange?.({
              ...action,
              arguments: { ...action.arguments, timeout: Number(event.target.value) || 0 },
            })}
            className="flex-1 rounded-md border-2 border-border bg-background px-3 py-2 text-primary disabled:opacity-70"
          />
        </div>
      )}

      {action.type === 'debug' && (
        <div className="flex flex-col md:flex-row gap-3 md:items-center mb-3">
          <label className="font-medium text-primary md:w-28" htmlFor={`action-message-${action.id}`}>Message</label>
          <input
            id={`action-message-${action.id}`}
            type="text"
            value={action.arguments.message ?? ''}
            disabled={readOnly}
            onChange={(event) => onChange?.({
              ...action,
              arguments: { ...action.arguments, message: event.target.value },
            })}
            className="flex-1 rounded-md border-2 border-border bg-background px-3 py-2 text-primary disabled:opacity-70"
          />
        </div>
      )}

      {canActionHaveChildren(action.type) && (
        <div className="mt-4 border-t border-border pt-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="font-medium text-primary">Nested Actions</span>
            {!readOnly && (
              <button
                type="button"
                onClick={handleAddChild}
                className="rounded-md bg-primary px-4 py-2 text-background hover:opacity-90"
              >
                Add Action
              </button>
            )}
          </div>

          {children.map((child, index) => (
            <ActionEditor
              key={child.id}
              action={child}
              onChange={(nextChild) => handleChildChange(index, nextChild)}
              onDelete={() => handleDeleteChild(index)}
              depth={depth + 1}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}
    </div>
  );
}
