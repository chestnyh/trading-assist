import { render, screen } from '@testing-library/react';
import { Alert } from '../feedback/Alert';
import { ErrorAlert } from '../feedback/ErrorAlert';
import { Input } from './Input';
import { Radio } from './Radio';
import { Select } from './Select';
import { TextArea } from './TextArea';
import userEvent from '@testing-library/user-event';

describe('Alert', () => {
  it('renders the generic error message', () => {
    render(<Alert />);
    expect(
      screen.getByText(/An unexpected error has occurred/i)
    ).toBeInTheDocument();
  });
});

describe('ErrorAlert', () => {
  it('renders nothing without a message', () => {
    const { container } = render(<ErrorAlert message={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the message', () => {
    render(<ErrorAlert message="Something broke" />);
    expect(screen.getByText('Something broke')).toBeInTheDocument();
  });
});

describe('Input', () => {
  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(
      <Input label="Password" id="pwd" name="pwd" type="password" placeholder="Secret" />
    );

    const input = screen.getByPlaceholderText('Secret') as HTMLInputElement;
    expect(input).toHaveAttribute('type', 'password');

    // Button aria-labels are inverted: it shows what will happen when clicked
    await user.click(screen.getByRole('button', { name: /Hide password/i }));
    expect(input).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: /Show password/i }));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('does not render the toggle when disabled', () => {
    render(
      <Input label="Password" id="pwd" name="pwd" type="password" placeholder="Secret" disabled />
    );
    expect(screen.queryByRole('button', { name: /Show password/i })).not.toBeInTheDocument();
  });

  it('renders a field error', () => {
    render(<Input label="Email" id="email" name="email" error="Email is invalid" />);
    expect(screen.getByText('Email is invalid')).toBeInTheDocument();
  });
});

describe('Radio', () => {
  it('renders options and checks the selected one', () => {
    render(
      <Radio
        label="Level"
        name="level"
        options={[
          { value: 'beginner', label: 'Beginner' },
          { value: 'advanced', label: 'Advanced' },
        ]}
        value="advanced"
      />
    );

    expect(screen.getByLabelText('Beginner')).not.toBeChecked();
    expect(screen.getByLabelText('Advanced')).toBeChecked();
  });
});

describe('Select', () => {
  it('renders options and a placeholder', () => {
    render(
      <Select
        label="Platform"
        id="platform"
        name="platform"
        options={[{ value: 'binance', label: 'Binance' }]}
        placeholder="Choose..."
      />
    );

    expect(screen.getByText('Choose...')).toBeInTheDocument();
    expect(screen.getByText('Binance')).toBeInTheDocument();
  });

  it('renders an error message', () => {
    render(
      <Select
        label="Platform"
        id="platform"
        name="platform"
        options={[{ value: 'binance', label: 'Binance' }]}
        error="Required"
      />
    );
    expect(screen.getByText('Required')).toBeInTheDocument();
  });
});

describe('TextArea', () => {
  it('renders with a value and passes change events', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(
      <TextArea label="Description" id="desc" name="desc" value="" onChange={onChange} rows={3} />
    );

    await user.type(screen.getByLabelText(/Description/i), 'text');
    expect(onChange).toHaveBeenCalled();
  });

  it('renders a required marker and an error message', () => {
    render(
      <TextArea
        label="Description"
        id="desc"
        name="desc"
        required
        error="Too short"
      />
    );

    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByText('Too short')).toBeInTheDocument();
  });

  it('disables the textarea when disabled', () => {
    render(<TextArea label="Description" id="desc" name="desc" disabled />);

    expect(screen.getByLabelText(/Description/i)).toBeDisabled();
  });
});
