import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SignIn } from './SignIn';
import { useAuth } from '../../app/contexts/AuthContext';

jest.mock('../../app/contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const mockUseAuth = useAuth as jest.Mock;

describe('SignIn', () => {
    const mockLogin = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAuth.mockReturnValue({
            login: mockLogin,
            isAuthenticated: false,
            isLoading: false,
            user: null,
            logout: jest.fn(),
            signUp: jest.fn(),
            token: null,
        });
    });

    const setup = async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter
                initialEntries={['/auth/sign-in']}
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <SignIn />
            </MemoryRouter>
        );
        return { user };
    };

    const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
        await user.type(screen.getByLabelText(/email/i), 'test@example.com');
        await user.type(screen.getByPlaceholderText(/enter your password/i), 'Password123*');
    };

    const getSignInButton = () => {
        return screen.getByRole('button', { name: /^sign in$/i });
    };

    const submitFormAndWaitForError = async (
        user: ReturnType<typeof userEvent.setup>,
        errorPattern: RegExp
    ) => {
        const signInButton = getSignInButton();
        await user.click(signInButton);

        await waitFor(() => {
            const errorMessage = screen.queryByText(errorPattern);
            expect(errorMessage).not.toBeNull();
        });

        expect(mockLogin).not.toHaveBeenCalled();
    };

    const submitFormAndWaitForServerError = async (
        user: ReturnType<typeof userEvent.setup>,
        errorPattern: RegExp
    ) => {
        const signInButton = getSignInButton();
        await user.click(signInButton);

        await waitFor(() => {
            const errorMessage = screen.queryByText(errorPattern);
            expect(errorMessage).not.toBeNull();
        });

        expect(mockNavigate).not.toHaveBeenCalled();
    };

    it('logs in and navigates on success', async () => {
        mockLogin.mockResolvedValue({ success: true });

        const { user } = await setup();
        await fillValidForm(user);

        const signInButton = getSignInButton();
        await waitFor(() => {
            expect(signInButton).not.toHaveProperty('disabled', true);
        });

        await user.click(signInButton);

        await waitFor(() => expect(mockLogin).toHaveBeenCalled(), { timeout: 3000 });
        await waitFor(() => expect(mockNavigate).toHaveBeenCalled(), { timeout: 3000 });
    });

    describe('Validation (client-side)', () => {
        it('shows error for empty email and does not call login', async () => {
            const { user } = await setup();
            await submitFormAndWaitForError(user, /please provide a valid email address/i);
        });

        it('shows error for invalid email and does not call login', async () => {
            const { user } = await setup();

            await user.type(screen.getByLabelText(/email/i), 'invalid-email');
            await user.type(screen.getByPlaceholderText(/enter your password/i), 'Password123*');

            await submitFormAndWaitForError(user, /please provide a valid email address/i);
        });

        it('shows error for empty password and does not call login', async () => {
            const { user } = await setup();

            await user.type(screen.getByLabelText(/email/i), 'test@example.com');

            await submitFormAndWaitForError(user, /password must be at least 8 characters long/i);
        });

        it('disables submit button when form is invalid after validation attempt', async () => {
            const { user } = await setup();
            const signInButton = getSignInButton();

            expect(signInButton).not.toHaveProperty('disabled', true);

            await user.click(signInButton);
            await waitFor(() => {
                expect(signInButton).toHaveProperty('disabled', true);
            });
        });

        it('enables submit button when form becomes valid', async () => {
            const { user } = await setup();
            const signInButton = getSignInButton();

            await user.click(signInButton);

            await waitFor(() => {
                expect(signInButton).toHaveProperty('disabled', true);
            });

            await fillValidForm(user);

            await waitFor(() => {
                expect(signInButton).not.toHaveProperty('disabled', true);
            });
        });

        it('removes email error when field is corrected (realtime validation)', async () => {
            const { user } = await setup();

            const signInButton = getSignInButton();
            await user.type(screen.getByLabelText(/email/i), 'invalid-email');
            await user.click(signInButton);

            await waitFor(() => {
                const errorMessage = screen.queryByText(/please provide a valid email address/i);
                expect(errorMessage).not.toBeNull();
            });
            const emailInput = screen.getByLabelText(/email/i);
            await user.clear(emailInput);
            await user.type(emailInput, 'test@example.com');

            await waitFor(() => {
                const errorMessage = screen.queryByText(/please provide a valid email address/i);
                expect(errorMessage).toBeNull();
            });
        });

        it('removes password error when field is corrected (realtime validation)', async () => {
            const { user } = await setup();

            const signInButton = getSignInButton();

            await user.type(screen.getByLabelText(/email/i), 'test@example.com');
            await user.type(screen.getByPlaceholderText(/enter your password/i), 'short');
            await user.click(signInButton);

            await waitFor(() => {
                const errorMessage = screen.queryByText(/password must be at least 8 characters long/i);
                expect(errorMessage).not.toBeNull();
            });

            const passwordInput = screen.getByPlaceholderText(/enter your password/i);
            await user.clear(passwordInput);
            await user.type(passwordInput, 'Password123*');

            await waitFor(() => {
                const errorMessage = screen.queryByText(/password must be at least 8 characters long/i);
                expect(errorMessage).toBeNull();
            });
        });
    });

    describe('Remember me', () => {
        it('toggles checkbox state when clicked', async () => {
            const { user } = await setup();
            const rememberMeCheckbox = screen.getByLabelText(/remember me/i) as HTMLInputElement;

            expect(rememberMeCheckbox.checked).toBe(false);

            await user.click(rememberMeCheckbox);
            expect(rememberMeCheckbox.checked).toBe(true);

            await user.click(rememberMeCheckbox);
            expect(rememberMeCheckbox.checked).toBe(false);
        });

        it('calls login with rememberMe=false when checkbox is unchecked', async () => {
            mockLogin.mockResolvedValue({ success: true });

            const { user } = await setup();
            await fillValidForm(user);

            const signInButton = getSignInButton();
            await user.click(signInButton);

            await waitFor(() => expect(mockLogin).toHaveBeenCalled(), { timeout: 3000 });
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'Password123*', false);
        });

        it('calls login with rememberMe=true when checkbox is checked', async () => {
            mockLogin.mockResolvedValue({ success: true });

            const { user } = await setup();
            await fillValidForm(user);

            const rememberMeCheckbox = screen.getByLabelText(/remember me/i);
            await user.click(rememberMeCheckbox);

            const signInButton = getSignInButton();
            await user.click(signInButton);

            await waitFor(() => expect(mockLogin).toHaveBeenCalled(), { timeout: 3000 });
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'Password123*', true);
        });
    });

    describe('Login errors', () => {
        it('shows form-level error "Invalid credentials" when login returns success:false and does not navigate', async () => {
            mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' });

            const { user } = await setup();
            await fillValidForm(user);

            await submitFormAndWaitForServerError(user, /invalid credentials/i);
        });

        it('shows form-level error when login returns success:false with custom error message and does not navigate', async () => {
            mockLogin.mockResolvedValue({ success: false, error: 'Login failed. Please try again.' });

            const { user } = await setup();
            await fillValidForm(user);

            await submitFormAndWaitForServerError(user, /login failed. please try again/i);
        });

        it('shows error message when login returns success:false for network error and does not navigate', async () => {
            mockLogin.mockResolvedValue({
                success: false,
                error: 'Unable to connect to the server. Please check your internet connection and ensure the server is running.'
            });

            const { user } = await setup();
            await fillValidForm(user);

            await submitFormAndWaitForServerError(user, /unable to connect to the server/i);
        });

        it('shows error message "Server error. Please try again later." when login returns success:false for 500 error and does not navigate', async () => {
            mockLogin.mockResolvedValue({
                success: false,
                error: 'Server error. Please try again later.'
            });

            const { user } = await setup();
            await fillValidForm(user);

            await submitFormAndWaitForServerError(user, /server error. please try again later/i);
        });

        it('shows generic error message when login returns success:false without error message and does not navigate', async () => {
            mockLogin.mockResolvedValue({ success: false });

            const { user } = await setup();
            await fillValidForm(user);

            await submitFormAndWaitForServerError(user, /login failed. please try again/i);
        });
    });

    describe('Navigation', () => {
        it('navigates to restore password page when "Forgot password?" is clicked', async () => {
            const { user } = await setup();

            const forgotPasswordButton = screen.getByRole('button', { name: /forgot password/i });
            await user.click(forgotPasswordButton);

            expect(mockNavigate).toHaveBeenCalledWith('/restore-password');
        });

        it('navigates to sign up page when "Create account" is clicked', async () => {
            const { user } = await setup();

            const createAccountButton = screen.getByRole('button', { name: /create account/i });
            await user.click(createAccountButton);

            expect(mockNavigate).toHaveBeenCalledWith('/sign-up');
        });
    });

    describe('Server error clearing', () => {
        const triggerServerError = async (user: ReturnType<typeof userEvent.setup>) => {
            mockLogin.mockResolvedValue({ success: false, error: 'Invalid credentials' });
            await fillValidForm(user);

            const signInButton = getSignInButton();
            await user.click(signInButton);

            await waitFor(() => {
                const errorMessage = screen.queryByText(/invalid credentials/i);
                expect(errorMessage).not.toBeNull();
            });
        };

        const verifyErrorCleared = async () => {
            await waitFor(() => {
                const errorMessage = screen.queryByText(/invalid credentials/i);
                expect(errorMessage).toBeNull();
            });
        };

        it('clears server error when email field is changed after error', async () => {
            const { user } = await setup();
            await triggerServerError(user);

            const emailInput = screen.getByLabelText(/email/i);
            await user.clear(emailInput);
            await user.type(emailInput, 'new@example.com');

            await verifyErrorCleared();
        });

        it('clears server error when password field is changed after error', async () => {
            const { user } = await setup();
            await triggerServerError(user);

            const passwordInput = screen.getByPlaceholderText(/enter your password/i);
            await user.clear(passwordInput);
            await user.type(passwordInput, 'NewPassword123*');

            await verifyErrorCleared();
        });

        it('clears server error when both fields are changed after error', async () => {
            const { user } = await setup();
            await triggerServerError(user);

            const emailInput = screen.getByLabelText(/email/i);
            await user.clear(emailInput);
            await user.type(emailInput, 'new@example.com');

            const passwordInput = screen.getByPlaceholderText(/enter your password/i);
            await user.clear(passwordInput);
            await user.type(passwordInput, 'NewPassword123*');

            await verifyErrorCleared();
        });
    });

    describe('Edge cases validation', () => {
        const testEmailValidation = async (email: string) => {
            const { user } = await setup();
            await user.type(screen.getByLabelText(/email/i), email);
            await user.type(screen.getByPlaceholderText(/enter your password/i), 'Password123*');
            await submitFormAndWaitForError(user, /please provide a valid email address/i);
        };

        const testPasswordValidation = async (password: string, errorPattern: RegExp) => {
            const { user } = await setup();
            await user.type(screen.getByLabelText(/email/i), 'test@example.com');
            await user.type(screen.getByPlaceholderText(/enter your password/i), password);
            await submitFormAndWaitForError(user, errorPattern);
        };

        it('shows error for email with spaces at the beginning', async () => {
            await testEmailValidation(' test@example.com');
        });

        it('shows error for email with spaces at the end', async () => {
            await testEmailValidation('test@example.com ');
        });

        it('shows error for email with multiple @ symbols', async () => {
            await testEmailValidation('test@@example.com');
        });

        it('shows error for password without uppercase letter', async () => {
            await testPasswordValidation('password123*', /password must contain at least one uppercase letter/i);
        });

        it('shows error for password without lowercase letter', async () => {
            await testPasswordValidation('PASSWORD123*', /password must contain at least one lowercase letter/i);
        });

        it('shows error for password without numbers', async () => {
            await testPasswordValidation('Password*', /password must contain at least one number/i);
        });

        it('shows error for password without special characters', async () => {
            await testPasswordValidation('Password123', /password must contain at least one special character/i);
        });
    });

    describe('Behavior after successful login', () => {
        const submitSuccessfulForm = async (user: ReturnType<typeof userEvent.setup>) => {
            mockLogin.mockResolvedValue({ success: true });
            await fillValidForm(user);

            const signInButton = getSignInButton();
            await user.click(signInButton);

            await waitFor(() => expect(mockLogin).toHaveBeenCalled(), { timeout: 3000 });
        };

        it('navigates to dashboard after successful login', async () => {
            const { user } = await setup();
            await submitSuccessfulForm(user);

            await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/dashboard'), { timeout: 3000 });
        });

        it('calls login with correct credentials after successful form submission', async () => {
            const { user } = await setup();
            await submitSuccessfulForm(user);

            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'Password123*', false);
        });

        it('does not show any errors after successful login', async () => {
            const { user } = await setup();
            await submitSuccessfulForm(user);

            await waitFor(() => expect(mockNavigate).toHaveBeenCalled(), { timeout: 3000 });

            const errorPatterns = [
                /please provide a valid email address/i,
                /password must be at least 8 characters long/i,
                /password must contain at least one uppercase letter/i,
                /password must contain at least one lowercase letter/i,
                /password must contain at least one number/i,
                /password must contain at least one special character/i,
                /invalid credentials/i,
            ];

            errorPatterns.forEach(pattern => {
                expect(screen.queryByText(pattern)).toBeNull();
            });
        });
    });
});
