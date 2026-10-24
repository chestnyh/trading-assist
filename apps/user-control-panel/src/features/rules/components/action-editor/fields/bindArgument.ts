import { ActionComponentProps } from '../types';

export function bindArgument({ action, readOnly, setArgument }: ActionComponentProps, key: string) {
  return {
    id: `action-${key}-${action.id}`,
    value: action.arguments[key],
    readOnly,
    onChange: (value: unknown) => setArgument(key, value),
  };
}
