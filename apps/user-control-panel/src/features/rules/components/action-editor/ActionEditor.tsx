import { ACTION_TYPES } from './actionDefinitions';
import { createActionNode, getActionConfig, getDefaultArguments } from './actionTree';
import { ActionChildSlotConfig, ActionFieldConfig, ActionNode, ActionType } from './types';

type ActionEditorProps = {
  action: ActionNode;
  onChange?: (action: ActionNode) => void;
  onDelete?: () => void;
  depth?: number;
  readOnly?: boolean;
  allowedActionTypes?: ActionType[];
};

const categories = ['Common', 'Binance', 'Telegram'] as const;

export function ActionEditor({ action, onChange, onDelete, depth = 0, readOnly = false, allowedActionTypes }: ActionEditorProps) {
  const config = getActionConfig(action.type);

  const handleTypeChange = (type: ActionType) => {
    onChange?.({
      ...action,
      type,
      arguments: getDefaultArguments(type),
    });
  };

  const handleArgumentChange = (key: string, value: unknown) => {
    onChange?.({
      ...action,
      arguments: {
        ...action.arguments,
        [key]: value,
      },
    });
  };

  const handleAddChild = (slot: ActionChildSlotConfig) => {
    const newChild = createActionNode();
    const currentValue = action.arguments[slot.key];
    const nextValue = slot.multiple
      ? Array.isArray(currentValue)
        ? [...currentValue, newChild]
        : currentValue
          ? [currentValue, newChild]
          : [newChild]
      : newChild;

    handleArgumentChange(slot.key, nextValue);
  };

  const handleChildChange = (slot: ActionChildSlotConfig, index: number, child: ActionNode) => {
    const currentValue = action.arguments[slot.key];
    if (!slot.multiple) {
      handleArgumentChange(slot.key, child);
      return;
    }

    const children = Array.isArray(currentValue) ? [...currentValue] : [];
    children[index] = child;
    handleArgumentChange(slot.key, children);
  };

  const handleDeleteChild = (slot: ActionChildSlotConfig, index: number) => {
    const currentValue = action.arguments[slot.key];
    if (!slot.multiple) {
      handleArgumentChange(slot.key, undefined);
      return;
    }

    const children = Array.isArray(currentValue) ? currentValue.filter((_, childIndex) => childIndex !== index) : [];
    handleArgumentChange(slot.key, children);
  };

  return (
    <div className="rounded-xl border-2 border-border bg-bg-secondary/30 p-4 my-3" style={{ marginLeft: depth ? 16 : 0 }}>
      <div className="flex flex-col md:flex-row gap-3 md:items-center mb-3">
        <label className="font-medium text-primary md:w-32" htmlFor={`action-type-${action.id}`}>Action Type</label>
        <select
          id={`action-type-${action.id}`}
          value={action.type}
          disabled={readOnly}
          onChange={(event) => handleTypeChange(event.target.value as ActionType)}
          className="flex-1 rounded-md border-2 border-border bg-background px-3 py-2 text-primary disabled:opacity-70"
        >
          <option value="">Select Type</option>
          {categories.map(category => {
            const typesInCategory = ACTION_TYPES
              .filter(type => type.category === category)
              .filter(type => !allowedActionTypes || allowedActionTypes.includes(type.value));
            if (typesInCategory.length === 0) return null;
            return (
              <optgroup key={category} label={category}>
                {typesInCategory.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </optgroup>
            );
          })}
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

      {config?.fields?.map(field => (
        <ActionField
          key={field.key}
          field={field}
          actionId={action.id}
          value={action.arguments[field.key]}
          readOnly={readOnly}
          onChange={(value) => handleArgumentChange(field.key, value)}
        />
      ))}

      {config?.childSlots?.map(slot => (
        <ActionChildSlot
          key={slot.key}
          slot={slot}
          value={action.arguments[slot.key]}
          readOnly={readOnly}
          depth={depth}
          onAdd={() => handleAddChild(slot)}
          onChange={(index, child) => handleChildChange(slot, index, child)}
          onDelete={(index) => handleDeleteChild(slot, index)}
        />
      ))}
    </div>
  );
}

function ActionField({ field, actionId, value, readOnly, onChange }: {
  field: ActionFieldConfig;
  actionId: string;
  value: unknown;
  readOnly: boolean;
  onChange: (value: unknown) => void;
}) {
  const inputId = `action-${field.key}-${actionId}`;

  if (field.type === 'json') {
    return (
      <div className="flex flex-col gap-2 mb-3">
        <label className="font-medium text-primary" htmlFor={inputId}>{field.label}</label>
        <textarea
          id={inputId}
          value={formatJsonValue(value ?? field.defaultValue)}
          disabled={readOnly}
          onChange={(event) => onChange(parseJsonValue(event.target.value, value ?? field.defaultValue))}
          className="min-h-28 rounded-md border-2 border-border bg-background px-3 py-2 font-mono text-sm text-primary disabled:opacity-70"
        />
      </div>
    );
  }

  if (field.type === 'keyValueList') {
    const items = Array.isArray(value) ? value : (field.defaultValue as Array<{ key: string; value: string }> | undefined) ?? [];
    const hasEmptyItem = items.some(item => {
      if (typeof item !== 'object' || item === null) return true;
      const keyValue = (item as { key?: string }).key ?? '';
      const valueValue = (item as { value?: string }).value ?? '';
      return keyValue.trim() === '' || valueValue.trim() === '';
    });
    return (
      <div className="flex flex-col gap-2 mb-3">
        <label className="font-medium text-primary">{field.label}</label>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              placeholder="Key"
              value={typeof item === 'object' && item !== null ? (item as { key?: string }).key ?? '' : ''}
              disabled={readOnly}
              onChange={(event) => {
                const nextItems = [...items];
                nextItems[index] = { ...nextItems[index], key: event.target.value };
                onChange(nextItems);
              }}
              className="flex-1 rounded-md border-2 border-border bg-background px-3 py-2 text-primary disabled:opacity-70"
            />
            <input
              type="text"
              placeholder="Value"
              value={typeof item === 'object' && item !== null ? (item as { value?: string }).value ?? '' : ''}
              disabled={readOnly}
              onChange={(event) => {
                const nextItems = [...items];
                nextItems[index] = { ...nextItems[index], value: event.target.value };
                onChange(nextItems);
              }}
              className="flex-1 rounded-md border-2 border-border bg-background px-3 py-2 text-primary disabled:opacity-70"
            />
            {!readOnly && (
              <button
                type="button"
                onClick={() => {
                  const nextItems = items.filter((_, i) => i !== index);
                  onChange(nextItems);
                }}
                className="rounded-md border border-error px-3 py-2 text-error hover:bg-error/10"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {!readOnly && (
          <button
            type="button"
            onClick={() => onChange([...items, { key: '', value: '' }])}
            disabled={hasEmptyItem}
            className="rounded-md bg-primary px-4 py-2 text-background hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Item
          </button>
        )}
      </div>
    );
  }

  if (field.type === 'stringList') {
    const items = Array.isArray(value) ? value : (field.defaultValue as string[] | undefined) ?? [];
    const hasEmptyItem = items.some(item => String(item).trim() === '');
    return (
      <div className="flex flex-col gap-2 mb-3">
        <label className="font-medium text-primary">{field.label}</label>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={String(item)}
              disabled={readOnly}
              onChange={(event) => {
                const nextItems = [...items];
                nextItems[index] = event.target.value;
                onChange(nextItems);
              }}
              className="flex-1 rounded-md border-2 border-border bg-background px-3 py-2 text-primary disabled:opacity-70"
            />
            {!readOnly && (
              <button
                type="button"
                onClick={() => {
                  const nextItems = items.filter((_, i) => i !== index);
                  onChange(nextItems);
                }}
                className="rounded-md border border-error px-3 py-2 text-error hover:bg-error/10"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        {!readOnly && (
          <button
            type="button"
            onClick={() => onChange([...items, ''])}
            disabled={hasEmptyItem}
            className="rounded-md bg-primary px-4 py-2 text-background hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Item
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center mb-3">
      <label className="font-medium text-primary md:w-32" htmlFor={inputId}>{field.label}</label>
      {field.type === 'select' ? (
        <select
          id={inputId}
          value={String(value ?? field.defaultValue ?? '')}
          disabled={readOnly}
          onChange={(event) => onChange(event.target.value)}
          className="flex-1 rounded-md border-2 border-border bg-background px-3 py-2 text-primary disabled:opacity-70"
        >
          {(field.options ?? []).map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          id={inputId}
          type={field.type === 'number' ? 'number' : 'text'}
          value={String(value ?? field.defaultValue ?? '')}
          disabled={readOnly}
          onChange={(event) => onChange(field.type === 'number' ? Number(event.target.value) || 0 : event.target.value)}
          className="flex-1 rounded-md border-2 border-border bg-background px-3 py-2 text-primary disabled:opacity-70"
        />
      )}
    </div>
  );
}

function ActionChildSlot({ slot, value, readOnly, depth, onAdd, onChange, onDelete }: {
  slot: ActionChildSlotConfig;
  value: unknown;
  readOnly: boolean;
  depth: number;
  onAdd: () => void;
  onChange: (index: number, child: ActionNode) => void;
  onDelete: (index: number) => void;
}) {
  const children = slot.multiple
    ? Array.isArray(value) ? value.filter(isActionNode) : []
    : isActionNode(value) ? [value] : [];

  return (
    <div className="mt-4 border-t border-border pt-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="font-medium text-primary">{slot.label}</span>
        {!readOnly && (slot.multiple || children.length === 0) && (
          <button
            type="button"
            onClick={onAdd}
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
          onChange={(nextChild) => onChange(index, nextChild)}
          onDelete={() => onDelete(index)}
          depth={depth + 1}
          readOnly={readOnly}
          allowedActionTypes={slot.allowedActionTypes}
        />
      ))}
    </div>
  );
}

function formatJsonValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '';
  }
}

function parseJsonValue(raw: string, fallback: unknown): unknown {
  if (raw.trim() === '') {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function isActionNode(value: unknown): value is ActionNode {
  return typeof value === 'object' && value !== null && 'id' in value && 'type' in value && 'arguments' in value;
}
