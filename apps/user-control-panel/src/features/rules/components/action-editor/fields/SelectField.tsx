import { FIELD_ROW, FIELD_ROW_LABEL, selectClassName } from './fieldLayout';

type SelectFieldProps = {
  id: string;
  label: string;
  value: unknown;
  options: string[];
  readOnly: boolean;
  onChange: (value: string) => void;
};

export function SelectField({ id, label, value, options, readOnly, onChange }: SelectFieldProps) {
  return (
    <div className={FIELD_ROW}>
      <label className={FIELD_ROW_LABEL} htmlFor={id}>{label}</label>
      <select
        id={id}
        value={String(value ?? '')}
        disabled={readOnly}
        onChange={(event) => onChange(event.target.value)}
        className={selectClassName(readOnly)}
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
