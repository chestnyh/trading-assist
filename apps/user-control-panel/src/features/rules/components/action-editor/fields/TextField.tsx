import { COMPACT_FIELD } from '../../../../../shared/ui/styles';
import { FIELD_ROW, FIELD_ROW_LABEL } from './fieldLayout';

type TextFieldProps = {
  id: string;
  label: string;
  type: 'text' | 'number';
  value: unknown;
  readOnly: boolean;
  onChange: (value: string | number) => void;
};

export function TextField({ id, label, type, value, readOnly, onChange }: TextFieldProps) {
  return (
    <div className={FIELD_ROW}>
      <label className={FIELD_ROW_LABEL} htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={String(value ?? '')}
        disabled={readOnly}
        onChange={(event) => onChange(type === 'number' ? Number(event.target.value) || 0 : event.target.value)}
        className={`${COMPACT_FIELD} flex-1`}
      />
    </div>
  );
}
