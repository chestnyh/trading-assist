import {
  createActionNode,
  getActionConfig,
  getDefaultArguments,
  canActionHaveChildren,
  actionTreeToRuleBody,
  parseRuleBodyToActionTree,
  isParseableRuleBody,
  ACTION_TYPES,
} from './actionTree';

describe('actionTree', () => {
  it('creates an empty action node', () => {
    const node = createActionNode();
    expect(node.type).toBe('');
    expect(node.id).toBeTruthy();
    expect(node.arguments).toEqual({});
  });

  it('creates an action node with default arguments for a given type', () => {
    const node = createActionNode('log');
    expect(node.type).toBe('log');
    expect(node.arguments).toMatchObject({ message: '', level: 'info' });
  });

  it('returns the action config for a known type', () => {
    const config = getActionConfig('log');
    expect(config?.label).toBe('Log');
    expect(config?.category).toBe('Common');
  });

  it('returns undefined for unknown action types', () => {
    expect(getActionConfig('nope' as never)).toBeUndefined();
  });

  it('returns default arguments for a type with optional fields', () => {
    const args = getDefaultArguments('log');
    // optional "data" field with default '' is skipped
    expect(args).not.toHaveProperty('data');
  });

  it('detects action types that can have children', () => {
    expect(canActionHaveChildren('sequence')).toBe(true);
    expect(canActionHaveChildren('log')).toBe(false);
  });

  it('converts an action tree to a rule body', () => {
    const node = createActionNode('log');
    node.arguments = { message: 'hello', level: 'info' };
    const body = actionTreeToRuleBody(node);
    expect(body).toEqual({
      type: 'log',
      arguments: { message: 'hello', level: 'info' },
    });
  });

  it('returns null for an empty action tree', () => {
    expect(actionTreeToRuleBody(createActionNode())).toBeNull();
  });

  it('returns null for an unknown action type', () => {
    const node = createActionNode();
    node.type = 'unknown' as never;
    expect(actionTreeToRuleBody(node)).toBeNull();
  });

  it('parses a rule body back into an action tree', () => {
    const tree = parseRuleBodyToActionTree({
      type: 'log',
      arguments: { message: 'hi', level: 'error' },
    });
    expect(tree).not.toBeNull();
    expect(tree?.type).toBe('log');
    expect(tree?.arguments.message).toBe('hi');
  });

  it('returns null for non-object rule bodies', () => {
    expect(parseRuleBodyToActionTree('log')).toBeNull();
    expect(parseRuleBodyToActionTree(null)).toBeNull();
    expect(parseRuleBodyToActionTree(42)).toBeNull();
  });

  it('returns null for rule bodies with unknown types', () => {
    expect(parseRuleBodyToActionTree({ type: 'wat' })).toBeNull();
  });

  it('ignores legacy name/description fields when parsing', () => {
    const tree = parseRuleBodyToActionTree({
      name: 'My Rule',
      description: 'desc',
      type: 'log',
      arguments: { message: 'hi' },
    });
    expect(tree).not.toBeNull();
    expect(tree?.type).toBe('log');
  });

  it('parses nested sequence/child actions', () => {
    const body = {
      type: 'sequence',
      arguments: {
        do: [{ type: 'log', arguments: { message: 'a' } }],
      },
    };
    const tree = parseRuleBodyToActionTree(body);
    expect(tree).not.toBeNull();
    const children = tree?.arguments.do as Array<{ type: string }>;
    expect(children).toHaveLength(1);
    expect(children[0].type).toBe('log');
  });

  it('returns null when a child action cannot be parsed', () => {
    const body = {
      type: 'sequence',
      arguments: {
        do: [{ type: 'nope' }],
      },
    };
    expect(parseRuleBodyToActionTree(body)).toBeNull();
  });

  it('reports parseability via isParseableRuleBody', () => {
    expect(isParseableRuleBody({ type: 'log', arguments: {} })).toBe(true);
    expect(isParseableRuleBody({ type: 'nope' })).toBe(false);
  });

  it('exposes ACTION_TYPES for the editor', () => {
    expect(ACTION_TYPES.length).toBeGreaterThan(0);
    expect(ACTION_TYPES.some((t) => t.value === 'telegram_send_message')).toBe(true);
  });

  it('serializes nested trees back to rule bodies', () => {
    const body = {
      type: 'parallel',
      arguments: {
        do: [
          { type: 'log', arguments: { message: 'x', level: 'info' } },
          { type: 'log', arguments: { message: 'y', level: 'warn' } },
        ],
      },
    };
    const tree = parseRuleBodyToActionTree(body);
    const roundTrip = actionTreeToRuleBody(tree!);
    expect(roundTrip).toEqual(body);
  });

  it('serializes an empty child slot to an empty array for multiple slots', () => {
    const node = createActionNode('sequence');
    // No children in arguments
    const body = actionTreeToRuleBody(node);
    expect(body).toEqual({ type: 'sequence', arguments: { do: [] } });
  });

  it('serializes an empty child slot to a placeholder for single slots', () => {
    const node = createActionNode('timeout');
    node.arguments.timeout = 90000;
    const body = actionTreeToRuleBody(node) as {
      type: string;
      arguments: { do: unknown };
    };
    expect(body.arguments.do).toBeNull();
  });

  it('serializes a multiple child slot given a single (non-array) value', () => {
    const node = createActionNode('sequence');
    node.arguments.do = createActionNode('log');
    const body = actionTreeToRuleBody(node) as {
      arguments: { do: Array<{ type: string }> };
    };
    expect(Array.isArray(body.arguments.do)).toBe(true);
    expect(body.arguments.do[0].type).toBe('log');
  });

  it('serializes a non-action-node child slot value to a placeholder', () => {
    const node = createActionNode('timeout');
    node.arguments.timeout = 90000;
    node.arguments.do = { not: 'an action' };
    const body = actionTreeToRuleBody(node) as { arguments: { do: unknown } };
    expect(body.arguments.do).toBeNull();
  });

  it('parses a single (non-multiple) child slot', () => {
    const body = {
      type: 'timeout',
      arguments: {
        timeout: 5000,
        do: { type: 'log', arguments: { message: 'a' } },
      },
    };
    const tree = parseRuleBodyToActionTree(body);
    expect(tree).not.toBeNull();
    const child = tree!.arguments.do as { type: string };
    expect(child.type).toBe('log');
  });

  it('returns null when a single child slot cannot be parsed', () => {
    const body = {
      type: 'timeout',
      arguments: {
        timeout: 5000,
        do: { type: 'nope' },
      },
    };
    expect(parseRuleBodyToActionTree(body)).toBeNull();
  });

  it('ignores a missing child slot', () => {
    const body = {
      type: 'timeout',
      arguments: { timeout: 5000 },
    };
    const tree = parseRuleBodyToActionTree(body);
    expect(tree).not.toBeNull();
    expect(tree!.arguments).not.toHaveProperty('do');
  });

  it('parses a multiple child slot given a single object (backward compat)', () => {
    const body = {
      type: 'sequence',
      arguments: {
        do: { type: 'log', arguments: { message: 'single' } },
      },
    };
    const tree = parseRuleBodyToActionTree(body);
    expect(tree).not.toBeNull();
    const children = tree!.arguments.do as Array<{ type: string }>;
    expect(Array.isArray(children)).toBe(true);
    expect(children[0].type).toBe('log');
  });

  it('uses default values for invalid field values (lenient parsing)', () => {
    const body = {
      type: 'timeout',
      arguments: {
        timeout: 'not-a-number',
        do: { type: 'log', arguments: { message: 'a' } },
      },
    };
    const tree = parseRuleBodyToActionTree(body);
    expect(tree).not.toBeNull();
    expect(tree!.arguments.timeout).toBe(90000);
  });

  it('drops invalid string-list values instead of failing', () => {
    const body = {
      type: 'delete_from_heap',
      arguments: {
        keys: 'not-an-array',
      },
    };
    const tree = parseRuleBodyToActionTree(body);
    expect(tree).not.toBeNull();
    // keys field is not optional -> default used
    expect(Array.isArray(tree!.arguments.keys)).toBe(true);
  });
});
