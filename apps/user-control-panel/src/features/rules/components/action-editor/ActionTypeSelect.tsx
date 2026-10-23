import { ACTION_TYPES } from './actionDefinitions';
import { FIELD_ROW_LABEL, selectClassName } from './fields/fieldLayout';
import { ActionType, ActionTypeConfig } from './types';

const CATEGORIES: ActionTypeConfig['category'][] = ['Common', 'Binance', 'Telegram'];

type ActionTypeSelectProps = {
  id: string;
  value: ActionType;
  allowedActionTypes?: ActionType[];
  readOnly: boolean;
  onChange: (type: ActionType) => void;
};

export function ActionTypeSelect({ id, value, allowedActionTypes, readOnly, onChange }: ActionTypeSelectProps) {
  return (
    <>
      <label className={FIELD_ROW_LABEL} htmlFor={id}>Action Type</label>
      <select
        id={id}
        value={value}
        disabled={readOnly}
        onChange={(event) => onChange(event.target.value as ActionType)}
        className={selectClassName(readOnly)}
      >
        <option value="">Select Type</option>
        {CATEGORIES.map((category) => {
          const types = ACTION_TYPES.filter(
            (type) => type.category === category && (!allowedActionTypes || allowedActionTypes.includes(type.value)),
          );
          if (types.length === 0) return null;
          return (
            <optgroup key={category} label={category}>
              {types.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </optgroup>
          );
        })}
      </select>
    </>
  );
}
