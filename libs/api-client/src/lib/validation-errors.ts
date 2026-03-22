export type ApiClientValidationIssue = {
  path?: Array<string | number>;
  message?: string;
};

export type ApiClientValidationError = {
  message?: string;
  errors?: ApiClientValidationIssue[];
};

export function extractFirstFieldErrorsFromApiClientError(
  error: unknown,
  defaultMessage = 'Invalid value'
): Record<string, string> {
  if (!error || typeof error !== 'object') {
    return {};
  }

  const maybeErrors = (error as ApiClientValidationError).errors;
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
