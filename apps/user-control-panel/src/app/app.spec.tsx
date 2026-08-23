import { render, screen } from '@testing-library/react';
import App from './app';
import { useAuth } from './contexts/AuthContext';

jest.mock('./contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: jest.fn(),
}));

jest.mock('./contexts/RulesContext', () => ({
  RulesProvider: ({ children }: { children: React.ReactNode }) => children,
  useRules: jest.fn(() => ({
    rules: [],
    isLoading: false,
    error: null,
  })),
}));


const mockedUseAuth = useAuth as jest.Mock;

describe('App', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: jest.fn(),
      signUp: jest.fn(),
      logout: jest.fn(),
      token: null,
    });

    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('renders nothing while auth state is loading', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      login: jest.fn(),
      signUp: jest.fn(),
      logout: jest.fn(),
      token: null,
    });
    window.history.pushState({}, '', '/dashboard');

    render(<App />);

    expect(screen.queryByText(/dashboard/i)).not.toBeInTheDocument();
    expect(window.location.pathname).toBe('/dashboard');
  });

  it('redirects an unauthenticated user from an unknown route to /sign-in', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: jest.fn(),
      signUp: jest.fn(),
      logout: jest.fn(),
      token: null,
    });
    window.history.pushState({}, '', '/some/unknown/path');

    render(<App />);

    expect(window.location.pathname).toBe('/sign-in');
  });

  it('shows NotFound for an unknown route when the user is authenticated', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: '1' },
      login: jest.fn(),
      signUp: jest.fn(),
      logout: jest.fn(),
      token: 'token',
    });
    window.history.pushState({}, '', '/some/unknown/path');
    render(<App />);
    expect(window.location.pathname).toBe('/some/unknown/path');
  });

  it('keeps an unauthenticated user on /sign-in', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: jest.fn(),
      signUp: jest.fn(),
      logout: jest.fn(),
      token: null,
    });

    window.history.pushState({}, '', '/sign-in');

    render(<App />);

    expect(window.location.pathname).toBe('/sign-in');
  });

  it('redirects an already authenticated user away from /sign-in to /dashboard', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: '1' },
      login: jest.fn(),
      signUp: jest.fn(),
      logout: jest.fn(),
      token: 'token',
    });

    window.history.pushState({}, '', '/sign-in');

    render(<App />);

    expect(window.location.pathname).toBe('/dashboard');
  });

  it('lets an authenticated user access a protected route', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: '1' },
      login: jest.fn(),
      signUp: jest.fn(),
      logout: jest.fn(),
      token: 'token',
    });

    window.history.pushState({}, '', '/dashboard');

    render(<App />);

    expect(window.location.pathname).toBe('/dashboard');
  });

  it('redirects an unauthenticated user away from a protected route to /sign-in, replacing history', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: jest.fn(),
      signUp: jest.fn(),
      logout: jest.fn(),
      token: null,
    });

    window.history.pushState({}, '', '/dashboard');
    const lengthBefore = window.history.length;

    render(<App />);

    expect(window.location.pathname).toBe('/sign-in');
    expect(window.history.length).toBe(lengthBefore);
  });
});