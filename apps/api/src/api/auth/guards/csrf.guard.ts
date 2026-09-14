import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { timingSafeEqual } from 'crypto';
import { CSRF_COOKIE } from '../cookies';
import { RequestLike } from '../http';
import { SKIP_CSRF_KEY } from '../decorators/skip-csrf.decorator';

export const CSRF_HEADER = 'x-csrf-token';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_CSRF_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skip) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestLike>();

    if (SAFE_METHODS.has(String(request.method).toUpperCase())) {
      return true;
    }

    const cookieValue = request.cookies?.[CSRF_COOKIE];
    const headerValue = request.headers?.[CSRF_HEADER];

    if (!this.matches(cookieValue, headerValue)) {
      throw new ForbiddenException('Invalid or missing CSRF token');
    }

    return true;
  }

  private matches(cookieValue: unknown, headerValue: unknown): boolean {
    if (typeof cookieValue !== 'string' || typeof headerValue !== 'string') {
      return false;
    }

    const cookieBuffer = Buffer.from(cookieValue);
    const headerBuffer = Buffer.from(headerValue);

    if (cookieBuffer.length === 0 || cookieBuffer.length !== headerBuffer.length) {
      return false;
    }

    return timingSafeEqual(cookieBuffer, headerBuffer);
  }
}
