import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

jest.mock('../contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.Mock;

const LocationProbe = () => {
    const location = useLocation();
    return <div>Location: {location.pathname}</div>;
};

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
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <div>Dashboard Page</div>
                        </ProtectedRoute>
                    }
                />
                <Route path="/sign-in" element={<div>Sign In Form</div>} />
                <Route path="*" element={<LocationProbe />} />
            </Routes>
        </MemoryRouter>
    );
};

describe('ProtectedRoute', () => {
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

    it('renders nothing while auth state is loading', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            isLoading: true,
            user: null,
            login: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
            token: null,
        });

        setup('/dashboard');

        expect(screen.queryByText('Dashboard Page')).not.toBeInTheDocument();
        expect(screen.queryByText('Sign In Form')).not.toBeInTheDocument();
    });

    it('renders children when the user is authenticated', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            isLoading: false,
            user: { id: 1, email: 'test@example.com', nickname: 'tester' },
            login: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
            token: 'token',
        });

        setup('/dashboard');

        expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });

    it('redirects to /sign-in when the user is not authenticated', () => {
        setup('/dashboard');

        expect(screen.getByText('Sign In Form')).toBeInTheDocument();
        expect(screen.queryByText('Dashboard Page')).not.toBeInTheDocument();
    });
});
