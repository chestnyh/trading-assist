/**
 * Custom fetch mutator with Zod validation for orval-generated API client
 */

import { z } from 'zod';
import {
  CreateUserDtoSchema,
  LoginDtoSchema,
  VerifyEmailDtoSchema,
  ForgotPasswordDtoSchema,
  VerifyPasswordResetDtoSchema,
  ResetPasswordDtoSchema,
} from './zod-schemas';

// Map URLs to their request body schemas
const requestSchemas: Record<string, z.ZodSchema<any>> = {
  '/api/v1/users': CreateUserDtoSchema,
  '/api/v1/auth/login': LoginDtoSchema,
  '/api/v1/auth/verify-email': VerifyEmailDtoSchema,
  '/api/v1/auth/forgot-password': ForgotPasswordDtoSchema,
  '/api/v1/auth/verify-password-reset': VerifyPasswordResetDtoSchema,
  '/api/v1/auth/reset-password': ResetPasswordDtoSchema,
};

export const customInstance = async <T>(
  url: string,
  config: RequestInit,
  schema?: z.ZodSchema<T>
): Promise<T> => {
  // Base URL configuration
  const baseURL = process.env['API_BASE_URL'] || 'http://localhost:3001';
  const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

  // Merge default headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(config.headers as Record<string, string>),
  };

  // Add authentication token if available
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Validate request body using URL-based schema mapping
  if (config.body && (schema || requestSchemas[url])) {
    try {
      const bodyData =
        typeof config.body === 'string' ? JSON.parse(config.body) : config.body;
      const validationSchema = schema || requestSchemas[url];
      if (validationSchema) {
        validationSchema.parse(bodyData); // This will throw an error if the data is invalid
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
        ? 'Не удалось подключиться к серверу. Убедитесь, что бэкенд запущен на порту 3001.'
        : `Ошибка сети: ${networkError.message || 'Неизвестная ошибка подключения'}`,
      status: 0,
      isNetworkError: true,
      originalError: networkError,
    };
  }

  // Handle non-OK responses
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
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
  if (!contentType || !contentType.includes('application/json')) {
    return {} as T;
  }

  const data = await response.json();

  // Validate response if schema is provided
  if (schema) {
    try {
      return schema.parse(data);
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

  return data;
};
