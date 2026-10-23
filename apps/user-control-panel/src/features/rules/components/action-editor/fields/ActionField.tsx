import { ActionFieldConfig } from '../types';
import { JsonField } from './JsonField';
import { KeyValueListField } from './KeyValueListField';
import { SelectField } from './SelectField';
import { StringListField } from './StringListField';
import { TextField } from './TextField';

type ActionFieldProps = {
  field: ActionFieldConfig;
  inputId: string;
  value: unknown;
  readOnly: boolean;
  onChange: (value: unknown) => void;
};

export function ActionField({ field, inputId, value, readOnly, onChange }: ActionFieldProps) {
  const common = { label: field.label, readOnly, onChange };

  switch (field.type) {
    case 'text':
    case 'number':
      return <TextField {...common} id={inputId} type={field.type} value={value} />;
    case 'select':
      return <SelectField {...common} id={inputId} value={value} options={field.options ?? []} />;
    case 'json':
      return <JsonField {...common} id={inputId} value={value} />;
    case 'keyValueList':
      return <KeyValueListField {...common} value={value} />;
    case 'stringList':
      return <StringListField {...common} value={value} />;
  }
}
