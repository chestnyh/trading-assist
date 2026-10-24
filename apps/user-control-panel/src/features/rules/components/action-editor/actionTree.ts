import { ACTION_DEFINITIONS } from './actions';
import { ActionDefinition, ActionNode, ActionType } from './types';

export function createActionNode(type: ActionNode['type'] = ''): ActionNode {
  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    arguments: getDefaultArguments(type),
  };
}

export function getActionDefinition(type: unknown): ActionDefinition | undefined {
  return isActionType(type) ? ACTION_DEFINITIONS[type] : undefined;
}

export function getDefaultArguments(type: ActionNode['type']): Record<string, unknown> {
  return cloneValue(getActionDefinition(type)?.defaultArguments ?? {});
}

export function actionTreeToRuleBody(action: ActionNode): unknown {
  if (!action.type) {
    return null;
  }

  const definition = getActionDefinition(action.type);
  if (!definition) {
    return null;
  }

  const args: Record<string, unknown> = {};

  for (const [key, defaultValue] of Object.entries(definition.defaultArguments)) {
    args[key] = action.arguments[key] ?? cloneValue(defaultValue);
  }

  for (const key of definition.optionalArguments ?? []) {
    const value = action.arguments[key];
    if (value !== '' && value !== undefined && value !== null) {
      args[key] = value;
    }
  }

  for (const slot of definition.childSlots ?? []) {
    const value = action.arguments[slot.key];
    if (!value) {
      args[slot.key] = slot.multiple ? [] : createActionBodyPlaceholder();
      continue;
    }

    if (slot.multiple) {
      const children = Array.isArray(value) ? value : [value];
      args[slot.key] = children
        .filter(isActionNode)
        .map(actionTreeToRuleBody)
        .filter(Boolean);
      continue;
    }

    args[slot.key] = isActionNode(value) ? actionTreeToRuleBody(value) : createActionBodyPlaceholder();
  }

  return {
    type: action.type,
    arguments: args,
  };
}

export function parseRuleBodyToActionTree(ruleBody: unknown): ActionNode | null {
  if (!isRecord(ruleBody)) {
    
    return null;
  }

  const type = ruleBody.type;
  if (!isActionType(type)) {
    return null;
  }

  const definition = ACTION_DEFINITIONS[type];

  const sourceArgs = isRecord(ruleBody.arguments) ? ruleBody.arguments : {};
  const args: Record<string, unknown> = {};

  // Fall back to the default instead of failing, to be lenient with old configs
  for (const [key, defaultValue] of Object.entries(definition.defaultArguments)) {
    const value = sourceArgs[key];
    args[key] = isSameKind(value, defaultValue) ? value : cloneValue(defaultValue);
  }

  for (const key of definition.optionalArguments ?? []) {
    const value = sourceArgs[key];
    if (typeof value === 'string') {
      args[key] = value;
    }
  }

  for (const slot of definition.childSlots ?? []) {
    const value = sourceArgs[slot.key];
    if (value === undefined || value === null) {
      continue;
    }

    if (slot.multiple) {
      // Accept both single object and array for backward compatibility
      const items = Array.isArray(value) ? value : [value];
      const children = items.map(parseRuleBodyToActionTree);
      if (children.some(child => child === null)) {
        return null;
      }
      args[slot.key] = children as ActionNode[];
      continue;
    }

    const child = parseRuleBodyToActionTree(value);
    if (!child) {
      return null;
    }
    args[slot.key] = child;
  }

  return {
    id: createActionNode().id,
    type,
    arguments: args,
  };
}

function isActionType(value: unknown): value is ActionType {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(ACTION_DEFINITIONS, value);
}

export function isActionNode(value: unknown): value is ActionNode {
  return isRecord(value) && 'type' in value && 'arguments' in value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSameKind(value: unknown, defaultValue: unknown): boolean {
  if (Array.isArray(defaultValue)) {
    return Array.isArray(value);
  }

  if (typeof defaultValue === 'number') {
    return typeof value === 'number' && Number.isFinite(value);
  }

  return typeof value === typeof defaultValue;
}

function cloneValue<T>(value: T): T {
  if (value === undefined || value === null) {
    return value;
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

function createActionBodyPlaceholder(): unknown {
  return actionTreeToRuleBody(createActionNode());
}
