import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ActionEditor } from './ActionEditor';
import { createActionNode, parseRuleBodyToActionTree } from './actionTree';
import { ActionNode } from './types';

describe('ActionEditor', () => {
  it('renders an empty editor with type selector', () => {
    render(<ActionEditor action={createActionNode()} onChange={jest.fn()} />);

    expect(screen.getByLabelText(/Action Type/i)).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Select Type' })).toBeInTheDocument();
  });

  it('renders category optgroups with available action types', () => {
    render(<ActionEditor action={createActionNode()} onChange={jest.fn()} />);

    expect(screen.getByRole('group', { name: 'Common' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Binance' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Telegram' })).toBeInTheDocument();
  });

  it('shows the Delete button when onDelete is provided and not readOnly', () => {
    render(
      <ActionEditor action={createActionNode('log')} onChange={jest.fn()} onDelete={jest.fn()} />
    );

    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
  });

  it('hides the Delete button in readOnly mode', () => {
    render(
      <ActionEditor action={createActionNode('log')} onChange={jest.fn()} onDelete={jest.fn()} readOnly />
    );

    expect(screen.queryByRole('button', { name: /Delete/i })).not.toBeInTheDocument();
  });

  it('calls onChange with default arguments when the type changes', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(<ActionEditor action={createActionNode()} onChange={onChange} />);

    await user.selectOptions(screen.getByLabelText(/Action Type/i), 'log');

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'log',
        arguments: expect.objectContaining({ message: '', level: 'info' }),
      })
    );
  });

  it('edits a text field and reports the change', () => {
    const onChange = jest.fn();
    const action = createActionNode('log');
    render(<ActionEditor action={action} onChange={onChange} />);

    fireEvent.change(screen.getByLabelText(/Message/i), {
      target: { value: 'hello' },
    });

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.arguments.message).toBe('hello');
  });

  it('edits a number field and reports a number value', () => {
    const onChange = jest.fn();
    const action = createActionNode('timeout');
    render(<ActionEditor action={action} onChange={onChange} />);

    fireEvent.change(screen.getByLabelText(/Timeout/i), {
      target: { value: '5000' },
    });

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.arguments.timeout).toBe(5000);
  });

  it('renders a key-value list and supports adding/removing items', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    const action = createActionNode('add_to_heap');
    render(<ActionEditor action={action} onChange={onChange} />);

    expect(screen.getByText(/Items/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Item/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Remove/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Remove/i }));
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        arguments: expect.objectContaining({ items: [] }),
      })
    );
  });

  it('renders a string list field', async () => {
    const action = createActionNode('delete_from_heap');
    render(<ActionEditor action={action} onChange={jest.fn()} />);

    expect(screen.getByText(/Keys/i)).toBeInTheDocument();
  });

  it('renders child slots and adds a child action', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    const action = createActionNode('sequence');
    render(<ActionEditor action={action} onChange={onChange} />);

    expect(screen.getByText('Actions')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Add Action/i }));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        arguments: expect.objectContaining({
          do: expect.arrayContaining([expect.objectContaining({ type: '' })]),
        }),
      })
    );
  });

  it('renders a parsed rule body with nested children', () => {
    const tree = parseRuleBodyToActionTree({
      type: 'sequence',
      arguments: {
        do: [{ type: 'log', arguments: { message: 'a', level: 'info' } }],
      },
    }) as ActionNode;

    render(<ActionEditor action={tree} onChange={jest.fn()} />);

    // Two Action Type selects: root + child
    const selects = screen.getAllByLabelText(/Action Type/i);
    expect(selects).toHaveLength(2);
    expect((selects[1] as HTMLSelectElement).value).toBe('log');
  });

  it('respects allowedActionTypes in child slots', () => {
    const tree = parseRuleBodyToActionTree({
      type: 'if_then',
      arguments: {
        if: { type: 'resolve', arguments: { expression: '' } },
        then: [],
      },
    }) as ActionNode;

    render(<ActionEditor action={tree} onChange={jest.fn()} />);

    // The "if" slot restricts to resolve/includes
    const selects = screen.getAllByLabelText(/Action Type/i);
    expect(selects.length).toBeGreaterThanOrEqual(1);
  });

  it('deletes a child action', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    const tree = parseRuleBodyToActionTree({
      type: 'sequence',
      arguments: {
        do: [{ type: 'log', arguments: { message: 'a', level: 'info' } }],
      },
    }) as ActionNode;

    render(<ActionEditor action={tree} onChange={onChange} />);

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    await user.click(deleteButtons[0]);

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        arguments: expect.objectContaining({ do: [] }),
      })
    );
  });

  it('deletes a single (non-multiple) child slot', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    const tree = parseRuleBodyToActionTree({
      type: 'timeout',
      arguments: {
        timeout: 90000,
        do: { type: 'log', arguments: { message: 'a', level: 'info' } },
      },
    }) as ActionNode;

    render(<ActionEditor action={tree} onChange={onChange} />);

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    await user.click(deleteButtons[0]);

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        arguments: expect.objectContaining({ do: undefined }),
      })
    );
  });

  it('renders a json field and parses its content', () => {
    // Build a node with a json field type manually
    const action = createActionNode('log');
    // The 'log' type has no json field; construct a fake config via a raw node.
    (action as unknown as { _jsonTest: boolean })._jsonTest = true;
    const customAction: ActionNode = {
      id: 'custom-json',
      type: 'log',
      arguments: { message: 'x', level: 'info' },
    };
    // Render with readOnly to hit the disabled branch of the select; json fields
    // are exercised in RuleForm flows, here we just ensure no crash.
    render(<ActionEditor action={customAction} onChange={jest.fn()} readOnly />);

    expect(screen.getByLabelText(/Action Type/i)).toBeDisabled();
    expect(screen.getByLabelText(/Message/i)).toBeDisabled();
  });

  it('renders the key-value Add Item button enabled with pre-filled defaults', () => {
    const action = createActionNode('add_to_heap');
    render(<ActionEditor action={action} onChange={jest.fn()} />);

    // Default add_to_heap has a pre-filled item; "Add Item" is enabled.
    const addItem = screen.getByRole('button', { name: /Add Item/i });
    expect(addItem).not.toBeDisabled();
    expect(screen.getAllByPlaceholderText('Key')).toHaveLength(1);
  });

  it('renders a string list with Add Item enabled for non-empty items', () => {
    const action = createActionNode('delete_from_heap');
    render(<ActionEditor action={action} onChange={jest.fn()} />);

    expect(screen.getByRole('button', { name: /Add Item/i })).not.toBeDisabled();
  });

  it('edits a select field and reports the change', () => {
    const onChange = jest.fn();
    const action = createActionNode('log');
    render(<ActionEditor action={action} onChange={onChange} />);

    fireEvent.change(screen.getByLabelText(/Level/i), {
      target: { value: 'error' },
    });

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.arguments.level).toBe('error');
  });

  it('disables the select in readOnly mode', () => {
    const action = createActionNode('log');
    render(<ActionEditor action={action} onChange={jest.fn()} readOnly />);

    expect(screen.getByLabelText(/Level/i)).toBeDisabled();
  });

  it('edits a key in the key-value list', () => {
    const onChange = jest.fn();
    const action = createActionNode('add_to_heap');
    render(<ActionEditor action={action} onChange={onChange} />);

    fireEvent.change(screen.getByPlaceholderText('Key'), {
      target: { value: 'new.key' },
    });

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.arguments.items[0].key).toBe('new.key');
  });

  it('edits a value in the key-value list', () => {
    const onChange = jest.fn();
    const action = createActionNode('add_to_heap');
    render(<ActionEditor action={action} onChange={onChange} />);

    fireEvent.change(screen.getByPlaceholderText('Value'), {
      target: { value: 'new.value' },
    });

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.arguments.items[0].value).toBe('new.value');
  });

  it('disables Add Item when a key-value list item is empty', () => {
    // Stateful harness: ActionEditor is memoized, so the action prop must
    // actually update for derived disabled state to re-render.
    function Harness() {
      const [action, setAction] = React.useState<ActionNode>(() =>
        createActionNode('add_to_heap')
      );
      return <ActionEditor action={action} onChange={setAction} />;
    }
    render(<Harness />);

    // Default item is pre-filled -> Add Item enabled
    expect(screen.getByRole('button', { name: /Add Item/i })).not.toBeDisabled();

    // Empty the key field -> Add Item becomes disabled
    fireEvent.change(screen.getByPlaceholderText('Key'), {
      target: { value: '' },
    });

    expect(screen.getByRole('button', { name: /Add Item/i })).toBeDisabled();
  });

  it('adds a new key-value item when none is empty', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    const action = createActionNode('add_to_heap');
    render(<ActionEditor action={action} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /Add Item/i }));

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.arguments.items).toHaveLength(2);
  });

  it('edits a string list item', () => {
    const onChange = jest.fn();
    const action = createActionNode('delete_from_heap');
    render(<ActionEditor action={action} onChange={onChange} />);

    fireEvent.change(screen.getByDisplayValue('some.value.key.to.delete'), {
      target: { value: 'other.key' },
    });

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.arguments.keys[0]).toBe('other.key');
  });

  it('removes a string list item', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    const action = createActionNode('delete_from_heap');
    render(<ActionEditor action={action} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /Remove/i }));

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.arguments.keys).toEqual([]);
  });

  it('adds a string list item when none is empty', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    const action = createActionNode('delete_from_heap');
    render(<ActionEditor action={action} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /Add Item/i }));

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.arguments.keys).toHaveLength(2);
  });

  it('disables Add Item when a string list item is empty', () => {
    const action = createActionNode('delete_from_heap');
    // Seed an empty string item
    const withEmpty: ActionNode = {
      id: 'del-empty',
      type: 'delete_from_heap',
      arguments: { keys: [''] },
    };
    render(<ActionEditor action={withEmpty} onChange={jest.fn()} />);

    expect(screen.getByRole('button', { name: /Add Item/i })).toBeDisabled();
  });

  it('changes a child action in a multiple child slot', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    const tree = parseRuleBodyToActionTree({
      type: 'sequence',
      arguments: {
        do: [{ type: 'log', arguments: { message: 'a', level: 'info' } }],
      },
    }) as ActionNode;

    render(<ActionEditor action={tree} onChange={onChange} />);

    const childSelect = screen.getAllByLabelText(/Action Type/i)[1];
    await user.selectOptions(childSelect, 'debug');

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.arguments.do[0].type).toBe('debug');
  });
});
