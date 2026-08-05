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

export const customInstance = async <T>(
  url: string,
  config: RequestInit,
  schema?: z.ZodSchema<T>
): Promise<T> => {
  // Base URL configuration
  const baseURL = process.env['API_BASE_URL'];
  const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;
  
  console.log('fullUrl', fullUrl);
  console.log('baseURL', baseURL);

  // When schema matching, use the URL pathname so absolute URLs are supported.
  const urlPath = url.startsWith('http') ? new URL(url).pathname : url;

  // Merge default headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(config.headers as Record<string, string>),
  };

  // Add authentication token if available
  if(!headers['Authorization']){
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
        : null;
  
      headers['Authorization'] = `Bearer ${token}`;
  }
  

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

  let response: Response;
  try {
    response = await fetch(fullUrl, {
      ...config,
      headers,
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
