export type ApiClientValidationIssue = {
  path?: Array<string | number>;
  message?: string;
};

export type ApiClientValidationError = {
  message?: string;
  errors?: ApiClientValidationIssue[];
};

/**
 * Returns true when error matches api-client validation error shape.
 *
 * Example:
 * - api-client may throw: { message: 'Validation failed', errors: [{ path: ['email'], message: 'Invalid email' }] }
 */
export function isValidationError(error: unknown): error is ApiClientValidationError {
  if (!error || typeof error !== 'object') {
    return false;
  }

  return Array.isArray((error as ApiClientValidationError).errors);
}

/**
 * Extracts a map of field -> first validation message from an api-client validation error.
 *
 * Example:
 * - input error: { errors: [{ path: ['email'], message: 'Invalid email' }, { path: ['email'], message: '...' }] }
 * - output: { email: 'Invalid email' }
 */
export function extractFieldToMessageFromValidationError(
  error: ApiClientValidationError,
  defaultMessage = 'Invalid value'
): Record<string, string> {
  const maybeErrors = error.errors;
  if (!Array.isArray(maybeErrors)) {
    return {};
  }

  const result: Record<string, string> = {};
  for (const issue of maybeErrors) {
    const key = issue?.path?.[0];
    if (typeof key === 'string' && !result[key]) {
      result[key] = issue?.message ?? defaultMessage;
    }
  }

  return result;
}

export function extractFirstFieldErrorsFromApiClientError(
  error: unknown,
  defaultMessage = 'Invalid value'
): Record<string, string> {
  if (!isValidationError(error)) {
    return {};
  }

  return extractFieldToMessageFromValidationError(error, defaultMessage);
}
