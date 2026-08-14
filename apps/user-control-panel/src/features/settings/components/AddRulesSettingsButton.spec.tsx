import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddRulesSettingsButton from './AddRulesSettingsButton';

describe('AddRulesSettingsButton', () => {
  it('renders the label and calls onClick', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();
    render(<AddRulesSettingsButton onClick={onClick} />);

    const button = screen.getByRole('button', { name: /Add settings rules/i });
    expect(button).not.toBeDisabled();

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disables the button when disabled', () => {
    render(<AddRulesSettingsButton disabled />);

    expect(
      screen.getByRole('button', { name: /Add settings rules/i })
    ).toBeDisabled();
  });
});
