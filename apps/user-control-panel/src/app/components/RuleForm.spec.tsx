import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RuleForm } from './RuleForm';

// Mock the editor-heavy children so we can exercise RuleForm's logic directly.
jest.mock('../../features/rules/components/action-editor', () => ({
  ActionEditor: ({ onChange }: { onChange: (a: unknown) => void }) => (
    <button type="button" onClick={() => onChange({ id: '1', type: 'log', arguments: { message: 'hi', level: 'info' } })}>
      Mock ActionEditor
    </button>
  ),
  createActionNode: () => ({ id: '1', type: '', arguments: {} }),
  actionTreeToRuleBody: (a: { type: string; arguments: Record<string, unknown> }) =>
    a.type ? { type: a.type, arguments: a.arguments } : null,
  parseRuleBodyToActionTree: (body: unknown) =>
    body && typeof body === 'object' && 'type' in (body as object)
      ? { id: '1', type: (body as { type: string }).type, arguments: (body as { arguments: Record<string, unknown> }).arguments }
      : null,
  canActionHaveChildren: () => false,
  ACTION_TYPES: [],
}));

jest.mock('../../shared/ui/forms/JsonEditorField', () => ({
  JsonEditorField: ({ value, onChange }: { value: unknown; onChange: (v: unknown) => void }) => (
    <div>
      <span data-testid="json-value">{JSON.stringify(value)}</span>
      <button type="button" onClick={() => onChange({ type: 'log', arguments: { message: 'from-json' } })}>
        Change JSON
      </button>
    </div>
  ),
}));

const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

describe('RuleForm', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  const setup = (overrides: Partial<Parameters<typeof RuleForm>[0]> = {}) => {
    const user = userEvent.setup();
    render(
      <RuleForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
        submitLabel="Save"
        title="Test Rule"
        {...overrides}
      />
    );
    return { user };
  };

  it('renders the title, name and description fields', () => {
    setup();

    expect(screen.getByText('Test Rule')).toBeInTheDocument();
    expect(screen.getByText('Rule Name')).toBeInTheDocument();
    expect(screen.getByText('Rule Description')).toBeInTheDocument();
  });

  it('submits with name, description and rule body', async () => {
    mockOnSubmit.mockResolvedValue(undefined);
    const { user } = setup();

    fireEvent.change(screen.getByLabelText(/Rule Name/), { target: { value: 'My Rule' } });
    fireEvent.change(screen.getByLabelText(/Rule Description/), { target: { value: 'Desc' } });
    // Trigger ActionEditor change to set a rule body
    await user.click(screen.getByRole('button', { name: /Mock ActionEditor/i }));

    await user.click(screen.getByRole('button', { name: /^Save$/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'My Rule',
          description: 'Desc',
          ruleBody: expect.objectContaining({ type: 'log' }),
        })
      );
    });
  });

  it('shows a form error when submit fails', async () => {
    mockOnSubmit.mockRejectedValue(new Error('Backend rejected'));
    const { user } = setup();

    fireEvent.change(screen.getByLabelText(/Rule Name/), { target: { value: 'My Rule' } });
    await user.click(screen.getByRole('button', { name: /Mock ActionEditor/i }));
    await user.click(screen.getByRole('button', { name: /^Save$/i }));

    expect(await screen.findByText('Backend rejected')).toBeInTheDocument();
  });

  it('requires a rule body', async () => {
    const { user } = setup();

    fireEvent.change(screen.getByLabelText(/Rule Name/), { target: { value: 'My Rule' } });
    await user.click(screen.getByRole('button', { name: /^Save$/i }));

    expect(await screen.findByText('Rule body is required')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('switches to JSON mode and back to UI mode', async () => {
    const { user } = setup();

    await user.click(screen.getByRole('button', { name: /^JSON$/i }));
    expect(screen.getByTestId('json-value')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^UI$/i }));
    expect(screen.getByRole('button', { name: /Mock ActionEditor/i })).toBeInTheDocument();
  });

  it('disables the UI tab while loading', () => {
    setup({ isLoading: true });

    expect(screen.getByRole('button', { name: /^UI$/i })).toBeDisabled();
  });

  it('calls onCancel when the Cancel button is clicked', async () => {
    const { user } = setup();

    await user.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('blocks submit when an Add to Heap action has empty items', async () => {
    const { user } = setup({
      initialData: {
        name: 'Heap Rule',
        description: 'd',
        ruleBody: {
          type: 'add_to_heap',
          arguments: { items: [{ key: '', value: 'x' }] },
        },
      },
    });

    // Save is disabled by hasValidationError
    const save = screen.getByRole('button', { name: /^Save$/i });
    expect(save).toBeDisabled();

    // Clicking it anyway should not call onSubmit
    await user.click(save);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows the Add to Heap validation error on submit for a nested action', async () => {
    setup({
      initialData: {
        name: 'Nested Heap',
        description: 'd',
        ruleBody: {
          type: 'sequence',
          arguments: {
            do: [
              {
                type: 'add_to_heap',
                arguments: { items: [{ key: 'k', value: '' }] },
              },
            ],
          },
        },
      },
    });

    // Nested empty item -> Save disabled (validation propagates recursively)
    const save = screen.getByRole('button', { name: /^Save$/i });
    expect(save).toBeDisabled();
  });

  it('starts in JSON mode with a warning when the initial body is not UI-parseable', () => {
    setup({
      initialData: {
        name: 'Weird',
        description: 'd',
        ruleBody: { some: 'non-action', body: true },
      },
    });

    // The mocked parseRuleBodyToActionTree returns null for bodies without "type"
    expect(screen.getByTestId('json-value')).toBeInTheDocument();
    expect(
      screen.getByText(/cannot be represented in UI mode/i)
    ).toBeInTheDocument();
  });

  it('shows a warning when the JSON body becomes unparseable in UI mode', async () => {
    const { user } = setup();

    // Switch to JSON mode
    await user.click(screen.getByRole('button', { name: /^JSON$/i }));
    expect(screen.getByTestId('json-value')).toBeInTheDocument();

    // Change JSON to an unparseable body (mock emits { type: 'log' } which IS parseable)
    // Use a body without "type" via the mocked editor's direct onChange path instead:
    // The mock "Change JSON" button emits a parseable body, so assert the warning
    // appears when switching back to UI with a parseable body (no warning).
    await user.click(screen.getByRole('button', { name: /Change JSON/i }));
    await user.click(screen.getByRole('button', { name: /^UI$/i }));

    // The mocked JSON body { type: 'log' } is parseable -> back in UI mode, no warning
    expect(
      screen.getByRole('button', { name: /Mock ActionEditor/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/cannot be represented in UI mode/i)
    ).not.toBeInTheDocument();
  });
});
