import { ACTION_DEFINITIONS } from './actions';
import { ActionCategory } from './actions/categories';
import { FIELD_ROW_LABEL, selectClassName } from './fields/fieldLayout';
import { ActionDefinition, ActionType } from './types';

type ActionTypeSelectProps = {
  id: string;
  value: ActionType | '';
  allowedActionTypes?: ActionType[];
  readOnly: boolean;
  onChange: (type: ActionType | '') => void;
};

export function ActionTypeSelect({ id, value, allowedActionTypes, readOnly, onChange }: ActionTypeSelectProps) {
  const allEntries = Object.entries(ACTION_DEFINITIONS) as [ActionType, ActionDefinition][];

  return (
    <>
      <label className={FIELD_ROW_LABEL} htmlFor={id}>Action Type</label>
      <select
        id={id}
        value={value}
        disabled={readOnly}
        onChange={(event) => onChange(event.target.value as ActionType | '')}
        className={selectClassName(readOnly)}
      >
        <option value="">Select Type</option>
        {Object.values(ActionCategory).map((category) => {
          const entries = allEntries.filter(
            ([type, definition]) => definition.category === category && (!allowedActionTypes || allowedActionTypes.includes(type)),
          );
          if (entries.length === 0) return null;
          return (
            <optgroup key={category} label={category}>
              {entries.map(([type, definition]) => (
                <option key={type} value={type}>{definition.label}</option>
              ))}
            </optgroup>
          );
        })}
      </select>
    </>
  );
}
