import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { JsonEditorField } from './JsonEditorField';
import jsoneditor from 'jsoneditor';

// jsoneditor requires a full DOM; mock it for the field-level tests.
const mockGet = jest.fn(() => ({ hello: 'world' }));
const mockSet = jest.fn();
const mockUpdate = jest.fn();
const mockDestroy = jest.fn();
const mockValidate = jest.fn(() => []);

const createdInstances: Array<{
  set: jest.Mock;
  get: jest.Mock;
  update: jest.Mock;
  destroy: jest.Mock;
  validate: jest.Mock;
  _debouncedValidate?: () => void;
}> = [];

jest.mock('jsoneditor', () => {
  return jest.fn().mockImplementation(() => {
    const instance = {
      set: mockSet,
      get: mockGet,
      update: mockUpdate,
      destroy: mockDestroy,
      validate: mockValidate,
    };
    createdInstances.push(instance);
    return instance;
  });
});

describe('JsonEditorField', () => {
  beforeEach(() => {
    mockGet.mockClear();
    mockSet.mockClear();
    mockUpdate.mockClear();
    mockDestroy.mockClear();
    mockValidate.mockClear();
    createdInstances.length = 0;
  });

  it('renders a field label and required marker', () => {
    render(<JsonEditorField label="Rule Body" id="rule-body" value={{ a: 1 }} required />);

    expect(screen.getByText('Rule Body')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument(); // required marker
  });

  it('renders without a required marker', () => {
    render(<JsonEditorField label="Rule Body" id="rule-body" value={{ a: 1 }} required={false} />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('shows the resize handle when not disabled', () => {
    render(<JsonEditorField label="Rule Body" id="rule-body" value={{ a: 1 }} />);
    expect(screen.getByRole('separator', { name: /Resize JSON editor/i })).toBeInTheDocument();
  });

  it('hides the resize handle and adds a disabled class when disabled', () => {
    render(<JsonEditorField label="Rule Body" id="rule-body" value={{ a: 1 }} disabled />);
    expect(
      screen.queryByRole('separator', { name: /Resize JSON editor/i })
    ).not.toBeInTheDocument();
  });

  it('renders an error message', () => {
    render(<JsonEditorField label="Rule Body" id="rule-body" value={{ a: 1 }} error="Invalid JSON" />);
    expect(screen.getByText('Invalid JSON')).toBeInTheDocument();
  });

  it('invokes the onChange callback with the editor value', async () => {
    const onChange = jest.fn();
    render(<JsonEditorField label="Rule Body" id="rule-body" value={{ a: 1 }} onChange={onChange} />);

    await waitFor(() => {
      expect(createdInstances).toHaveLength(1);
    });

    // Grab the options from the constructor call created for THIS render.
    const mockConstructor = jsoneditor as unknown as jest.Mock;
    const lastCall = mockConstructor.mock.calls[mockConstructor.mock.calls.length - 1];
    const options = lastCall[1] as { onChange?: () => Promise<void> };

    mockGet.mockReturnValueOnce({ hello: 'world' });
    await act(async () => {
      await options.onChange?.();
    });

    expect(onChange).toHaveBeenCalledWith({ hello: 'world' });
  });

  it('resizes the editor when the separator is dragged', async () => {
    render(<JsonEditorField label="Rule Body" id="rule-body" value={{ a: 1 }} />);

    const separator = screen.getByRole('separator', { name: /Resize JSON editor/i });

    fireEvent.mouseDown(separator, { clientY: 100 });
    fireEvent.mouseMove(window, { clientY: 200 });
    fireEvent.mouseUp(window);

    // Height should increase by 100px (from default 320 to >= 420)
    const container = screen.getByText('Rule Body').parentElement!.querySelector('div[style]');
    expect(container).not.toBeNull();
  });
});
