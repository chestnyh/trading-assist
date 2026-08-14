import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { authControllerLogin } from '@trading-bot/api-client';

jest.mock('@trading-bot/api-client', () => {
  const actual = jest.requireActual('@trading-bot/api-client');
  return {
    ...actual,
    authControllerLogin: jest.fn(),
  };
});

const mockLogin = authControllerLogin as jest.Mock;

let latestAuth: ReturnType<typeof useAuth> | null = null;
function Probe() {
  latestAuth = useAuth();
  return (
    <div>
      <span data-testid="auth">{String(latestAuth.isAuthenticated)}</span>
      <span data-testid="loading">{String(latestAuth.isLoading)}</span>
    </div>
  );
}

const setup = async () => {
  render(
    <AuthProvider>
      <Probe />
    </AuthProvider>
  );
  await screen.findByTestId('auth');
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    window.sessionStorage.clear();
    latestAuth = null;
  });

  it('starts unauthenticated and finishes loading', async () => {
    await setup();
    expect(screen.getByTestId('auth').textContent).toBe('false');
    expect(screen.getByTestId('loading').textContent).toBe('false');
  });

  it('restores an authenticated session from localStorage', async () => {
    window.localStorage.setItem('auth_token', 'token-1');
    window.localStorage.setItem('user_data', JSON.stringify({ id: 1, email: 'a@b.c', nickname: 'n' }));

    await setup();

    expect(screen.getByTestId('auth').textContent).toBe('true');
    expect(latestAuth?.user?.email).toBe('a@b.c');
  });

  it('restores an authenticated session from sessionStorage (no remember me)', async () => {
    window.sessionStorage.setItem('auth_token', 'token-session');
    window.sessionStorage.setItem('user_data', JSON.stringify({ id: 2, email: 's@b.c', nickname: 'sess' }));

    await setup();

    expect(screen.getByTestId('auth').textContent).toBe('true');
    expect(latestAuth?.user?.email).toBe('s@b.c');
  });

  it('syncs the session when a storage event changes the token in another tab', async () => {
    await setup();
    expect(screen.getByTestId('auth').textContent).toBe('false');

    // Another tab wrote an auth_token; the event handler reads it from storage
    window.localStorage.setItem('auth_token', 'token-other-tab');
    window.localStorage.setItem(
      'user_data',
      JSON.stringify({ id: 3, email: 'other@b.c', nickname: 'other' })
    );
    await act(async () => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'auth_token',
          newValue: 'token-other-tab',
        })
      );
    });

    expect(screen.getByTestId('auth').textContent).toBe('true');
    expect(latestAuth?.user?.email).toBe('other@b.c');
  });

  it('clears the session when a storage event removes the token in another tab', async () => {
    window.localStorage.setItem('auth_token', 'token-1');
    window.localStorage.setItem('user_data', JSON.stringify({ id: 1, email: 'a@b.c', nickname: 'n' }));
    await setup();
    expect(screen.getByTestId('auth').textContent).toBe('true');

    // Another tab logged out: token removed
    window.localStorage.removeItem('auth_token');
    window.localStorage.removeItem('user_data');
    await act(async () => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'auth_token',
          newValue: null,
        })
      );
    });

    expect(screen.getByTestId('auth').textContent).toBe('false');
  });

  it('logs in successfully with rememberMe storing to localStorage', async () => {
    mockLogin.mockResolvedValue({
      status: 200,
      data: { access_token: 'access-1', user: { id: 1, email: 'a@b.c', nickname: 'n' } },
    });
    await setup();

    let result!: { success: boolean };
    await act(async () => {
      result = await latestAuth!.login('a@b.c', 'pass', true);
    });

    expect(result.success).toBe(true);
    expect(window.localStorage.getItem('auth_token')).toBe('access-1');
    expect(screen.getByTestId('auth').textContent).toBe('true');
  });

  it('logs in successfully without rememberMe storing to sessionStorage', async () => {
    mockLogin.mockResolvedValue({
      access_token: 'access-2',
      user: { id: 2, email: 'b@c.d', nickname: 'm' },
    });
    await setup();

    let result!: { success: boolean };
    await act(async () => {
      result = await latestAuth!.login('b@c.d', 'pass', false);
    });

    expect(result.success).toBe(true);
    expect(window.sessionStorage.getItem('auth_token')).toBe('access-2');
    expect(window.localStorage.getItem('auth_token')).toBeNull();
  });

  it('returns invalid credentials for a 401 response', async () => {
    mockLogin.mockResolvedValue({ status: 401 });
    await setup();

    let result!: { success: boolean; error?: string };
    await act(async () => {
      result = await latestAuth!.login('a@b.c', 'wrong');
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid credentials');
  });

  it('returns unexpected format error for unknown response shapes', async () => {
    mockLogin.mockResolvedValue({ status: 200, foo: 'bar' });
    await setup();

    let result!: { success: boolean; error?: string };
    await act(async () => {
      result = await latestAuth!.login('a@b.c', 'pass');
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/unexpected response format/i);
  });

  it('handles validation errors from the API client', async () => {
    mockLogin.mockRejectedValue({
      message: 'Validation failed',
      errors: [
        { path: ['email'], message: 'Email is invalid' },
        { path: ['password'], message: 'Too short' },
      ],
    });
    await setup();

    let result!: { success: boolean; error?: string; fieldErrors?: Record<string, string> };
    await act(async () => {
      result = await latestAuth!.login('bad', 'short');
    });

    expect(result.success).toBe(false);
    expect(result.fieldErrors?.email).toBe('Email is invalid');
    expect(result.fieldErrors?.password).toBe('Too short');
  });

  it('returns a network error message for network failures', async () => {
    mockLogin.mockRejectedValue({ isNetworkError: true, message: 'Failed to connect' });
    await setup();

    let result!: { success: boolean; error?: string };
    await act(async () => {
      result = await latestAuth!.login('a@b.c', 'pass');
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/unable to connect/i);
  });

  it('returns the message for "Failed to fetch" errors', async () => {
    mockLogin.mockRejectedValue({ message: 'Failed to fetch' });
    await setup();

    let result!: { success: boolean; error?: string };
    await act(async () => {
      result = await latestAuth!.login('a@b.c', 'pass');
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/unable to connect/i);
  });

  it('maps 400 status to email verification message', async () => {
    mockLogin.mockRejectedValue({ status: 400 });
    await setup();

    let result!: { success: boolean; error?: string };
    await act(async () => {
      result = await latestAuth!.login('a@b.c', 'pass');
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/verify your email/i);
  });

  it('maps >= 500 status to server error message', async () => {
    mockLogin.mockRejectedValue({ status: 500 });
    await setup();

    let result!: { success: boolean; error?: string };
    await act(async () => {
      result = await latestAuth!.login('a@b.c', 'pass');
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/server error/i);
  });

  it('handles a TypeError "Failed to fetch"', async () => {
    mockLogin.mockRejectedValue(new TypeError('Failed to fetch'));
    await setup();

    let result!: { success: boolean; error?: string };
    await act(async () => {
      result = await latestAuth!.login('a@b.c', 'pass');
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/unable to connect/i);
  });

  it('returns the error message for unexpected exceptions', async () => {
    mockLogin.mockRejectedValue(new Error('Something went wrong'));
    await setup();

    let result!: { success: boolean; error?: string };
    await act(async () => {
      result = await latestAuth!.login('a@b.c', 'pass');
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Something went wrong');
  });

  it('logs out and clears storage', async () => {
    window.localStorage.setItem('auth_token', 'token-1');
    window.localStorage.setItem('user_data', JSON.stringify({ id: 1, email: 'a@b.c', nickname: 'n' }));
    window.sessionStorage.setItem('auth_token', 'token-2');
    window.sessionStorage.setItem('user_data', JSON.stringify({ id: 1, email: 'a@b.c', nickname: 'n' }));

    await setup();
    expect(screen.getByTestId('auth').textContent).toBe('true');

    act(() => {
      latestAuth!.logout();
    });

    expect(screen.getByTestId('auth').textContent).toBe('false');
    expect(window.localStorage.getItem('auth_token')).toBeNull();
    expect(window.sessionStorage.getItem('auth_token')).toBeNull();
  });

  it('signUp calls the users endpoint and returns success', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true }) as unknown as typeof fetch;
    await setup();

    let result!: boolean;
    await act(async () => {
      result = await latestAuth!.signUp('a@b.c', 'pass', 'Name', 'nick');
    });

    expect(result).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/users'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('signUp returns false when the request fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch;
    await setup();

    let result!: boolean;
    await act(async () => {
      result = await latestAuth!.signUp('a@b.c', 'pass', 'Name', 'nick');
    });

    expect(result).toBe(false);
  });

  it('signUp returns false when fetch throws', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network')) as unknown as typeof fetch;
    await setup();

    let result!: boolean;
    await act(async () => {
      result = await latestAuth!.signUp('a@b.c', 'pass', 'Name', 'nick');
    });

    expect(result).toBe(false);
  });
});
