import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthRoute } from './AuthRoute';
import { useAuth } from '../contexts/AuthContext';

jest.mock('../contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.Mock;

const setup = (initialPath: string) => {
    render(
        <MemoryRouter
            initialEntries={[initialPath]}
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <Routes>
                <Route
                    path="/sign-in"
                    element={
                        <AuthRoute>
                            <div>Sign In Form</div>
                        </AuthRoute>
                    }
                />
                <Route path="/dashboard" element={<div>Dashboard Page</div>} />
            </Routes>
        </MemoryRouter>
    );
};

describe('AuthRoute', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            login: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
            token: null,
        });
    });

    it('renders children when the user is not authenticated', () => {
        setup('/sign-in');

        expect(screen.getByText('Sign In Form')).toBeInTheDocument();
        expect(screen.queryByText('Dashboard Page')).not.toBeInTheDocument();
    });

   
});
