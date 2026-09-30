import { SetMetadata } from '@nestjs/common';

export const SKIP_CSRF_KEY = 'skipCsrf';

/**
 * Exempts an endpoint from the global double-submit CSRF check. Intended only for public,
 * pre-session endpoints (sign-up, email verification, forgot/reset password).
 */
export const SkipCsrf = () => SetMetadata(SKIP_CSRF_KEY, true);
