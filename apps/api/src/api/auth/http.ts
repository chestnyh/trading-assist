/**
 * Minimal structural types for the HTTP surface we touch. Using these avoids depending on
 * `@types/express` while keeping the cookie/request access explicit.
 */

export interface CookieJar {
  cookie(name: string, value: string, options?: Record<string, unknown>): unknown;
  clearCookie(name: string, options?: Record<string, unknown>): unknown;
}

export interface RequestLike {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  cookies?: Record<string, string | undefined>;
  query?: Record<string, unknown>;
  user?: unknown;
}
