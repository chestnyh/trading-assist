import { ServicesConfigs } from '@trading-bot/configs';
import { CookieJar } from './http';

export const ACCESS_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';
export const CSRF_COOKIE = 'csrf_token';

export const ACCESS_COOKIE_PATH = '/';
export const REFRESH_COOKIE_PATH = '/api/v1/auth';
export const CSRF_COOKIE_PATH = '/';

type AuthCookieOptions = {
  sameSite: 'lax' | 'strict' | 'none';
  secure: boolean;
  domain?: string;
  httpOnly: boolean;
  path: string;
  maxAge?: number;
};

function baseOptions(config: ServicesConfigs): AuthCookieOptions {
  const sameSite = String(
    config.get('AUTH_COOKIE_SAME_SITE') ?? 'lax'
  ).toLowerCase() as AuthCookieOptions['sameSite'];
  const domain = config.get('AUTH_COOKIE_DOMAIN');

  return {
    sameSite,
    secure: config.get('AUTH_COOKIE_SECURE') === true,
    ...(typeof domain === 'string' && domain.length > 0 ? { domain } : {}),
    httpOnly: true,
    path: ACCESS_COOKIE_PATH,
  };
}

/**
 * The access credential authorizes API traffic and is never readable by page scripts.
 */
export function setAccessCookie(
  res: CookieJar,
  token: string,
  maxAgeMs: number,
  config: ServicesConfigs
): void {
  res.cookie(ACCESS_COOKIE, token, {
    ...baseOptions(config),
    httpOnly: true,
    path: ACCESS_COOKIE_PATH,
    maxAge: maxAgeMs,
  });
}

/**
 * The renewal credential is scoped to the auth routes only. `maxAgeMs` is omitted for a
 * session cookie so it ends when the browser closes ("Remember me" disabled).
 */
export function setRefreshCookie(
  res: CookieJar,
  token: string,
  maxAgeMs: number | undefined,
  config: ServicesConfigs
): void {
  res.cookie(REFRESH_COOKIE, token, {
    ...baseOptions(config),
    httpOnly: true,
    path: REFRESH_COOKIE_PATH,
    ...(maxAgeMs !== undefined ? { maxAge: maxAgeMs } : {}),
  });
}

/**
 * The CSRF token must be readable by the SPA so it can echo it in `X-CSRF-Token`.
 */
export function setCsrfCookie(
  res: CookieJar,
  token: string,
  maxAgeMs: number | undefined,
  config: ServicesConfigs
): void {
  res.cookie(CSRF_COOKIE, token, {
    ...baseOptions(config),
    httpOnly: false,
    path: CSRF_COOKIE_PATH,
    ...(maxAgeMs !== undefined ? { maxAge: maxAgeMs } : {}),
  });
}

export function clearAuthCookies(res: CookieJar, config: ServicesConfigs): void {
  const options = baseOptions(config);

  res.clearCookie(ACCESS_COOKIE, { ...options, httpOnly: true, path: ACCESS_COOKIE_PATH });
  res.clearCookie(REFRESH_COOKIE, { ...options, httpOnly: true, path: REFRESH_COOKIE_PATH });
  res.clearCookie(CSRF_COOKIE, { ...options, httpOnly: false, path: CSRF_COOKIE_PATH });
}
