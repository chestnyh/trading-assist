import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import {
  authControllerLogin,
  authControllerLogout,
  authControllerMe,
} from '@trading-bot/api-client';

jest.mock('@trading-bot/api-client', () => ({
  authControllerLogin: jest.fn(),
  authControllerLogout: jest.fn(),
  authControllerMe: jest.fn(),
  isValidationError: jest.fn(() => false),
  extractFieldToMessageFromValidationError: jest.fn(() => ({})),
}));

const mockMe = authControllerMe as jest.Mock;
const mockLogin = authControllerLogin as jest.Mock;
const mockLogout = authControllerLogout as jest.Mock;

const Consumer = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  return (
    <div>
      <span data-testid="state">
        {isLoading ? 'loading' : isAuthenticated ? `in:${user?.email}` : 'out'}
      </span>
      <button onClick={() => void login('user@example.com', 'Password123*', false)}>login</button>
      <button onClick={() => void logout()}>logout</button>
    </div>
  );
};

const renderProvider = () =>
  render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>
  );

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('restores the signed-in state from the server (FR-007)', async () => {
    mockMe.mockResolvedValue({
      status: 200,
      data: { id: 1, email: 'user@example.com', nickname: 'tester', role: 'USER' },
    });

    renderProvider();

    expect(await screen.findByText('in:user@example.com')).toBeInTheDocument();
  });

  it('treats a rejected session lookup as signed out', async () => {
    mockMe.mockRejectedValue({ status: 401 });

    renderProvider();

    expect(await screen.findByText('out')).toBeInTheDocument();
  });

  it('removes legacy stored credentials on bootstrap and never trusts them (FR-014)', async () => {
    window.localStorage.setItem('auth_token', 'stale');
    window.localStorage.setItem('user_data', '{"id":1}');
    window.sessionStorage.setItem('auth_token', 'stale-session');
    mockMe.mockRejectedValue({ status: 401 });

    renderProvider();

    expect(await screen.findByText('out')).toBeInTheDocument();
    expect(window.localStorage.getItem('auth_token')).toBeNull();
    expect(window.localStorage.getItem('user_data')).toBeNull();
    expect(window.sessionStorage.getItem('auth_token')).toBeNull();
  });

  it('signs in without persisting any credential (FR-002/FR-008)', async () => {
    mockMe.mockRejectedValue({ status: 401 });
    mockLogin.mockResolvedValue({
      status: 200,
      data: { user: { id: 1, email: 'user@example.com', nickname: 'tester', role: 'USER' } },
    });

    renderProvider();
    await screen.findByText('out');

    fireEvent.click(screen.getByText('login'));

    expect(await screen.findByText('in:user@example.com')).toBeInTheDocument();
    expect(window.localStorage.getItem('auth_token')).toBeNull();
    expect(window.sessionStorage.getItem('auth_token')).toBeNull();
  });

  it('signs out through the API and clears local state (FR-009)', async () => {
    mockMe.mockResolvedValue({
      status: 200,
      data: { id: 1, email: 'user@example.com', nickname: 'tester', role: 'USER' },
    });
    mockLogout.mockResolvedValue({ status: 200, data: { success: true } });

    renderProvider();
    await screen.findByText('in:user@example.com');

    fireEvent.click(screen.getByText('logout'));

    await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('out'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('stays signed out when sign-out fails, without throwing', async () => {
    mockMe.mockResolvedValue({
      status: 200,
      data: { id: 1, email: 'user@example.com', nickname: 'tester', role: 'USER' },
    });
    mockLogout.mockRejectedValue({ status: 500 });

    renderProvider();
    await screen.findByText('in:user@example.com');

    fireEvent.click(screen.getByText('logout'));

    await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('out'));
  });
});
