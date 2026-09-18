/**
 * Custom fetch mutator with Zod validation for orval-generated API client
 */

import { z } from 'zod';
import {
  CreateUserDtoSchema,
  CreateRuleDtoSchema,
  CreateTagDtoSchema,
  CreateUserRuleSettingDtoSchema,
  LoginDtoSchema,
  VerifyEmailDtoSchema,
  ForgotPasswordDtoSchema,
  VerifyPasswordResetDtoSchema,
  ResetPasswordDtoSchema,
  UpdateRuleDtoSchema,
  UpdateUserRuleSettingDtoSchema,
} from '@trading-bot/api-validator';

type RequestSchemaRule = {
  url: string | RegExp;
  schema: z.ZodSchema<any>;
};

const requestSchemaRules: RequestSchemaRule[] = [
  { url: '/api/v1/users', schema: CreateUserDtoSchema },

  { url: '/api/v1/auth/login', schema: LoginDtoSchema },
  { url: '/api/v1/auth/verify-email', schema: VerifyEmailDtoSchema },
  { url: '/api/v1/auth/forgot-password', schema: ForgotPasswordDtoSchema },
  { url: '/api/v1/auth/verify-password-reset', schema: VerifyPasswordResetDtoSchema },
  { url: '/api/v1/auth/reset-password', schema: ResetPasswordDtoSchema },

  { url: '/api/v1/rules', schema: CreateRuleDtoSchema },
  { url: /^\/api\/v1\/rules\/[\w-]+$/, schema: UpdateRuleDtoSchema },

  { url: '/api/v1/rules-settings', schema: CreateUserRuleSettingDtoSchema },
  { url: /^\/api\/v1\/rules-settings\/[\w-]+$/, schema: UpdateUserRuleSettingDtoSchema },

  { url: '/api/v1/tags', schema: CreateTagDtoSchema },
];

const getRequestSchemaForUrl = (url: string): z.ZodSchema<any> | undefined => {
  for (const rule of requestSchemaRules) {
    if (typeof rule.url === 'string') {
      if (rule.url === url) {
        return rule.schema;
      }
      continue;
    }

    if (rule.url.test(url)) {
      return rule.schema;
    }
  }

  return undefined;
};

export const CSRF_HEADER = 'X-CSRF-Token';
export const CSRF_COOKIE = 'csrf_token';

const REFRESH_PATH = '/api/v1/auth/refresh';
const STATE_CHANGING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const NO_REFRESH_PATHS = ['/api/v1/auth/login', REFRESH_PATH, '/api/v1/auth/me'];

const readCookie = (name: string): string | null => {
  if (typeof document === 'undefined' || !document.cookie) {
    return null;
  }

  const match = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
};

const requestRefresh = async (baseURL: string | undefined): Promise<boolean> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const csrfToken = readCookie(CSRF_COOKIE);
  if (csrfToken) {
    headers[CSRF_HEADER] = csrfToken;
  }

  try {
    const response = await fetch(`${baseURL}${REFRESH_PATH}`, {
      method: 'POST',
      credentials: 'include',
      headers,
    });
    return response.ok;
  } catch {
    return false;
  }
};

export const customInstance = async <T>(
  url: string,
  config: RequestInit,
  schema?: z.ZodSchema<T>
): Promise<T> => {
  // Base URL configuration
  const baseURL = process.env['API_BASE_URL'];
  const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

  // When schema matching, use the URL pathname so absolute URLs are supported.
  const urlPath = url.startsWith('http') ? new URL(url).pathname : url;

  // Validate request body using URL-based schema mapping
  const requestSchema = getRequestSchemaForUrl(urlPath);
  if (config.body && (schema || requestSchema)) {
    try {
      const bodyData =
        typeof config.body === 'string' ? JSON.parse(config.body) : config.body;
      const validationSchema = schema || requestSchema;
      if (validationSchema) {
        const parsedBody = validationSchema.parse(bodyData); // This will throw an error if the data is invalid
        config.body = JSON.stringify(parsedBody);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw {
          message: 'Validation failed',
          errors: error.issues,
        };
      }
      throw error;
    }
  }

  const method = (config.method ?? 'GET').toUpperCase();
  const isStateChanging = STATE_CHANGING_METHODS.has(method);

  const buildHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(config.headers as Record<string, string>),
    };

    // The session credential is carried by HttpOnly cookies; only the CSRF proof is read here.
    if (isStateChanging) {
      const csrfToken = readCookie(CSRF_COOKIE);
      if (csrfToken) {
        headers[CSRF_HEADER] = csrfToken;
      }
    }

    return headers;
  };

  const send = async (): Promise<Response> => {
    try {
      return await fetch(fullUrl, {
        ...config,
        credentials: 'include',
        headers: buildHeaders(),
      });
    } catch (networkError: any) {
      // Handle network errors (connection refused, timeout, etc.)
      throw {
        message: networkError.message?.includes('Failed to fetch') || networkError.message?.includes('ERR_CONNECTION_REFUSED')
          ? `Failed to connect to the server. Make sure the backend is running on ${baseURL}.`
          : `Network Error: ${networkError.message || 'Unknown connection error'}`,
        status: 0,
        isNetworkError: true,
        originalError: networkError,
      };
    }
  };

  let response = await send();

  // Transparently renew an expired access credential once, then retry the original request.
  if (
    response.status === 401 &&
    !NO_REFRESH_PATHS.some((path) => urlPath === path || urlPath.startsWith(`${path}/`))
  ) {
    const renewed = await requestRefresh(baseURL);
    if (renewed) {
      response = await send();
    }
  }

  // Handle non-OK responses
  if (!response.ok) {
    const errorData = await (
      typeof (response as any)?.json === 'function'
        ? (response as any).json()
        : Promise.resolve(null)
    ).catch(() => ({
      message: response.statusText,
      statusCode: response.status,
    }));

    // NestJS error format: { statusCode, message, error }
    // Extract message from NestJS error format or use statusText
    const error = {
      message: errorData.message || errorData.statusText || response.statusText,
      status: errorData.statusCode || response.status,
      ...errorData,
    };

    throw error;
  }

  // Handle empty responses
  const contentType = response.headers.get('content-type');
  let data: any;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  // Validate response if schema is provided
  if (schema && data !== undefined) {
    try {
      data = schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw {
          message: 'Response validation failed',
          errors: error.issues,
        };
      }
      throw error;
    }
  }

  return {
    status: response.status,
    data,
    headers: response.headers,
  } as unknown as T;
};
