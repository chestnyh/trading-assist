import { ServicesConfigs } from '@trading-bot/configs';
import {
  ACCESS_COOKIE,
  ACCESS_COOKIE_PATH,
  CSRF_COOKIE,
  CSRF_COOKIE_PATH,
  REFRESH_COOKIE,
  REFRESH_COOKIE_PATH,
  clearAuthCookies,
  setAccessCookie,
  setCsrfCookie,
  setRefreshCookie,
} from './cookies';

const createConfig = (overrides: Record<string, unknown> = {}) =>
  ({
    get: (key: string) =>
      ({
        AUTH_COOKIE_SAME_SITE: 'lax',
        AUTH_COOKIE_SECURE: false,
        AUTH_COOKIE_DOMAIN: undefined,
        ...overrides,
      })[key],
  }) as unknown as ServicesConfigs;

const createResponse = () => ({ cookie: jest.fn(), clearCookie: jest.fn() }) as never;

describe('auth cookies', () => {
  it('sets the access credential as an HttpOnly cookie scoped to the whole site', () => {
    const res = createResponse() as unknown as { cookie: jest.Mock };
    const config = createConfig();

    setAccessCookie(res as never, 'access-value', 900_000, config);

    expect(res.cookie).toHaveBeenCalledWith(
      ACCESS_COOKIE,
      'access-value',
      expect.objectContaining({ httpOnly: true, path: ACCESS_COOKIE_PATH, maxAge: 900_000 })
    );
  });

  it('sets a persistent refresh cookie only when "Remember me" is enabled', () => {
    const persistentRes = createResponse() as unknown as { cookie: jest.Mock };
    setRefreshCookie(persistentRes as never, 'refresh-value', 30 * 86_400_000, createConfig());
    expect(persistentRes.cookie).toHaveBeenCalledWith(
      REFRESH_COOKIE,
      'refresh-value',
      expect.objectContaining({ httpOnly: true, path: REFRESH_COOKIE_PATH, maxAge: 30 * 86_400_000 })
    );

    const sessionRes = createResponse() as unknown as { cookie: jest.Mock };
    setRefreshCookie(sessionRes as never, 'refresh-value', undefined, createConfig());
    const sessionOptions = sessionRes.cookie.mock.calls[0][2];
    expect(sessionOptions).not.toHaveProperty('maxAge');
    expect(sessionOptions.path).toBe(REFRESH_COOKIE_PATH);
  });

  it('sets the CSRF cookie readable by page scripts so it can be echoed in a header', () => {
    const res = createResponse() as unknown as { cookie: jest.Mock };

    setCsrfCookie(res as never, 'csrf-value', undefined, createConfig());

    expect(res.cookie).toHaveBeenCalledWith(
      CSRF_COOKIE,
      'csrf-value',
      expect.objectContaining({ httpOnly: false, path: CSRF_COOKIE_PATH })
    );
  });

  it('honours the secure and sameSite configuration', () => {
    const res = createResponse() as unknown as { cookie: jest.Mock };

    setAccessCookie(
      res as never,
      'access-value',
      1000,
      createConfig({ AUTH_COOKIE_SECURE: true, AUTH_COOKIE_SAME_SITE: 'strict' })
    );

    expect(res.cookie).toHaveBeenCalledWith(
      ACCESS_COOKIE,
      'access-value',
      expect.objectContaining({ secure: true, sameSite: 'strict' })
    );
  });

  it('clears all three cookies with their matching paths', () => {
    const res = createResponse() as unknown as { clearCookie: jest.Mock };

    clearAuthCookies(res as never, createConfig());

    const cleared = res.clearCookie.mock.calls.map(([name]) => name);
    expect(cleared).toEqual([ACCESS_COOKIE, REFRESH_COOKIE, CSRF_COOKIE]);
    expect(res.clearCookie).toHaveBeenCalledWith(
      REFRESH_COOKIE,
      expect.objectContaining({ path: REFRESH_COOKIE_PATH })
    );
  });
});
