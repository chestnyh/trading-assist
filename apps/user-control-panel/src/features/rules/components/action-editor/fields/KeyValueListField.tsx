import { COMPACT_FIELD } from '../../../../../shared/ui/styles';
import { EditableList } from './EditableList';

type KeyValueItem = { key: string; value: string };

type KeyValueListFieldProps = {
  id: string;
  label: string;
  value: unknown;
  readOnly: boolean;
  onChange: (items: KeyValueItem[]) => void;
};

export function KeyValueListField({ id, label, value, readOnly, onChange }: KeyValueListFieldProps) {
  return (
    <EditableList<KeyValueItem>
      id={id}
      label={label}
      items={Array.isArray(value) ? value.map(toKeyValueItem) : []}
      readOnly={readOnly}
      createItem={() => ({ key: '', value: '' })}
      isEmpty={(item) => item.key.trim() === '' || item.value.trim() === ''}
      onChange={onChange}
      renderItem={(item, update) => (
        <>
          <input
            type="text"
            placeholder="Key"
            value={item.key}
            disabled={readOnly}
            onChange={(event) => update({ ...item, key: event.target.value })}
            className={`${COMPACT_FIELD} flex-1`}
          />
          <input
            type="text"
            placeholder="Value"
            value={item.value}
            disabled={readOnly}
            onChange={(event) => update({ ...item, value: event.target.value })}
            className={`${COMPACT_FIELD} flex-1`}
          />
        </>
      )}
    />
  );
}

function toKeyValueItem(item: unknown): KeyValueItem {
  const record = typeof item === 'object' && item !== null ? (item as Partial<KeyValueItem>) : {};
  return { key: record.key ?? '', value: record.value ?? '' };
}
