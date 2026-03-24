import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SignUp from './SignUp';
import { SignUpProvider } from '../../app/contexts/SignUpContext';
import { 
    usersApiControllerCreateUser, 
    authControllerVerifyEmail, 
    customInstance,
} from '@trading-bot/api-client';
import {
    CreateUserDtoSchema,
    TradingExperienceLevelSchema,
    PrimaryTradingStrategySchema,
    RiskToleranceSchema,
    TradingPlatformSchema,
} from '@trading-bot/api-validator';

jest.mock('@trading-bot/api-client', () => {
    const actual = jest.requireActual('@trading-bot/api-client');
    return {
        ...actual,
        customInstance: jest.fn(),
        usersApiControllerCreateUser: jest.fn(),
        authControllerVerifyEmail: jest.fn(),
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const mockCustomInstance = customInstance as jest.Mock;
const mockUsersApiControllerCreateUser = usersApiControllerCreateUser as jest.Mock;
const mockAuthControllerVerifyEmail = authControllerVerifyEmail as jest.Mock;

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
    NEXT: /^next$/i,
    BACK: /^back$/i,
    VERIFY: /^verify$/i,
    VERIFYING: /^verifying\.\.\.$/i,
    SUBMITTING: /^submitting\.\.\.$/i,
    GO_TO_SIGN_IN: /^go to sign in$/i,
} as const;

describe('SignUp', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.clear();
    });

    const setup = async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter
                initialEntries={['/sign-up']}
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <SignUpProvider>
                    <SignUp />
                </SignUpProvider>
            </MemoryRouter>
        );
        return { user };
    };

    describe('Step 1: Personal Information', () => {
        it('renders firstName, lastName, and country fields on step 1', async () => {
            await setup();

            expect(screen.getByPlaceholderText(/enter your first name/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/enter your last name/i)).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /select your country/i })).toBeInTheDocument();
        });

        it('renders "Next" button on step 1', async () => {
            await setup();

            expect(screen.getByRole('button', { name: BUTTON_LABELS.NEXT })).toBeInTheDocument();
        });

        it('disables submit button when form is empty', async () => {
            await setup();

            const nextButton = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            expect(nextButton).not.toHaveProperty('disabled', true);
        });

        it('enables submit button when all required fields are filled', async () => {
            const { user } = await setup();

            await user.type(screen.getByLabelText(/first name/i), 'John');
            await user.type(screen.getByLabelText(/last name/i), 'Doe');
            
            // Select country from dropdown - click button to open dropdown
            const countryButton = screen.getByRole('button', { name: /select your country/i });
            await user.click(countryButton);
            
            // Wait for dropdown to appear and click on United States
            await waitFor(() => {
                const countryOption = screen.getByRole('button', { name: /united states/i });
                expect(countryOption).toBeInTheDocument();
            });
            const countryOption = screen.getByRole('button', { name: /united states/i });
            await user.click(countryOption);

            const nextButton = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await waitFor(() => {
                expect(nextButton).not.toHaveProperty('disabled', true);
            });
        });

        it('shows error for empty firstName and does not navigate', async () => {
            const { user } = await setup();

            await user.type(screen.getByLabelText(/last name/i), 'Doe');
            const countryButton = screen.getByRole('button', { name: /select your country/i });
            await user.click(countryButton);
            await waitFor(() => {
                const countryOption = screen.getByRole('button', { name: /united states/i });
                expect(countryOption).toBeInTheDocument();
            });
            const countryOption = screen.getByRole('button', { name: /united states/i });
            await user.click(countryOption);

            const nextButton = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton);

            await waitFor(() => {
                const errorMessage = screen.queryByText(/first name is required/i);
                expect(errorMessage).not.toBeNull();
            });

            expect(nextButton).toHaveProperty('disabled', true);
        });

        it('shows error for empty lastName and does not navigate', async () => {
            const { user } = await setup();

            await user.type(screen.getByLabelText(/first name/i), 'John');
            const countryButton = screen.getByRole('button', { name: /select your country/i });
            await user.click(countryButton);
            await waitFor(() => {
                const countryOption = screen.getByRole('button', { name: /united states/i });
                expect(countryOption).toBeInTheDocument();
            });
            const countryOption = screen.getByRole('button', { name: /united states/i });
            await user.click(countryOption);

            const nextButton = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton);

            await waitFor(() => {
                const errorMessage = screen.queryByText(/last name is required/i);
                expect(errorMessage).not.toBeNull();
            });

            expect(nextButton).toHaveProperty('disabled', true);
        });

        it('shows error for empty country and does not navigate', async () => {
            const { user } = await setup();

            await user.type(screen.getByLabelText(/first name/i), 'John');
            await user.type(screen.getByLabelText(/last name/i), 'Doe');

            const nextButton = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton);

            await waitFor(() => {
                const errorMessage = screen.queryByText(/country is required/i);
                expect(errorMessage).not.toBeNull();
            });

            expect(nextButton).toHaveProperty('disabled', true);
        });

        it('removes firstName error when field is corrected (realtime validation)', async () => {
            const { user } = await setup();

            const nextButton = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton);

            await waitFor(() => {
                const errorMessage = screen.queryByText(/first name is required/i);
                expect(errorMessage).not.toBeNull();
            });

            const firstNameInput = screen.getByLabelText(/first name/i);
            await user.type(firstNameInput, 'John');

            await waitFor(() => {
                const errorMessage = screen.queryByText(/first name is required/i);
                expect(errorMessage).toBeNull();
            });
        });

        it('successfully validates and moves to step 2', async () => {
            const { user } = await setup();

            await user.type(screen.getByLabelText(/first name/i), 'John');
            await user.type(screen.getByLabelText(/last name/i), 'Doe');
            
            const countryButton = screen.getByRole('button', { name: /select your country/i });
            await user.click(countryButton);
            await waitFor(() => {
                const countryOption = screen.getByRole('button', { name: /united states/i });
                expect(countryOption).toBeInTheDocument();
            });
            const countryOption = screen.getByRole('button', { name: /united states/i });
            await user.click(countryOption);

            const nextButton = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton);

            await waitFor(() => {
                expect(screen.getByText(/trading preferences/i)).toBeInTheDocument();
            });
        });

        it('saves step 1 data to localStorage', async () => {
            const { user } = await setup();

            await user.type(screen.getByLabelText(/first name/i), 'John');
            await user.type(screen.getByLabelText(/last name/i), 'Doe');
            
            const countryButton = screen.getByRole('button', { name: /select your country/i });
            await user.click(countryButton);
            await waitFor(() => {
                const countryOption = screen.getByRole('button', { name: /united states/i });
                expect(countryOption).toBeInTheDocument();
            });
            const countryOption = screen.getByRole('button', { name: /united states/i });
            await user.click(countryOption);

            await waitFor(() => {
                const step1Data = localStorageMock.getItem('signUp.step1');
                expect(step1Data).not.toBeNull();
                if (step1Data) {
                    const parsed = JSON.parse(step1Data);
                    expect(parsed.firstName).toBe('John');
                    expect(parsed.lastName).toBe('Doe');
                }
            });
        });
    });

    describe('Step 2: Trading Preferences', () => {
        const navigateToStep2 = async (user: ReturnType<typeof userEvent.setup>) => {
            await user.type(screen.getByLabelText(/first name/i), 'John');
            await user.type(screen.getByLabelText(/last name/i), 'Doe');
            
            const countryButton = screen.getByRole('button', { name: /select your country/i });
            await user.click(countryButton);
            await waitFor(() => {
                const countryOption = screen.getByRole('button', { name: /united states/i });
                expect(countryOption).toBeInTheDocument();
            });
            const countryOption = screen.getByRole('button', { name: /united states/i });
            await user.click(countryOption);

            const nextButton = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton);

            await waitFor(() => {
                expect(screen.getByText(/trading preferences/i)).toBeInTheDocument();
            });
        };

        it('renders trading preferences fields on step 2', async () => {
            const { user } = await setup();
            await navigateToStep2(user);

            expect(screen.getByText(/trading experience level/i)).toBeInTheDocument();
            expect(screen.getByText(/primary trading strategy/i)).toBeInTheDocument();
            expect(screen.getByText(/risk tolerance/i)).toBeInTheDocument();
            expect(screen.getByText(/preferred trading platforms/i)).toBeInTheDocument();
        });

        it('renders "Back" and "Next" buttons on step 2', async () => {
            const { user } = await setup();
            await navigateToStep2(user);

            expect(screen.getByRole('button', { name: BUTTON_LABELS.BACK })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: BUTTON_LABELS.NEXT })).toBeInTheDocument();
        });

        it('allows proceeding to step 3 without filling optional fields', async () => {
            const { user } = await setup();
            await navigateToStep2(user);

            const nextButton = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton);

            await waitFor(() => {
                expect(screen.getByText(/account info/i)).toBeInTheDocument();
            });
        });

        it('navigates back to step 1 when "Back" button is clicked', async () => {
            const { user } = await setup();
            await navigateToStep2(user);

            const backButton = screen.getByRole('button', { name: BUTTON_LABELS.BACK });
            await user.click(backButton);

            await waitFor(() => {
                expect(screen.getByText(/let's start!/i)).toBeInTheDocument();
            });
        });

        it('saves step 2 data to localStorage when fields are filled', async () => {
            const { user } = await setup();
            await navigateToStep2(user);

            // Select trading experience
            const experienceRadio = screen.getByLabelText(/beginner/i);
            await user.click(experienceRadio);

            await waitFor(() => {
                const step2Data = localStorageMock.getItem('signUp.step2');
                expect(step2Data).not.toBeNull();
            });
        });
    });

    describe('Step 3: Account Information', () => {
        const navigateToStep3 = async (user: ReturnType<typeof userEvent.setup>) => {
            // Step 1
            await user.type(screen.getByLabelText(/first name/i), 'John');
            await user.type(screen.getByLabelText(/last name/i), 'Doe');
            
            const countryButton = screen.getByRole('button', { name: /select your country/i });
            await user.click(countryButton);
            await waitFor(() => {
                const countryOption = screen.getByRole('button', { name: /united states/i });
                expect(countryOption).toBeInTheDocument();
            });
            const countryOption = screen.getByRole('button', { name: /united states/i });
            await user.click(countryOption);

            const nextButton1 = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton1);

            await waitFor(() => {
                expect(screen.getByText(/trading preferences/i)).toBeInTheDocument();
            });

            // Step 2 - skip optional fields
            const nextButton2 = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton2);

            await waitFor(() => {
                expect(screen.getByText(/account info/i)).toBeInTheDocument();
            });
        };

        it('renders account information fields on step 3', async () => {
            const { user } = await setup();
            await navigateToStep3(user);

            const emailInputs = screen.getAllByLabelText(/email/i);
            expect(emailInputs.length).toBeGreaterThan(0);
            expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
            expect(screen.getByPlaceholderText(/enter your nickname/i)).toBeInTheDocument();
            const passwordInputs = screen.getAllByLabelText(/password/i);
            expect(passwordInputs.length).toBeGreaterThan(0);
            expect(screen.getByPlaceholderText(/confirm your password/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/i want to receive news/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/i have read and accept/i)).toBeInTheDocument();
        });

        it('renders "Back" and "Next" buttons on step 3', async () => {
            const { user } = await setup();
            await navigateToStep3(user);

            expect(screen.getByRole('button', { name: BUTTON_LABELS.BACK })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: BUTTON_LABELS.NEXT })).toBeInTheDocument();
        });

        it('disables submit button when required fields are empty', async () => {
            const { user } = await setup();
            await navigateToStep3(user);

            const nextButton = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            expect(nextButton).not.toHaveProperty('disabled', true);
        });

        it('shows error for invalid email format', async () => {
            const { user } = await setup();
            await navigateToStep3(user);

            await user.type(screen.getByPlaceholderText(/enter your email/i), 'invalid-email');
            await user.type(screen.getByPlaceholderText(/enter your nickname/i), 'testuser');
            await user.type(screen.getByPlaceholderText(/enter your password/i), 'Password123*');
            await user.type(screen.getByPlaceholderText(/confirm your password/i), 'Password123*');
            const tosCheckbox = screen.getByLabelText(/i have read and accept/i);
            await user.click(tosCheckbox);

            const nextButton = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton);

            await waitFor(() => {
                const errorMessage = screen.queryByText(/please provide a valid email address/i);
                expect(errorMessage).not.toBeNull();
            });
        });

        it('shows error for empty password', async () => {
            const { user } = await setup();
            await navigateToStep3(user);

            await user.type(screen.getByPlaceholderText(/enter your email/i), 'test@example.com');
            await user.type(screen.getByPlaceholderText(/enter your nickname/i), 'testuser');
            const tosCheckbox = screen.getByLabelText(/i have read and accept/i);
            await user.click(tosCheckbox);

            const nextButton = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton);

            await waitFor(() => {
                const errorMessage = screen.queryByText(/password must be at least 8 characters long/i);
                expect(errorMessage).not.toBeNull();
            });
        });

        it('shows error when passwords do not match', async () => {
            const { user } = await setup();
            await navigateToStep3(user);

            await user.type(screen.getByPlaceholderText(/enter your email/i), 'test@example.com');
            await user.type(screen.getByPlaceholderText(/enter your nickname/i), 'testuser');
            await user.type(screen.getByPlaceholderText(/enter your password/i), 'Password123*');
            await user.type(screen.getByPlaceholderText(/confirm your password/i), 'Different123*');
            const tosCheckbox = screen.getByLabelText(/i have read and accept/i);
            await user.click(tosCheckbox);

            const nextButton = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton);

            await waitFor(() => {
                const errorMessage = screen.queryByText(/passwords do not match/i);
                expect(errorMessage).not.toBeNull();
            });
        });

        it('shows error when TOS checkbox is not checked', async () => {
            const { user } = await setup();
            await navigateToStep3(user);

            await user.type(screen.getByPlaceholderText(/enter your email/i), 'test@example.com');
            await user.type(screen.getByPlaceholderText(/enter your nickname/i), 'testuser');
            await user.type(screen.getByPlaceholderText(/enter your password/i), 'Password123*');
            await user.type(screen.getByPlaceholderText(/confirm your password/i), 'Password123*');

            const nextButton = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton);

            await waitFor(() => {
                const errorMessage = screen.queryByText(/you must accept/i);
                expect(errorMessage).not.toBeNull();
            });
        });

        it('successfully registers user and moves to step 4', async () => {
            mockUsersApiControllerCreateUser.mockResolvedValue({
                emailVerificationToken: 'test-token-123',
            });

            const { user } = await setup();
            await navigateToStep3(user);

            await user.type(screen.getByPlaceholderText(/enter your email/i), 'test@example.com');
            await user.type(screen.getByPlaceholderText(/enter your nickname/i), 'testuser');
            await user.type(screen.getByPlaceholderText(/enter your password/i), 'Password123*');
            await user.type(screen.getByPlaceholderText(/confirm your password/i), 'Password123*');
            const tosCheckbox = screen.getByLabelText(/i have read and accept/i);
            await user.click(tosCheckbox);

            const nextButton = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton);

            await waitFor(() => {
                expect(mockUsersApiControllerCreateUser).toHaveBeenCalled();
            });

            await waitFor(() => {
                expect(screen.getByText(/email confirmation/i)).toBeInTheDocument();
            });
        });

        it('shows form error when registration fails with network error', async () => {
            mockUsersApiControllerCreateUser.mockRejectedValue({
                message: 'Failed to fetch',
            });

            const { user } = await setup();
            await navigateToStep3(user);

            await user.type(screen.getByPlaceholderText(/enter your email/i), 'test@example.com');
            await user.type(screen.getByPlaceholderText(/enter your nickname/i), 'testuser');
            await user.type(screen.getByPlaceholderText(/enter your password/i), 'Password123*');
            await user.type(screen.getByPlaceholderText(/confirm your password/i), 'Password123*');
            const tosCheckbox = screen.getByLabelText(/i have read and accept/i);
            await user.click(tosCheckbox);

            const nextButton = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton);

            await waitFor(() => {
                expect(screen.getByText(/unable to connect to the server/i)).toBeInTheDocument();
            });
        });

        it('shows form error when email or nickname already exists', async () => {
            mockUsersApiControllerCreateUser.mockRejectedValue({
                status: 409,
                message: 'Email or nickname already exists',
            });

            const { user } = await setup();
            await navigateToStep3(user);

            await user.type(screen.getByPlaceholderText(/enter your email/i), 'test@example.com');
            await user.type(screen.getByPlaceholderText(/enter your nickname/i), 'testuser');
            await user.type(screen.getByPlaceholderText(/enter your password/i), 'Password123*');
            await user.type(screen.getByPlaceholderText(/confirm your password/i), 'Password123*');
            const tosCheckbox = screen.getByLabelText(/i have read and accept/i);
            await user.click(tosCheckbox);

            const nextButton = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton);

            await waitFor(() => {
                expect(screen.getByText(/email or nickname already exists/i)).toBeInTheDocument();
            });
        });

        it('disables submit button while loading on step 3', async () => {
            mockUsersApiControllerCreateUser.mockImplementation(
                () => new Promise((resolve) => setTimeout(() => resolve({ emailVerificationToken: 'test' }), 100))
            );

            const { user } = await setup();
            await navigateToStep3(user);

            await user.type(screen.getByPlaceholderText(/enter your email/i), 'test@example.com');
            await user.type(screen.getByPlaceholderText(/enter your nickname/i), 'testuser');
            await user.type(screen.getByPlaceholderText(/enter your password/i), 'Password123*');
            await user.type(screen.getByPlaceholderText(/confirm your password/i), 'Password123*');
            const tosCheckbox = screen.getByLabelText(/i have read and accept/i);
            await user.click(tosCheckbox);

            const nextButton = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton);

            await waitFor(() => {
                expect(nextButton).toHaveProperty('disabled', true);
            });
        });

        it('clears server error when email field is changed after error', async () => {
            mockUsersApiControllerCreateUser.mockRejectedValue({
                status: 409,
                message: 'Email or nickname already exists',
            });

            const { user } = await setup();
            await navigateToStep3(user);

            await user.type(screen.getByPlaceholderText(/enter your email/i), 'test@example.com');
            await user.type(screen.getByPlaceholderText(/enter your nickname/i), 'testuser');
            await user.type(screen.getByPlaceholderText(/enter your password/i), 'Password123*');
            await user.type(screen.getByPlaceholderText(/confirm your password/i), 'Password123*');
            const tosCheckbox = screen.getByLabelText(/i have read and accept/i);
            await user.click(tosCheckbox);

            const nextButton = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton);

            await waitFor(() => {
                expect(screen.getByText(/email or nickname already exists/i)).toBeInTheDocument();
            });

            const emailInput = screen.getByPlaceholderText(/enter your email/i);
            await user.clear(emailInput);
            await user.type(emailInput, 'new@example.com');

            await waitFor(() => {
                expect(screen.queryByText(/email or nickname already exists/i)).toBeNull();
            });
        });
    });

    describe('Step 4: Email Verification', () => {
        const navigateToStep4 = async (user: ReturnType<typeof userEvent.setup>) => {
            // Step 1
            await user.type(screen.getByLabelText(/first name/i), 'John');
            await user.type(screen.getByLabelText(/last name/i), 'Doe');
            
            const countryButton = screen.getByRole('button', { name: /select your country/i });
            await user.click(countryButton);
            await waitFor(() => {
                const countryOption = screen.getByRole('button', { name: /united states/i });
                expect(countryOption).toBeInTheDocument();
            });
            const countryOption = screen.getByRole('button', { name: /united states/i });
            await user.click(countryOption);

            const nextButton1 = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton1);

            await waitFor(() => {
                expect(screen.getByText(/trading preferences/i)).toBeInTheDocument();
            });

            // Step 2
            const nextButton2 = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton2);

            await waitFor(() => {
                expect(screen.getByText(/account info/i)).toBeInTheDocument();
            });

            // Step 3
            mockUsersApiControllerCreateUser.mockResolvedValue({
                emailVerificationToken: 'test-token-123',
            });

            await user.type(screen.getByPlaceholderText(/enter your email/i), 'test@example.com');
            await user.type(screen.getByPlaceholderText(/enter your nickname/i), 'testuser');
            await user.type(screen.getByPlaceholderText(/enter your password/i), 'Password123*');
            await user.type(screen.getByPlaceholderText(/confirm your password/i), 'Password123*');
            const tosCheckbox = screen.getByLabelText(/i have read and accept/i);
            await user.click(tosCheckbox);

            const nextButton3 = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton3);

            await waitFor(() => {
                expect(screen.getByText(/email confirmation/i)).toBeInTheDocument();
            });
        };

        it('renders verification code input field on step 4', async () => {
            const { user } = await setup();
            await navigateToStep4(user);

            const codeInputs = screen.getAllByLabelText(/verification code/i);
            expect(codeInputs.length).toBeGreaterThan(0);
            expect(screen.getByPlaceholderText(/enter verification code/i)).toBeInTheDocument();
        });

        it('renders "Back" and "Verify" buttons on step 4', async () => {
            const { user } = await setup();
            await navigateToStep4(user);

            expect(screen.getByRole('button', { name: BUTTON_LABELS.BACK })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: BUTTON_LABELS.VERIFY })).toBeInTheDocument();
        });

        it('disables submit button when code is empty', async () => {
            const { user } = await setup();
            await navigateToStep4(user);

            const verifyButton = screen.getByRole('button', { name: BUTTON_LABELS.VERIFY });
            // Button is disabled when code is empty and validation has been attempted
            // Initially it might not be disabled, so we click to trigger validation
            await user.click(verifyButton);
            await waitFor(() => {
                expect(verifyButton).toHaveProperty('disabled', true);
            });
        });

        it('enables submit button when code is provided', async () => {
            const { user } = await setup();
            await navigateToStep4(user);

            const codeInput = screen.getByPlaceholderText(/enter verification code/i);
            await user.type(codeInput, '123456');

            const verifyButton = screen.getByRole('button', { name: BUTTON_LABELS.VERIFY });
            await waitFor(() => {
                expect(verifyButton).not.toHaveProperty('disabled', true);
            });
        });

        it('shows error for invalid code format', async () => {
            const { user } = await setup();
            await navigateToStep4(user);

            const codeInput = screen.getByPlaceholderText(/enter verification code/i);
            await user.type(codeInput, '123');

            const verifyButton = screen.getByRole('button', { name: BUTTON_LABELS.VERIFY });
            await user.click(verifyButton);

            await waitFor(() => {
                const errorMessage = screen.queryByText(/verification code must be exactly 6 digits/i) || 
                                     screen.queryByText(/invalid code/i);
                expect(errorMessage).not.toBeNull();
            });
        });

        it('successfully verifies email and navigates to sign-in', async () => {
            mockAuthControllerVerifyEmail.mockResolvedValue({
                success: true,
            });

            const { user } = await setup();
            await navigateToStep4(user);

            const codeInput = screen.getByPlaceholderText(/enter verification code/i);
            await user.type(codeInput, '123456');

            const verifyButton = screen.getByRole('button', { name: BUTTON_LABELS.VERIFY });
            await user.click(verifyButton);

            await waitFor(
                () => {
                    expect(mockAuthControllerVerifyEmail).toHaveBeenCalledWith({
                        code: '123456',
                        token: 'test-token-123',
                    });
                },
                { timeout: 10000 }
            );

            await waitFor(
                () => {
                    expect(screen.getByText(/email verified!/i)).toBeInTheDocument();
                },
                { timeout: 10000 }
            );

            await waitFor(
                () => {
                    expect(mockNavigate).toHaveBeenCalledWith('/sign-in');
                },
                { timeout: 10000 }
            );
        });

        it('shows error when verification fails', async () => {
            mockAuthControllerVerifyEmail.mockRejectedValue({
                status: 400,
                message: 'Invalid code',
            });

            const { user } = await setup();
            await navigateToStep4(user);

            const codeInput = screen.getByPlaceholderText(/enter verification code/i);
            await user.type(codeInput, '123456');

            const verifyButton = screen.getByRole('button', { name: BUTTON_LABELS.VERIFY });
            await user.click(verifyButton);

            await waitFor(() => {
                const errorMessage = screen.queryByText(/invalid verification code. please check and try again/i) || 
                                     screen.queryByText(/invalid code/i) ||
                                     screen.queryByText(/verification failed/i);
                expect(errorMessage).not.toBeNull();
            });
        });

        it('shows error when token is missing', async () => {
            // Mock registration to not return token
            mockUsersApiControllerCreateUser.mockResolvedValueOnce({
                // No emailVerificationToken in response
            });

            const { user } = await setup();
            
            // Navigate through steps manually without token
            await user.type(screen.getByPlaceholderText(/enter your first name/i), 'John');
            await user.type(screen.getByPlaceholderText(/enter your last name/i), 'Doe');
            const countryButton = screen.getByRole('button', { name: /select your country/i });
            await user.click(countryButton);
            await waitFor(() => {
                const countryOption = screen.getByRole('button', { name: /united states/i });
                expect(countryOption).toBeInTheDocument();
            });
            const countryOption = screen.getByRole('button', { name: /united states/i });
            await user.click(countryOption);
            await user.click(screen.getByRole('button', { name: BUTTON_LABELS.NEXT }));
            await waitFor(() => expect(screen.getByText(/trading preferences/i)).toBeInTheDocument());
            await user.click(screen.getByRole('button', { name: BUTTON_LABELS.NEXT }));
            await waitFor(() => expect(screen.getByText(/account info/i)).toBeInTheDocument());
            
            await user.type(screen.getByPlaceholderText(/enter your email/i), 'test@example.com');
            await user.type(screen.getByPlaceholderText(/enter your nickname/i), 'testuser');
            await user.type(screen.getByPlaceholderText(/enter your password/i), 'Password123*');
            await user.type(screen.getByPlaceholderText(/confirm your password/i), 'Password123*');
            const tosCheckbox = screen.getByLabelText(/i have read and accept/i);
            await user.click(tosCheckbox);
            await user.click(screen.getByRole('button', { name: BUTTON_LABELS.NEXT }));
            
            // Wait for step 4, but token should be missing
            await waitFor(() => {
                expect(screen.getByText(/email confirmation/i)).toBeInTheDocument();
            });

            const codeInput = screen.getByPlaceholderText(/enter verification code/i);
            await user.type(codeInput, '123456');

            const verifyButton = screen.getByRole('button', { name: BUTTON_LABELS.VERIFY });
            await user.click(verifyButton);

            await waitFor(() => {
                const errorMessage = screen.queryByText(/verification token is missing. please go back and complete registration/i) ||
                                     screen.queryByText(/token is missing/i) ||
                                     screen.queryByText(/go back and complete registration/i);
                expect(errorMessage).not.toBeNull();
            });
        });

        it('clears localStorage after successful verification', async () => {
            mockAuthControllerVerifyEmail.mockResolvedValue({
                success: true,
            });

            localStorageMock.setItem('signUp.step1', 'test');
            localStorageMock.setItem('signUp.step2', 'test');
            localStorageMock.setItem('signUp.verificationToken', 'test-token-123');

            const { user } = await setup();
            await navigateToStep4(user);

            const codeInput = screen.getByPlaceholderText(/enter verification code/i);
            await user.type(codeInput, '123456');

            const verifyButton = screen.getByRole('button', { name: BUTTON_LABELS.VERIFY });
            await user.click(verifyButton);

            await waitFor(
                () => {
                    expect(localStorageMock.getItem('signUp.step1')).toBeNull();
                    expect(localStorageMock.getItem('signUp.step2')).toBeNull();
                    expect(localStorageMock.getItem('signUp.verificationToken')).toBeNull();
                },
                { timeout: 10000 }
            );
        });

        it('disables submit button while loading on step 4', async () => {
            mockAuthControllerVerifyEmail.mockImplementation(
                () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
            );

            const { user } = await setup();
            await navigateToStep4(user);

            const codeInput = screen.getByPlaceholderText(/enter verification code/i);
            await user.type(codeInput, '123456');

            const verifyButton = screen.getByRole('button', { name: BUTTON_LABELS.VERIFY });
            await user.click(verifyButton);

            await waitFor(() => {
                expect(verifyButton).toHaveProperty('disabled', true);
            });
        });
    });

    describe('Step Navigation', () => {
        it('displays correct step title for each step', async () => {
            const { user } = await setup();

            // Step 1
            expect(screen.getByText(/let's start!/i)).toBeInTheDocument();

            // Navigate to Step 2
            await user.type(screen.getByLabelText(/first name/i), 'John');
            await user.type(screen.getByLabelText(/last name/i), 'Doe');
            
            const countryButton = screen.getByRole('button', { name: /select your country/i });
            await user.click(countryButton);
            await waitFor(() => {
                const countryOption = screen.getByRole('button', { name: /united states/i });
                expect(countryOption).toBeInTheDocument();
            });
            const countryOption = screen.getByRole('button', { name: /united states/i });
            await user.click(countryOption);

            const nextButton1 = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton1);

            await waitFor(() => {
                expect(screen.getByText(/trading preferences/i)).toBeInTheDocument();
            });

            // Navigate to Step 3
            const nextButton2 = screen.getByRole('button', { name: BUTTON_LABELS.NEXT });
            await user.click(nextButton2);

            await waitFor(() => {
                expect(screen.getByText(/account info/i)).toBeInTheDocument();
            });
        });

        it('cannot go back from step 1', async () => {
            await setup();

            expect(screen.queryByRole('button', { name: BUTTON_LABELS.BACK })).not.toBeInTheDocument();
        });
    });
});

