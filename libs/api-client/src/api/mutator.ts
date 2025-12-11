/**
 * Custom fetch mutator with Zod validation for orval-generated API client
 */

import { z } from 'zod';
import { CreateUserDtoSchema, LoginDtoSchema } from '../lib/zod-schemas';

// Map URLs to their request body schemas
const requestSchemas: Record<string, z.ZodSchema<any>> = {
  '/api/v1/users': CreateUserDtoSchema,
  '/api/v1/auth/login': LoginDtoSchema,
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
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('auth_token') 
    : null;
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Validate request body using URL-based schema mapping
  if (config.body && (schema || requestSchemas[url])) {
    try {
      const bodyData = typeof config.body === 'string' 
        ? JSON.parse(config.body) 
        : config.body;
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

  const response = await fetch(fullUrl, {
    ...config,
    headers,
  });

  // Handle non-OK responses
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
      status: response.status,
    }));
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

