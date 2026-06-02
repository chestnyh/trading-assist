import { ACTION_TYPES } from './actionDefinitions';
import { ActionNode, ActionType, ActionTypeConfig } from './types';

export { ACTION_TYPES } from './actionDefinitions';

export function createActionNode(type: ActionType = ''): ActionNode {
  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    arguments: getDefaultArguments(type),
  };
}

export function getActionConfig(type: ActionType): ActionTypeConfig | undefined {
  return ACTION_TYPES.find(actionType => actionType.value === type);
}

export function getDefaultArguments(type: ActionType): Record<string, unknown> {
  const config = getActionConfig(type);
  if (!config) {
    return {};
  }

  const result: Record<string, unknown> = {};
  for (const field of config.fields ?? []) {
    if (!field.optional || field.defaultValue !== '') {
      result[field.key] = cloneValue(field.defaultValue);
    }
  }

  return result;
}

export function canActionHaveChildren(type: ActionType): boolean {
  return Boolean(getActionConfig(type)?.childSlots?.length);
}

export function actionTreeToRuleBody(action: ActionNode): unknown {
  if (!action.type) {
    return null;
  }

  const config = getActionConfig(action.type);
  if (!config) {
    return null;
  }

  const args: Record<string, unknown> = {};

  for (const field of config.fields ?? []) {
    const value = action.arguments[field.key];
    if (field.optional && (value === '' || value === undefined || value === null)) {
      continue;
    }
    args[field.key] = value ?? cloneValue(field.defaultValue);
  }

  for (const slot of config.childSlots ?? []) {
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
    console.log('[parseRuleBodyToActionTree] Failed: not a record', ruleBody);
    return null;
  }

  const type = ruleBody.type;
  if (!isActionType(type)) {
    console.log('[parseRuleBodyToActionTree] Failed: unknown action type', type, 'Available types:', ACTION_TYPES.map(t => t.value));
    return null;
  }

  const config = getActionConfig(type);
  if (!config) {
    return null;
  }

  const sourceArgs = isRecord(ruleBody.arguments) ? ruleBody.arguments : {};
  const args: Record<string, unknown> = {};

  // Ignore legacy fields like 'name' and 'description' that might be in the rule body
  const ignoredFields = ['name', 'description'];

  for (const field of config.fields ?? []) {
    const value = sourceArgs[field.key];
    if (value === undefined) {
      if (!field.optional) {
        args[field.key] = cloneValue(field.defaultValue);
      }
      continue;
    }

    // Skip validation for unknown fields to be more lenient with old configs
    if (!isValidFieldValue(field.type, value)) {
      // If the field doesn't match expected type, use default value instead of failing
      if (!field.optional) {
        args[field.key] = cloneValue(field.defaultValue);
      }
      continue;
    }

    args[field.key] = value;
  }

  for (const slot of config.childSlots ?? []) {
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
    id: createActionNode(type).id,
    type,
    arguments: args,
  };
}

export function isParseableRuleBody(ruleBody: unknown): boolean {
  return parseRuleBodyToActionTree(ruleBody) !== null;
}

function isActionType(value: unknown): value is Exclude<ActionType, ''> {
  return typeof value === 'string' && ACTION_TYPES.some(actionType => actionType.value === value);
}

function isActionNode(value: unknown): value is ActionNode {
  return isRecord(value) && 'type' in value && 'arguments' in value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidFieldValue(type: string, value: unknown): boolean {
  if (type === 'text' || type === 'select') {
    return typeof value === 'string';
  }

  if (type === 'number') {
    return typeof value === 'number' && Number.isFinite(value);
  }

  if (type === 'keyValueList' || type === 'stringList') {
    return Array.isArray(value);
  }

  return true;
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
