import { ActionNode, ActionTypeConfig } from './types';

export const ACTION_TYPES: ActionTypeConfig[] = [
  { value: 'interval', label: 'Interval', canHaveChildren: true },
  { value: 'timeout', label: 'Timeout', canHaveChildren: true },
  { value: 'debug', label: 'Debug', canHaveChildren: false },
];

export function createActionNode(type: ActionNode['type'] = ''): ActionNode {
  return {
    id: Math.random().toString(36).substr(2, 9),
    type,
    arguments: getDefaultArguments(type),
  };
}

export function getDefaultArguments(type: ActionNode['type']): ActionNode['arguments'] {
  if (type === 'interval') {
    return { interval: 1000 };
  }

  if (type === 'timeout') {
    return { timeout: 90000 };
  }

  if (type === 'debug') {
    return { message: '' };
  }

  return {};
}

export function canActionHaveChildren(type: ActionNode['type']): boolean {
  return ACTION_TYPES.some(actionType => actionType.value === type && actionType.canHaveChildren);
}

export function actionTreeToRuleBody(action: ActionNode): unknown {
  if (!action.type) {
    return null;
  }

  const result: { type: string; arguments: Record<string, unknown> } = {
    type: action.type,
    arguments: {},
  };

  if (action.type === 'interval') {
    result.arguments.interval = action.arguments.interval ?? 1000;
  }

  if (action.type === 'timeout') {
    result.arguments.timeout = action.arguments.timeout ?? 90000;
  }

  if (action.type === 'debug') {
    result.arguments.message = action.arguments.message ?? '';
  }

  if (canActionHaveChildren(action.type) && action.arguments.do) {
    result.arguments.do = Array.isArray(action.arguments.do)
      ? action.arguments.do.map(actionTreeToRuleBody)
      : actionTreeToRuleBody(action.arguments.do);
  }

  return result;
}

export function parseRuleBodyToActionTree(ruleBody: unknown): ActionNode | null {
  if (!isRecord(ruleBody)) {
    return null;
  }

  const type = ruleBody.type;
  if (type !== 'interval' && type !== 'timeout' && type !== 'debug') {
    return null;
  }

  const args = isRecord(ruleBody.arguments) ? ruleBody.arguments : {};
  const action: ActionNode = {
    id: createActionNode(type).id,
    type,
    arguments: {},
  };

  if (type === 'interval') {
    if (args.interval !== undefined && typeof args.interval !== 'number') {
      return null;
    }
    action.arguments.interval = args.interval ?? 1000;
  }

  if (type === 'timeout') {
    if (args.timeout !== undefined && typeof args.timeout !== 'number') {
      return null;
    }
    action.arguments.timeout = args.timeout ?? 90000;
  }

  if (type === 'debug') {
    if (args.message !== undefined && typeof args.message !== 'string') {
      return null;
    }
    action.arguments.message = args.message ?? '';
    return action;
  }

  if (args.do !== undefined) {
    if (Array.isArray(args.do)) {
      const children = args.do.map(parseRuleBodyToActionTree);
      if (children.some(child => child === null)) {
        return null;
      }
      action.arguments.do = children as ActionNode[];
    } else {
      const child = parseRuleBodyToActionTree(args.do);
      if (!child) {
        return null;
      }
      action.arguments.do = child;
    }
  }

  return action;
}

export function isParseableRuleBody(ruleBody: unknown): boolean {
  return parseRuleBodyToActionTree(ruleBody) !== null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
