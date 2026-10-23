import { COMPACT_FIELD, FIELD_LABEL } from '../../../../../shared/ui/styles';
import { FIELD_STACK } from './fieldLayout';

type JsonFieldProps = {
  id: string;
  label: string;
  value: unknown;
  readOnly: boolean;
  onChange: (value: unknown) => void;
};

export function JsonField({ id, label, value, readOnly, onChange }: JsonFieldProps) {
  return (
    <div className={FIELD_STACK}>
      <label className={FIELD_LABEL} htmlFor={id}>{label}</label>
      <textarea
        id={id}
        value={formatJsonValue(value)}
        disabled={readOnly}
        onChange={(event) => onChange(parseJsonValue(event.target.value, value))}
        className={`${COMPACT_FIELD} min-h-28 font-mono`}
      />
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
