import { ReactNode } from 'react';
import { FIELD_LABEL, SMALL_BUTTON_DANGER, SMALL_BUTTON_PRIMARY } from '../../../../../shared/ui/styles';
import { FIELD_STACK } from './fieldLayout';

type EditableListProps<T> = {
  label: string;
  items: T[];
  readOnly: boolean;
  createItem: () => T;
  isEmpty: (item: T) => boolean;
  onChange: (items: T[]) => void;
  renderItem: (item: T, update: (item: T) => void) => ReactNode;
};

export function EditableList<T>({ label, items, readOnly, createItem, isEmpty, onChange, renderItem }: EditableListProps<T>) {
  const updateAt = (index: number, item: T) => onChange(items.map((current, i) => (i === index ? item : current)));
  const removeAt = (index: number) => onChange(items.filter((_, i) => i !== index));

  return (
    <div className={FIELD_STACK}>
      <label className={FIELD_LABEL}>{label}</label>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          {renderItem(item, (next) => updateAt(index, next))}
          {!readOnly && (
            <button type="button" onClick={() => removeAt(index)} className={`${SMALL_BUTTON_DANGER} !h-auto shrink-0`}>
              Remove
            </button>
          )}
        </div>
      ))}
      {!readOnly && (
        <button
          type="button"
          onClick={() => onChange([...items, createItem()])}
          disabled={items.some(isEmpty)}
          className={`${SMALL_BUTTON_PRIMARY} w-fit`}
        >
          Add Item
        </button>
      )}
    </div>
  );
}
