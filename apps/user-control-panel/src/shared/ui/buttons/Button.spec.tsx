import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders a primary button by default with text', () => {
    render(<Button text="Save" />);

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
  });

  it('renders each variant without error', () => {
    const { rerender } = render(<Button text="V" variant="primary" />);
    expect(screen.getByRole('button', { name: 'V' })).toBeInTheDocument();

    rerender(<Button text="V" variant="outline" />);
    expect(screen.getByRole('button', { name: 'V' })).toBeInTheDocument();

    rerender(<Button text="V" variant="error" />);
    expect(screen.getByRole('button', { name: 'V' })).toBeInTheDocument();

    rerender(<Button text="V" variant="text" />);
    expect(screen.getByRole('button', { name: 'V' })).toBeInTheDocument();
  });

  it('disables the button when disabled is set', () => {
    render(<Button text="Save" disabled />);

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('calls onClick when clicked', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();
    render(<Button text="Go" onClick={onClick} />);

    await user.click(screen.getByRole('button', { name: 'Go' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders left and right icons', () => {
    render(<Button text="Go" leftIcon={<span>L</span>} rightIcon={<span>R</span>} />);

    expect(screen.getByText('L')).toBeInTheDocument();
    expect(screen.getByText('R')).toBeInTheDocument();
  });

  it('supports the submit type', () => {
    render(<Button text="Submit" type="submit" />);

    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute(
      'type',
      'submit'
    );
  });
});
