import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Step1Content } from './Step1Content';
import { Step2Content } from './Step2Content';
import { Step3Content } from './Step3Content';
import { customInstance } from '@trading-bot/api-client';

jest.mock('@trading-bot/api-client', () => ({
  customInstance: jest.fn(),
}));

const mockCustomInstance = customInstance as jest.Mock;

const setStep = jest.fn();
const setIsLoading = jest.fn();
const setFormError = jest.fn();
const setEmailError = jest.fn();
const setCodeError = jest.fn();
const setPasswordError = jest.fn();
const setConfirmPasswordError = jest.fn();
const onEmailChange = jest.fn();
const onCodeChange = jest.fn();
const onPasswordChange = jest.fn();
const onConfirmPasswordChange = jest.fn();
const onBack = jest.fn();

describe('RestorePassword steps (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  describe('Step1Content', () => {
    it('disables the submit button while loading and when email is empty', () => {
      render(
        <Step1Content
          email=""
          emailError={null}
          formError={null}
          isLoading={true}
          onEmailChange={onEmailChange}
          setStep={setStep}
          setIsLoading={setIsLoading}
          setFormError={setFormError}
          setEmailError={setEmailError}
        />
      );

      expect(screen.getByRole('button', { name: /send me code on email/i })).toBeDisabled();
    });

    it('renders form-level and field-level errors', () => {
      render(
        <Step1Content
          email="test@example.com"
          emailError="Invalid email"
          formError="Server unavailable"
          isLoading={false}
          onEmailChange={onEmailChange}
          setStep={setStep}
          setIsLoading={setIsLoading}
          setFormError={setFormError}
          setEmailError={setEmailError}
        />
      );

      expect(screen.getByText('Server unavailable')).toBeInTheDocument();
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('calls onEmailChange when the email input changes', async () => {
      const user = userEvent.setup();
      render(
        <Step1Content
          email=""
          emailError={null}
          formError={null}
          isLoading={false}
          onEmailChange={onEmailChange}
          setStep={setStep}
          setIsLoading={setIsLoading}
          setFormError={setFormError}
          setEmailError={setEmailError}
        />
      );

      await user.type(screen.getByLabelText(/email/i), 'a');
      expect(onEmailChange).toHaveBeenCalledWith('a');
    });

    it('stores a nested data token and moves to step 2', async () => {
      mockCustomInstance.mockResolvedValue({
        data: { token: 'nested-token' },
      });
      const user = userEvent.setup();
      render(
        <Step1Content
          email="test@example.com"
          emailError={null}
          formError={null}
          isLoading={false}
          onEmailChange={onEmailChange}
          setStep={setStep}
          setIsLoading={setIsLoading}
          setFormError={setFormError}
          setEmailError={setEmailError}
        />
      );

      await user.click(screen.getByRole('button', { name: /send me code on email/i }));

      await waitFor(() => {
        expect(window.localStorage.getItem('password_reset_token')).toBe('nested-token');
        expect(setStep).toHaveBeenCalledWith(1);
      });
    });

    it('handles a string error message', async () => {
      mockCustomInstance.mockRejectedValue('Plain string error');
      const user = userEvent.setup();
      render(
        <Step1Content
          email="test@example.com"
          emailError={null}
          formError={null}
          isLoading={false}
          onEmailChange={onEmailChange}
          setStep={setStep}
          setIsLoading={setIsLoading}
          setFormError={setFormError}
          setEmailError={setEmailError}
        />
      );

      await user.click(screen.getByRole('button', { name: /send me code on email/i }));

      await waitFor(() => {
        expect(setFormError).toHaveBeenCalledWith('Plain string error');
      });
    });

    it('uses the first validation error message when errors array has no email path', async () => {
      mockCustomInstance.mockRejectedValue({
        message: 'Validation failed',
        errors: [{ path: ['other'], message: 'Something is wrong' }],
      });
      const user = userEvent.setup();
      render(
        <Step1Content
          email="test@example.com"
          emailError={null}
          formError={null}
          isLoading={false}
          onEmailChange={onEmailChange}
          setStep={setStep}
          setIsLoading={setIsLoading}
          setFormError={setFormError}
          setEmailError={setEmailError}
        />
      );

      await user.click(screen.getByRole('button', { name: /send me code on email/i }));

      await waitFor(() => {
        expect(setFormError).toHaveBeenCalledWith('Something is wrong');
      });
    });

    it('handles errors without a message but with an email path', async () => {
      mockCustomInstance.mockRejectedValue({
        errors: [{ path: ['email'], message: 'Email is invalid' }],
      });
      const user = userEvent.setup();
      render(
        <Step1Content
          email="bad"
          emailError={null}
          formError={null}
          isLoading={false}
          onEmailChange={onEmailChange}
          setStep={setStep}
          setIsLoading={setIsLoading}
          setFormError={setFormError}
          setEmailError={setEmailError}
        />
      );

      await user.click(screen.getByRole('button', { name: /send me code on email/i }));

      await waitFor(() => {
        expect(setEmailError).toHaveBeenCalledWith('Email is invalid');
      });
    });
  });

  describe('Step2Content', () => {
    const baseProps = {
      code: '',
      codeError: null as string | null,
      formError: null as string | null,
      isLoading: false,
      onCodeChange,
      setStep: setStep as (step: 2) => void,
      setIsLoading,
      setFormError,
      setCodeError,
      onBack,
    };

    it('shows "Request New Code" state when max attempts exceeded and disables the input', () => {
      render(
        <Step2Content
          {...baseProps}
          formError="Maximum attempts exceeded. This session has been invalidated."
        />
      );

      expect(screen.getByRole('button', { name: /request new code/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/secret code/i)).toBeDisabled();
      // Standard form buttons are replaced
      expect(screen.queryByRole('button', { name: /reset password/i })).not.toBeInTheDocument();
    });

    it('calls onRequestNewCode when "Request New Code" is clicked', async () => {
      const onRequestNewCode = jest.fn();
      const user = userEvent.setup();
      render(
        <Step2Content
          {...baseProps}
          formError="Too many requests"
          onRequestNewCode={onRequestNewCode}
        />
      );

      await user.click(screen.getByRole('button', { name: /request new code/i }));

      expect(window.localStorage.getItem('password_reset_token')).toBeNull();
      expect(onCodeChange).toHaveBeenCalledWith('');
      expect(onRequestNewCode).toHaveBeenCalled();
    });

    it('calls onBack when "Request New Code" clicked without callback', async () => {
      const user = userEvent.setup();
      render(
        <Step2Content {...baseProps} formError="Too many requests" />
      );

      await user.click(screen.getByRole('button', { name: /request new code/i }));
      expect(onBack).toHaveBeenCalled();
    });

    it('sets a form error when the token is missing', async () => {
      const user = userEvent.setup();
      render(
        <Step2Content {...baseProps} code="123456" />
      );

      await user.click(screen.getByRole('button', { name: /reset password/i }));

      await waitFor(() => {
        expect(setFormError).toHaveBeenCalledWith(
          expect.stringMatching(/invalid or expired token/i)
        );
      });
      expect(mockCustomInstance).not.toHaveBeenCalled();
    });

    it('sets a code error for validation errors with a code path', async () => {
      mockCustomInstance.mockRejectedValue({
        message: 'Validation failed',
        errors: [{ path: ['code'], message: 'Code is required' }],
      });
      window.localStorage.setItem('password_reset_token', 'token-1');
      const user = userEvent.setup();
      render(
        <Step2Content {...baseProps} code="123" />
      );

      await user.click(screen.getByRole('button', { name: /reset password/i }));

      await waitFor(() => {
        expect(setCodeError).toHaveBeenCalledWith('Code is required');
      });
    });

    it('sets a form error containing "code" also as code error', async () => {
      mockCustomInstance.mockRejectedValue({
        message: 'Invalid code',
      });
      window.localStorage.setItem('password_reset_token', 'token-1');
      const user = userEvent.setup();
      render(
        <Step2Content {...baseProps} code="123" />
      );

      await user.click(screen.getByRole('button', { name: /reset password/i }));

      await waitFor(() => {
        expect(setFormError).toHaveBeenCalledWith('Invalid code');
        expect(setCodeError).toHaveBeenCalledWith('Invalid code');
      });
    });
  });

  describe('Step3Content', () => {
    const baseProps = {
      password: '',
      confirmPassword: '',
      passwordError: null as string | null,
      confirmPasswordError: null as string | null,
      formError: null as string | null,
      isLoading: false,
      onPasswordChange,
      onConfirmPasswordChange,
      setIsLoading,
      setFormError,
      setPasswordError,
      setConfirmPasswordError,
    };

    const renderStep3 = (overrides: Partial<typeof baseProps> = {}) =>
      render(
        <MemoryRouter>
          <Step3Content {...baseProps} {...overrides} />
        </MemoryRouter>
      );

    it('shows form error when the token is missing', async () => {
      const user = userEvent.setup();
      renderStep3({ password: 'NewPassword123*', confirmPassword: 'NewPassword123*' });

      await user.click(screen.getByRole('button', { name: /set up new password/i }));

      await waitFor(() => {
        expect(setFormError).toHaveBeenCalledWith(
          expect.stringMatching(/invalid or expired token/i)
        );
      });
      expect(mockCustomInstance).not.toHaveBeenCalled();
    });

    it('sets password error for validation errors with a password path', async () => {
      window.localStorage.setItem('password_reset_token', 'token-1');
      mockCustomInstance.mockRejectedValue({
        message: 'Validation failed',
        errors: [{ path: ['password'], message: 'Too short' }],
      });
      const user = userEvent.setup();
      renderStep3({ password: 'NewPassword123*', confirmPassword: 'NewPassword123*' });

      await user.click(screen.getByRole('button', { name: /set up new password/i }));

      await waitFor(() => {
        expect(setPasswordError).toHaveBeenCalledWith('Too short');
      });
    });

    it('sets form error for validation errors with a token path', async () => {
      window.localStorage.setItem('password_reset_token', 'token-1');
      mockCustomInstance.mockRejectedValue({
        message: 'Validation failed',
        errors: [{ path: ['token'], message: 'Expired token' }],
      });
      const user = userEvent.setup();
      renderStep3({ password: 'NewPassword123*', confirmPassword: 'NewPassword123*' });

      await user.click(screen.getByRole('button', { name: /set up new password/i }));

      await waitFor(() => {
        expect(setFormError).toHaveBeenCalledWith('Expired token');
      });
    });

    it('handles string error messages', async () => {
      window.localStorage.setItem('password_reset_token', 'token-1');
      mockCustomInstance.mockRejectedValue('Custom reset error');
      const user = userEvent.setup();
      renderStep3({ password: 'NewPassword123*', confirmPassword: 'NewPassword123*' });

      await user.click(screen.getByRole('button', { name: /set up new password/i }));

      await waitFor(() => {
        expect(setFormError).toHaveBeenCalledWith('Custom reset error');
      });
    });

    it('handles errors with message and password path', async () => {
      window.localStorage.setItem('password_reset_token', 'token-1');
      mockCustomInstance.mockRejectedValue({
        message: 'Something failed',
        errors: [{ path: ['password'], message: 'Bad password' }],
      });
      const user = userEvent.setup();
      renderStep3({ password: 'NewPassword123*', confirmPassword: 'NewPassword123*' });

      await user.click(screen.getByRole('button', { name: /set up new password/i }));

      await waitFor(() => {
        expect(setPasswordError).toHaveBeenCalledWith('Bad password');
      });
    });

    it('uses the first error message when the errors array has no password path', async () => {
      window.localStorage.setItem('password_reset_token', 'token-1');
      mockCustomInstance.mockRejectedValue({
        errors: [{ path: ['other'], message: 'Generic validation problem' }],
      });
      const user = userEvent.setup();
      renderStep3({ password: 'NewPassword123*', confirmPassword: 'NewPassword123*' });

      await user.click(screen.getByRole('button', { name: /set up new password/i }));

      await waitFor(() => {
        expect(setFormError).toHaveBeenCalledWith('Generic validation problem');
      });
    });
  });
});
