import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmationModal } from './ConfirmationModal';
import { CheckboxGroup } from '../forms/CheckboxGroup';

describe('ConfirmationModal', () => {
  const onClose = jest.fn();
  const onConfirm = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
    onConfirm.mockClear();
    document.body.style.overflow = '';
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <ConfirmationModal isOpen={false} onClose={onClose} onConfirm={onConfirm} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the dialog with title, message and buttons when open', () => {
    render(
      <ConfirmationModal isOpen onClose={onClose} onConfirm={onConfirm} title="Delete?" message="Are you sure?" />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Delete?')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('calls onConfirm when the confirm button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ConfirmationModal isOpen onClose={onClose} onConfirm={onConfirm} />
    );

    await user.click(screen.getByRole('button', { name: /Delete/i }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('closes on Escape and prevents body scroll while open', async () => {
    const user = userEvent.setup();
    render(
      <ConfirmationModal isOpen onClose={onClose} onConfirm={onConfirm} />
    );

    expect(document.body.style.overflow).toBe('hidden');

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('shows a spinner label while loading and disables buttons', () => {
    render(
      <ConfirmationModal isOpen onClose={onClose} onConfirm={onConfirm} isLoading />
    );

    expect(screen.getByRole('button', { name: /Cancel/i })).toBeDisabled();
  });
});

describe('CheckboxGroup', () => {
  const options = [
    { value: 'binance', label: 'Binance' },
    { value: 'kraken', label: 'Kraken' },
  ];

  it('renders options and toggles selection', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(
      <CheckboxGroup label="Platforms" name="platforms" options={options} onChange={onChange} />
    );

    await user.click(screen.getByLabelText('Binance'));
    expect(onChange).toHaveBeenCalledWith(['binance']);

    await user.click(screen.getByLabelText('Kraken'));
    expect(onChange).toHaveBeenCalledWith(['binance', 'kraken']);
  });

  it('renders controlled values', () => {
    render(
      <CheckboxGroup label="Platforms" name="platforms" options={options} value={['kraken']} />
    );

    expect(screen.getByLabelText('Kraken')).toBeChecked();
    expect(screen.getByLabelText('Binance')).not.toBeChecked();
  });

  it('unchecks an option and removes it from the selection', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(
      <CheckboxGroup
        label="Platforms"
        name="platforms"
        options={options}
        value={['binance', 'kraken']}
        onChange={onChange}
      />
    );

    await user.click(screen.getByLabelText('Binance'));
    expect(onChange).toHaveBeenCalledWith(['kraken']);
    expect(screen.getByLabelText('Binance')).not.toBeChecked();
  });
});
