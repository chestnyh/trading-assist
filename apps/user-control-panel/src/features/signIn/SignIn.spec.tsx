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

    it('logs in and navigates on success', async () => {
        mockLogin.mockResolvedValue({ success: true });

        const { user } = await setup();

        await user.type(screen.getByLabelText(/email/i), 'test@example.com');
        await user.type(screen.getByPlaceholderText(/enter your password/i), 'password123');

        const signInButton = screen.getByRole('button', { name: /^sign in$/i });
        expect(signInButton).not.toBeDisabled();

        await user.click(signInButton);

        await waitFor(() => expect(mockLogin).toHaveBeenCalled(), { timeout: 3000 });

        // expect(mockLogin).toHaveBeenCalledWith({ email:'test@example.com', password:'password123', rememberMe:false })

        await waitFor(() => expect(mockNavigate).toHaveBeenCalled(), { timeout: 3000 });

    });
});
