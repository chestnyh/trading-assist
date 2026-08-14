import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { RestorePassword } from './RestorePassword';
import { customInstance } from '@trading-bot/api-client';

jest.mock('@trading-bot/api-client', () => ({
    customInstance: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const mockCustomInstance = customInstance as jest.Mock;

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Test constants for button labels
const BUTTON_LABELS = {
    SEND_CODE_ON_EMAIL: /send me code on email/i,
    RESET_PASSWORD: /reset password/i,
    SET_UP_NEW_PASSWORD: /set up new password/i,
    BACK: /^back$/i,
} as const;

describe('RestorePassword', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.clear();
        mockCustomInstance.mockReset();
    });

    const setup = async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter
                initialEntries={['/restore-password']}
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <RestorePassword />
            </MemoryRouter>
        );
        return { user };
    };

    const navigateToStep2 = async (user: ReturnType<typeof userEvent.setup>) => {
        mockCustomInstance.mockResolvedValueOnce({
            token: 'test-token-123',
            message: 'Password reset code sent to your email',
        });

        const emailInput = screen.getByLabelText(/email/i);
        await user.type(emailInput, 'test@example.com');

        const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.SEND_CODE_ON_EMAIL });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/insert code/i)).toBeInTheDocument();
        });
    };

    describe('Step 1: Email Input', () => {
        it('renders email input field on step 1', async () => {
            await setup();

            expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
        });

        it('renders "Send me code on email" button on step 1', async () => {
            await setup();

            expect(screen.getByRole('button', { name: BUTTON_LABELS.SEND_CODE_ON_EMAIL })).toBeInTheDocument();
        });

        it('disables submit button when email is empty', async () => {
            await setup();

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.SEND_CODE_ON_EMAIL });
            expect(submitButton).toHaveProperty('disabled', true);
        });

        it('enables submit button when email is provided', async () => {
            const { user } = await setup();

            const emailInput = screen.getByLabelText(/email/i);
            await user.type(emailInput, 'test@example.com');

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.SEND_CODE_ON_EMAIL });
            await waitFor(() => {
                expect(submitButton).not.toHaveProperty('disabled', true);
            });
        });

        it('successfully requests password reset and moves to step 2', async () => {
            mockCustomInstance.mockResolvedValue({
                token: 'test-token-123',
                message: 'Password reset code sent to your email',
            });

            const { user } = await setup();

            const emailInput = screen.getByLabelText(/email/i);
            await user.type(emailInput, 'test@example.com');

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.SEND_CODE_ON_EMAIL });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockCustomInstance).toHaveBeenCalledWith(
                    '/api/v1/auth/forgot-password',
                    expect.objectContaining({
                        method: 'POST',
                        body: JSON.stringify({ email: 'test@example.com' }),
                    })
                );
            });

            await waitFor(() => {
                expect(localStorageMock.getItem('password_reset_token')).toBe('test-token-123');
            });

            await waitFor(() => {
                expect(screen.getByText(/insert code/i)).toBeInTheDocument();
            });
        });

        it('shows form error when API call fails with network error', async () => {
            mockCustomInstance.mockRejectedValue({
                isNetworkError: true,
                message: 'Failed to connect to the server. Make sure the backend is running.',
            });

            const { user } = await setup();

            const emailInput = screen.getByLabelText(/email/i);
            await user.type(emailInput, 'test@example.com');

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.SEND_CODE_ON_EMAIL });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/failed to connect to the server/i)).toBeInTheDocument();
            });
        });

        it('shows email error when API returns validation error for email', async () => {
            mockCustomInstance.mockRejectedValue({
                message: 'Validation failed',
                errors: [
                    {
                        path: ['email'],
                        message: 'Please provide a valid email address',
                    },
                ],
            });

            const { user } = await setup();

            const emailInput = screen.getByLabelText(/email/i);
            await user.type(emailInput, 'invalid-email');

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.SEND_CODE_ON_EMAIL });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/please provide a valid email address/i)).toBeInTheDocument();
            });
        });

        it('shows form error when API call fails with generic error', async () => {
            mockCustomInstance.mockRejectedValue({
                message: 'User not found',
            });

            const { user } = await setup();

            const emailInput = screen.getByLabelText(/email/i);
            await user.type(emailInput, 'test@example.com');

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.SEND_CODE_ON_EMAIL });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/user not found/i)).toBeInTheDocument();
            });
        });

        it('clears email error when email field is changed after error', async () => {
            mockCustomInstance.mockRejectedValue({
                message: 'Validation failed',
                errors: [
                    {
                        path: ['email'],
                        message: 'Please provide a valid email address',
                    },
                ],
            });

            const { user } = await setup();

            const emailInput = screen.getByLabelText(/email/i);
            await user.type(emailInput, 'invalid');
            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.SEND_CODE_ON_EMAIL });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/please provide a valid email address/i)).toBeInTheDocument();
            });

            await user.clear(emailInput);
            await user.type(emailInput, 'test@example.com');

            await waitFor(() => {
                expect(screen.queryByText(/please provide a valid email address/i)).toBeNull();
            });
        });

        it('clears form error when email field is changed after error', async () => {
            mockCustomInstance.mockRejectedValue({
                message: 'User not found',
            });

            const { user } = await setup();

            const emailInput = screen.getByLabelText(/email/i);
            await user.type(emailInput, 'test@example.com');
            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.SEND_CODE_ON_EMAIL });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/user not found/i)).toBeInTheDocument();
            });

            await user.clear(emailInput);
            await user.type(emailInput, 'new@example.com');

            await waitFor(() => {
                expect(screen.queryByText(/user not found/i)).toBeNull();
            });
        });

        it('disables submit button while loading on step 1', async () => {
            mockCustomInstance.mockImplementation(
                () => new Promise((resolve) => setTimeout(() => resolve({ token: 'test', message: 'ok' }), 100))
            );

            const { user } = await setup();

            const emailInput = screen.getByLabelText(/email/i);
            await user.type(emailInput, 'test@example.com');

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.SEND_CODE_ON_EMAIL });
            await user.click(submitButton);

            // Button should be disabled while loading
            await waitFor(() => {
                expect(submitButton).toHaveProperty('disabled', true);
            });
        });
    });

    describe('Step 2: Code Verification', () => {
        it('renders code input field on step 2', async () => {
            const { user } = await setup();
            await navigateToStep2(user);

            expect(screen.getByLabelText(/secret code/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/enter verification code/i)).toBeInTheDocument();
        });

        it('renders "Back" and "Reset password" buttons on step 2', async () => {
            const { user } = await setup();
            await navigateToStep2(user);

            expect(screen.getByRole('button', { name: BUTTON_LABELS.BACK })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: BUTTON_LABELS.RESET_PASSWORD })).toBeInTheDocument();
        });

        it('disables submit button when code is empty', async () => {
            const { user } = await setup();
            await navigateToStep2(user);

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.RESET_PASSWORD });
            expect(submitButton).toHaveProperty('disabled', true);
        });

        it('enables submit button when code is provided', async () => {
            const { user } = await setup();
            await navigateToStep2(user);

            const codeInput = screen.getByLabelText(/secret code/i);
            await user.type(codeInput, '123456');

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.RESET_PASSWORD });
            await waitFor(() => {
                expect(submitButton).not.toHaveProperty('disabled', true);
            });
        });

        it('navigates back to step 1 when "Back" button is clicked', async () => {
            const { user } = await setup();
            await navigateToStep2(user);

            const backButton = screen.getByRole('button', { name: BUTTON_LABELS.BACK });
            await user.click(backButton);

            await waitFor(() => {
                expect(screen.getByText(/insert your email/i)).toBeInTheDocument();
            });
        });

        it('successfully verifies code and moves to step 3', async () => {
            localStorageMock.setItem('password_reset_token', 'test-token-123');
            mockCustomInstance.mockResolvedValue({
                message: 'Code verified successfully',
            });

            const { user } = await setup();
            await navigateToStep2(user);

            const codeInput = screen.getByLabelText(/secret code/i);
            await user.type(codeInput, '123456');

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.RESET_PASSWORD });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockCustomInstance).toHaveBeenCalledWith(
                    '/api/v1/auth/verify-password-reset',
                    expect.objectContaining({
                        method: 'POST',
                        body: JSON.stringify({ code: '123456', token: 'test-token-123' }),
                    })
                );
            });

            await waitFor(() => {
                expect(screen.getByText(/enter new password/i)).toBeInTheDocument();
            });
        });

        it('shows error when token is missing in localStorage', async () => {
            const { user } = await setup();
            await navigateToStep2(user);

            // Remove token after navigation to step 2
            localStorageMock.removeItem('password_reset_token');

            const codeInput = screen.getByLabelText(/secret code/i);
            await user.type(codeInput, '123456');

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.RESET_PASSWORD });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/invalid or expired token/i)).toBeInTheDocument();
            });
        });

        it('shows form error when API call fails with network error', async () => {
            const { user } = await setup();
            await navigateToStep2(user);

            // Ensure token is set
            localStorageMock.setItem('password_reset_token', 'test-token-123');
            mockCustomInstance.mockRejectedValueOnce({
                isNetworkError: true,
                message: 'Failed to connect to the server. Make sure the backend is running.',
            });

            const codeInput = screen.getByLabelText(/secret code/i);
            await user.type(codeInput, '123456');

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.RESET_PASSWORD });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/failed to connect to the server/i)).toBeInTheDocument();
            });
        });

        it('shows code error when API returns validation error for code', async () => {
            const { user } = await setup();
            await navigateToStep2(user);

            // Ensure token is set (navigateToStep2 already set it, but ensure it's there)
            localStorageMock.setItem('password_reset_token', 'test-token-123');
            // This will be the second API call (first was forgot-password in navigateToStep2)
            mockCustomInstance.mockRejectedValueOnce({
                message: 'Validation failed',
                errors: [
                    {
                        path: ['code'],
                        message: 'Code is required',
                    },
                ],
            });

            const codeInput = screen.getByLabelText(/secret code/i);
            // Type something to enable button, then submit - API will return validation error
            await user.type(codeInput, '123');
            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.RESET_PASSWORD });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/code is required/i)).toBeInTheDocument();
            }, { timeout: 3000 });
        });

        it('shows form error when code is invalid', async () => {
            const { user } = await setup();
            await navigateToStep2(user);

            // Ensure token is set
            localStorageMock.setItem('password_reset_token', 'test-token-123');
            // This will be the second API call (first was forgot-password in navigateToStep2)
            mockCustomInstance.mockRejectedValueOnce({
                message: 'Invalid or expired code',
            });

            const codeInput = screen.getByLabelText(/secret code/i);
            await user.type(codeInput, 'wrong-code');

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.RESET_PASSWORD });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getAllByText(/invalid or expired code/i).length).toBeGreaterThan(0);
            }, { timeout: 3000 });
        });

        it('clears code error when code field is changed after error', async () => {
            const { user } = await setup();
            await navigateToStep2(user);

            // Ensure token is set
            localStorageMock.setItem('password_reset_token', 'test-token-123');
            // This will be the second API call (first was forgot-password in navigateToStep2)
            mockCustomInstance.mockRejectedValueOnce({
                message: 'Validation failed',
                errors: [
                    {
                        path: ['code'],
                        message: 'Code is required',
                    },
                ],
            });

            const codeInput = screen.getByLabelText(/secret code/i);
            // Type something invalid to trigger error
            await user.type(codeInput, '123');
            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.RESET_PASSWORD });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/code is required/i)).toBeInTheDocument();
            }, { timeout: 3000 });

            // Change the value - this should clear the error
            await user.clear(codeInput);
            await user.type(codeInput, '123456');

            await waitFor(() => {
                expect(screen.queryByText(/code is required/i)).toBeNull();
            }, { timeout: 3000 });
        });

        it('clears form error when code field is changed after error', async () => {
            const { user } = await setup();
            await navigateToStep2(user);

            // Ensure token is set
            localStorageMock.setItem('password_reset_token', 'test-token-123');
            // This will be the second API call (first was forgot-password in navigateToStep2)
            mockCustomInstance.mockRejectedValueOnce({
                message: 'Invalid or expired code',
            });

            const codeInput = screen.getByLabelText(/secret code/i);
            await user.type(codeInput, 'wrong');
            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.RESET_PASSWORD });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getAllByText(/invalid or expired code/i).length).toBeGreaterThan(0);
            }, { timeout: 3000 });

            // Change the value - this should clear the error
            await user.clear(codeInput);
            await user.type(codeInput, '123456');

            await waitFor(() => {
                expect(screen.queryAllByText(/invalid or expired code/i).length).toBe(0);
            }, { timeout: 3000 });
        });

        it('disables submit button while loading on step 2', async () => {
            localStorageMock.setItem('password_reset_token', 'test-token-123');
            mockCustomInstance
                .mockResolvedValueOnce({
                    token: 'test-token-123',
                    message: 'Password reset code sent to your email',
                })
                .mockImplementation(
                    () => new Promise((resolve) => setTimeout(() => resolve({ message: 'ok' }), 100))
                );

            const { user } = await setup();

            const emailInput = screen.getByLabelText(/email/i);
            await user.type(emailInput, 'test@example.com');

            const submitButton1 = screen.getByRole('button', { name: BUTTON_LABELS.SEND_CODE_ON_EMAIL });
            await user.click(submitButton1);

            await waitFor(() => {
                expect(screen.getByText(/insert code/i)).toBeInTheDocument();
            });

            const codeInput = screen.getByLabelText(/secret code/i);
            await user.type(codeInput, '123456');

            const submitButton2 = screen.getByRole('button', { name: BUTTON_LABELS.RESET_PASSWORD });
            await user.click(submitButton2);

            // Button should be disabled while loading
            await waitFor(() => {
                expect(submitButton2).toHaveProperty('disabled', true);
            });
        });
    });

    describe('Step 3: Password Reset', () => {
        const navigateToStep3 = async (user: ReturnType<typeof userEvent.setup>) => {
            // Step 1: Request password reset
            mockCustomInstance.mockResolvedValueOnce({
                token: 'test-token-123',
                message: 'Password reset code sent to your email',
            });

            const emailInput = screen.getByLabelText(/email/i);
            await user.type(emailInput, 'test@example.com');

            const submitButton1 = screen.getByRole('button', { name: BUTTON_LABELS.SEND_CODE_ON_EMAIL });
            await user.click(submitButton1);

            await waitFor(() => {
                expect(screen.getByText(/insert code/i)).toBeInTheDocument();
            });

            // Step 2: Verify code
            localStorageMock.setItem('password_reset_token', 'test-token-123');
            mockCustomInstance.mockResolvedValueOnce({
                message: 'Code verified successfully',
            });

            const codeInput = screen.getByLabelText(/secret code/i);
            await user.type(codeInput, '123456');

            const submitButton2 = screen.getByRole('button', { name: BUTTON_LABELS.RESET_PASSWORD });
            await user.click(submitButton2);

            await waitFor(() => {
                expect(screen.getByText(/enter new password/i)).toBeInTheDocument();
            });
        };

        it('renders password and confirm password fields on step 3', async () => {
            const { user } = await setup();
            await navigateToStep3(user);

            // Wait for step 3 to be fully rendered - check for title first
            await waitFor(() => {
                expect(screen.getByText(/enter new password/i)).toBeInTheDocument();
            }, { timeout: 5000 });

            // Check for password fields using placeholders (more reliable)
            await waitFor(() => {
                expect(screen.getByPlaceholderText(/enter new password/i)).toBeInTheDocument();
            }, { timeout: 3000 });

            // Verify both password input fields are present
            const passwordInput = screen.getByPlaceholderText(/enter new password/i);
            const confirmPasswordInput = screen.getByPlaceholderText(/confirm new password/i);
            
            expect(passwordInput).toBeInTheDocument();
            expect(confirmPasswordInput).toBeInTheDocument();
            expect(passwordInput).toHaveAttribute('type', 'password');
            expect(confirmPasswordInput).toHaveAttribute('type', 'password');
        });

        it('renders "Set Up New Password" button on step 3', async () => {
            const { user } = await setup();
            await navigateToStep3(user);

            expect(screen.getByRole('button', { name: BUTTON_LABELS.SET_UP_NEW_PASSWORD })).toBeInTheDocument();
        });

        it('disables submit button when password is empty', async () => {
            const { user } = await setup();
            await navigateToStep3(user);

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.SET_UP_NEW_PASSWORD });
            expect(submitButton).toHaveProperty('disabled', true);
        });

        it('disables submit button when confirm password is empty', async () => {
            const { user } = await setup();
            await navigateToStep3(user);

            const passwordInput = screen.getByPlaceholderText(/enter new password/i);
            await user.type(passwordInput, 'Password123*');

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.SET_UP_NEW_PASSWORD });
            expect(submitButton).toHaveProperty('disabled', true);
        });

        it('enables submit button when both passwords are provided', async () => {
            const { user } = await setup();
            await navigateToStep3(user);

            const passwordInput = screen.getByPlaceholderText(/enter new password/i);
            await user.type(passwordInput, 'Password123*');

            const confirmPasswordInput = screen.getByPlaceholderText(/confirm new password/i);
            await user.type(confirmPasswordInput, 'Password123*');

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.SET_UP_NEW_PASSWORD });
            await waitFor(() => {
                expect(submitButton).not.toHaveProperty('disabled', true);
            });
        });

        it('shows error when passwords do not match', async () => {
            const { user } = await setup();
            await navigateToStep3(user);

            const passwordInput = screen.getByPlaceholderText(/enter new password/i);
            await user.type(passwordInput, 'Password123*');

            const confirmPasswordInput = screen.getByPlaceholderText(/confirm new password/i);
            await user.type(confirmPasswordInput, 'DifferentPassword123*');

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.SET_UP_NEW_PASSWORD });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
            });
        });

        it('successfully resets password and navigates to sign-in', async () => {
            localStorageMock.setItem('password_reset_token', 'test-token-123');
            mockCustomInstance.mockResolvedValue({
                message: 'Password has been reset successfully',
            });

            const { user } = await setup();
            await navigateToStep3(user);

            const passwordInput = screen.getByPlaceholderText(/enter new password/i);
            await user.type(passwordInput, 'NewPassword123*');

            const confirmPasswordInput = screen.getByPlaceholderText(/confirm new password/i);
            await user.type(confirmPasswordInput, 'NewPassword123*');

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.SET_UP_NEW_PASSWORD });
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockCustomInstance).toHaveBeenCalledWith(
                    '/api/v1/auth/reset-password',
                    expect.objectContaining({
                        method: 'POST',
                        body: JSON.stringify({
                            token: 'test-token-123',
                            password: 'NewPassword123*',
                        }),
                    })
                );
            });

            await waitFor(() => {
                expect(localStorageMock.getItem('password_reset_token')).toBeNull();
            });

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/sign-in');
            });
        });

        it('shows error when token is missing in localStorage', async () => {
            const { user } = await setup();
            await navigateToStep3(user);

            // Remove token after navigation to step 3
            localStorageMock.removeItem('password_reset_token');

            const passwordInput = screen.getByPlaceholderText(/enter new password/i);
            await user.type(passwordInput, 'NewPassword123*');

            const confirmPasswordInput = screen.getByPlaceholderText(/confirm new password/i);
            await user.type(confirmPasswordInput, 'NewPassword123*');

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.SET_UP_NEW_PASSWORD });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/invalid or expired token/i)).toBeInTheDocument();
            });
        });

        it('shows form error when API call fails with network error', async () => {
            const { user } = await setup();
            await navigateToStep3(user);

            // Ensure token is set (navigateToStep3 already set it)
            localStorageMock.setItem('password_reset_token', 'test-token-123');
            // This will be the third API call (first: forgot-password, second: verify-password-reset in navigateToStep3)
            mockCustomInstance.mockRejectedValueOnce({
                isNetworkError: true,
                message: 'Failed to connect to the server. Make sure the backend is running.',
            });

            const passwordInput = screen.getByPlaceholderText(/enter new password/i);
            await user.type(passwordInput, 'NewPassword123*');

            const confirmPasswordInput = screen.getByPlaceholderText(/confirm new password/i);
            await user.type(confirmPasswordInput, 'NewPassword123*');

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.SET_UP_NEW_PASSWORD });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/failed to connect to the server/i)).toBeInTheDocument();
            }, { timeout: 3000 });
        });

        it('shows password error when API returns validation error for password', async () => {
            const { user } = await setup();
            await navigateToStep3(user);

            // Ensure token is set (navigateToStep3 already set it)
            localStorageMock.setItem('password_reset_token', 'test-token-123');
            // This will be the third API call (first: forgot-password, second: verify-password-reset in navigateToStep3)
            mockCustomInstance.mockRejectedValueOnce({
                message: 'Validation failed',
                errors: [
                    {
                        path: ['password'],
                        message: 'Password must be at least 8 characters long',
                    },
                ],
            });

            const passwordInput = screen.getByPlaceholderText(/enter new password/i);
            await user.type(passwordInput, 'Short1*');

            const confirmPasswordInput = screen.getByPlaceholderText(/confirm new password/i);
            await user.type(confirmPasswordInput, 'Short1*');

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.SET_UP_NEW_PASSWORD });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
            }, { timeout: 3000 });
        });

        it('shows form error when password reset fails', async () => {
            const { user } = await setup();
            await navigateToStep3(user);

            // Ensure token is set (navigateToStep3 already set it)
            localStorageMock.setItem('password_reset_token', 'test-token-123');
            // This will be the third API call (first: forgot-password, second: verify-password-reset in navigateToStep3)
            mockCustomInstance.mockRejectedValueOnce({
                message: 'Token has expired',
            });

            const passwordInput = screen.getByPlaceholderText(/enter new password/i);
            await user.type(passwordInput, 'NewPassword123*');

            const confirmPasswordInput = screen.getByPlaceholderText(/confirm new password/i);
            await user.type(confirmPasswordInput, 'NewPassword123*');

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.SET_UP_NEW_PASSWORD });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/token has expired/i)).toBeInTheDocument();
            }, { timeout: 3000 });
        });

        it('clears password error when password field is changed after error', async () => {
            localStorageMock.setItem('password_reset_token', 'test-token-123');
            mockCustomInstance.mockRejectedValue({
                message: 'Validation failed',
                errors: [
                    {
                        path: ['password'],
                        message: 'Password must be at least 8 characters long',
                    },
                ],
            });

            const { user } = await setup();
            await navigateToStep3(user);

            const passwordInput = screen.getByPlaceholderText(/enter new password/i);
            await user.type(passwordInput, 'Short1*');

            const confirmPasswordInput = screen.getByPlaceholderText(/confirm new password/i);
            await user.type(confirmPasswordInput, 'Short1*');

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.SET_UP_NEW_PASSWORD });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
            });

            await user.clear(passwordInput);
            await user.type(passwordInput, 'NewPassword123*');

            await waitFor(() => {
                expect(screen.queryByText(/password must be at least 8 characters long/i)).toBeNull();
            });
        });

        it('clears confirm password error when confirm password field is changed after error', async () => {
            const { user } = await setup();
            await navigateToStep3(user);

            const passwordInput = screen.getByPlaceholderText(/enter new password/i);
            await user.type(passwordInput, 'Password123*');

            const confirmPasswordInput = screen.getByPlaceholderText(/confirm new password/i);
            await user.type(confirmPasswordInput, 'Different123*');

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.SET_UP_NEW_PASSWORD });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
            });

            await user.clear(confirmPasswordInput);
            await user.type(confirmPasswordInput, 'Password123*');

            await waitFor(() => {
                expect(screen.queryByText(/passwords do not match/i)).toBeNull();
            });
        });

        it('clears form error when password field is changed after error', async () => {
            localStorageMock.setItem('password_reset_token', 'test-token-123');
            mockCustomInstance.mockRejectedValue({
                message: 'Token has expired',
            });

            const { user } = await setup();
            await navigateToStep3(user);

            const passwordInput = screen.getByPlaceholderText(/enter new password/i);
            await user.type(passwordInput, 'NewPassword123*');

            const confirmPasswordInput = screen.getByPlaceholderText(/confirm new password/i);
            await user.type(confirmPasswordInput, 'NewPassword123*');

            const submitButton = screen.getByRole('button', { name: BUTTON_LABELS.SET_UP_NEW_PASSWORD });
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText(/token has expired/i)).toBeInTheDocument();
            });

            await user.clear(passwordInput);
            await user.type(passwordInput, 'AnotherPassword123*');

            await waitFor(() => {
                expect(screen.queryByText(/token has expired/i)).toBeNull();
            });
        });

        it('disables submit button while loading on step 3', async () => {
            localStorageMock.setItem('password_reset_token', 'test-token-123');
            mockCustomInstance
                .mockResolvedValueOnce({
                    token: 'test-token-123',
                    message: 'Password reset code sent to your email',
                })
                .mockResolvedValueOnce({
                    message: 'Code verified successfully',
                })
                .mockImplementation(
                    () => new Promise((resolve) => setTimeout(() => resolve({ message: 'ok' }), 100))
                );

            const { user } = await setup();

            const emailInput = screen.getByLabelText(/email/i);
            await user.type(emailInput, 'test@example.com');

            const submitButton1 = screen.getByRole('button', { name: BUTTON_LABELS.SEND_CODE_ON_EMAIL });
            await user.click(submitButton1);

            await waitFor(() => {
                expect(screen.getByText(/insert code/i)).toBeInTheDocument();
            });

            const codeInput = screen.getByLabelText(/secret code/i);
            await user.type(codeInput, '123456');

            const submitButton2 = screen.getByRole('button', { name: BUTTON_LABELS.RESET_PASSWORD });
            await user.click(submitButton2);

            await waitFor(() => {
                expect(screen.getByText(/enter new password/i)).toBeInTheDocument();
            });

            const passwordInput = screen.getByPlaceholderText(/enter new password/i);
            await user.type(passwordInput, 'NewPassword123*');

            const confirmPasswordInput = screen.getByPlaceholderText(/confirm new password/i);
            await user.type(confirmPasswordInput, 'NewPassword123*');

            const submitButton3 = screen.getByRole('button', { name: BUTTON_LABELS.SET_UP_NEW_PASSWORD });
            await user.click(submitButton3);

            // Button should be disabled while loading
            await waitFor(() => {
                expect(submitButton3).toHaveProperty('disabled', true);
            });

            // Let the delayed mock resolve so async handlers (e.g. localStorage) do not leak into the next test
            await act(async () => {
                await new Promise((resolve) => setTimeout(resolve, 150));
            });
        });
    });

    describe('Step Navigation', () => {
        it('displays correct step title for each step', async () => {
            const { user } = await setup();

            expect(screen.getByText(/insert your email/i)).toBeInTheDocument();
            await navigateToStep2(user);

            mockCustomInstance.mockResolvedValue({
                message: 'Code verified successfully',
            });

            const codeInput = screen.getByLabelText(/secret code/i);
            await user.type(codeInput, '123456');

            const submitButton2 = screen.getByRole('button', { name: BUTTON_LABELS.RESET_PASSWORD });
            await user.click(submitButton2);

            await waitFor(() => {
                expect(screen.getByText(/enter new password/i)).toBeInTheDocument();
            });
        });

        it('cannot go back from step 1', async () => {
            await setup();

            // There should be no back button on step 1
            expect(screen.queryByRole('button', { name: BUTTON_LABELS.BACK })).not.toBeInTheDocument();
        });

        it('shows "Request New Code" and returns to step 1 after max attempts exceeded', async () => {
            localStorageMock.setItem('password_reset_token', 'test-token-123');
            mockCustomInstance
                .mockResolvedValueOnce({
                    token: 'test-token-123',
                    message: 'Password reset code sent to your email',
                })
                .mockRejectedValueOnce({
                    status: 429,
                    message: 'Maximum attempts exceeded. This session has been invalidated.',
                });

            const { user } = await setup();

            const emailInput = screen.getByLabelText(/email/i);
            await user.type(emailInput, 'test@example.com');
            const submitButton1 = screen.getByRole('button', { name: BUTTON_LABELS.SEND_CODE_ON_EMAIL });
            await user.click(submitButton1);

            await waitFor(() => {
                expect(screen.getByText(/insert code/i)).toBeInTheDocument();
            });

            const codeInput = screen.getByLabelText(/secret code/i);
            await user.type(codeInput, '123456');
            const submitButton2 = screen.getByRole('button', { name: BUTTON_LABELS.RESET_PASSWORD });
            await user.click(submitButton2);

            await waitFor(() => {
                expect(screen.getByText(/maximum attempts exceeded/i)).toBeInTheDocument();
            });

            // Session is invalidated and the "Request New Code" button replaces the form
            expect(localStorageMock.getItem('password_reset_token')).toBeNull();
            const requestNewCodeButton = screen.getByRole('button', { name: /request new code/i });
            expect(requestNewCodeButton).toBeInTheDocument();

            await user.click(requestNewCodeButton);

            await waitFor(() => {
                expect(screen.getByText(/insert your email/i)).toBeInTheDocument();
            });
        });

        it('shows token validation error on step 3 when API returns token error', async () => {
            localStorageMock.setItem('password_reset_token', 'test-token-123');
            mockCustomInstance
                .mockResolvedValueOnce({
                    token: 'test-token-123',
                    message: 'Password reset code sent to your email',
                })
                .mockResolvedValueOnce({
                    message: 'Code verified successfully',
                })
                .mockRejectedValueOnce({
                    message: 'Validation failed',
                    errors: [
                        {
                            path: ['token'],
                            message: 'Invalid or expired token',
                        },
                    ],
                });

            const { user } = await setup();

            const emailInput = screen.getByLabelText(/email/i);
            await user.type(emailInput, 'test@example.com');
            const submitButton1 = screen.getByRole('button', { name: BUTTON_LABELS.SEND_CODE_ON_EMAIL });
            await user.click(submitButton1);

            await waitFor(() => {
                expect(screen.getByText(/insert code/i)).toBeInTheDocument();
            });

            const codeInput = screen.getByLabelText(/secret code/i);
            await user.type(codeInput, '123456');
            const submitButton2 = screen.getByRole('button', { name: BUTTON_LABELS.RESET_PASSWORD });
            await user.click(submitButton2);

            await waitFor(() => {
                expect(screen.getByText(/enter new password/i)).toBeInTheDocument();
            });

            const passwordInput = screen.getByPlaceholderText(/enter new password/i);
            await user.type(passwordInput, 'NewPassword123*');
            const confirmPasswordInput = screen.getByPlaceholderText(/confirm new password/i);
            await user.type(confirmPasswordInput, 'NewPassword123*');

            const submitButton3 = screen.getByRole('button', { name: BUTTON_LABELS.SET_UP_NEW_PASSWORD });
            await user.click(submitButton3);

            await waitFor(() => {
                expect(screen.getByText(/invalid or expired token/i)).toBeInTheDocument();
            });
        });
    });
});

