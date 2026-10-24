import { ComponentType } from 'react';
import type { ACTION_DEFINITIONS } from './actions';
import type { ActionCategory } from './actions/categories';

export type ActionType = keyof typeof ACTION_DEFINITIONS;

export type ActionNode = {
  id: string;
  // '' while no action type has been picked yet
  type: ActionType | '';
  arguments: Record<string, unknown>;
};

export type ActionChildSlot = {
  key: string;
  label: string;
  multiple: boolean;
  allowedActionTypes?: ActionType[];
};

export type ActionComponentProps = {
  action: ActionNode;
  readOnly: boolean;
  depth: number;
  setArgument: (key: string, value: unknown) => void;
};

export type ActionDefinition = {
  label: string;
  category: ActionCategory;
  // Required arguments; a stored value of a different kind is replaced by the default when parsing.
  defaultArguments: Record<string, unknown>;
  // String arguments that are left out of the rule body when empty.
  optionalArguments?: string[];
  childSlots?: ActionChildSlot[];
  Component: ComponentType<ActionComponentProps>;
};
