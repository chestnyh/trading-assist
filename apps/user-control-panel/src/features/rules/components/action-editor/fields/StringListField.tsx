import { COMPACT_FIELD } from '../../../../../shared/ui/styles';
import { EditableList } from './EditableList';

type StringListFieldProps = {
  label: string;
  value: unknown;
  readOnly: boolean;
  onChange: (items: string[]) => void;
};

export function StringListField({ label, value, readOnly, onChange }: StringListFieldProps) {
  return (
    <EditableList<string>
      label={label}
      items={Array.isArray(value) ? value.map(String) : []}
      readOnly={readOnly}
      createItem={() => ''}
      isEmpty={(item) => item.trim() === ''}
      onChange={onChange}
      renderItem={(item, update) => (
        <input
          type="text"
          value={item}
          disabled={readOnly}
          onChange={(event) => update(event.target.value)}
          className={`${COMPACT_FIELD} flex-1`}
        />
      )}
    />
  );
}
