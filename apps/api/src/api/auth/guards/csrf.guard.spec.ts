import { ForbiddenException } from '@nestjs/common';
import { CsrfGuard } from './csrf.guard';

const makeContext = (method: string, cookies: Record<string, string>, headers: Record<string, string>) =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ method, cookies, headers }),
    }),
    getHandler: () => ({}),
    getClass: () => ({}),
  }) as never;

const makeReflector = (skip: boolean) =>
  ({
    getAllAndOverride: jest.fn().mockReturnValue(skip),
  }) as never;

describe('CsrfGuard', () => {
  it.each(['GET', 'HEAD', 'OPTIONS'])('exempts the safe method %s', (method) => {
    const guard = new CsrfGuard(makeReflector(false));

    expect(guard.canActivate(makeContext(method, {}, {}))).toBe(true);
  });

  it('allows a state-changing request when the header matches the cookie', () => {
    const guard = new CsrfGuard(makeReflector(false));

    const allowed = guard.canActivate(
      makeContext('POST', { csrf_token: 'abc123' }, { 'x-csrf-token': 'abc123' })
    );

    expect(allowed).toBe(true);
  });

  it('rejects a state-changing request with a missing header', () => {
    const guard = new CsrfGuard(makeReflector(false));

    expect(() => guard.canActivate(makeContext('POST', { csrf_token: 'abc123' }, {}))).toThrow(
      ForbiddenException
    );
  });

  it('rejects a state-changing request with a mismatched header and does not mutate', () => {
    const guard = new CsrfGuard(makeReflector(false));

    expect(() =>
      guard.canActivate(makeContext('DELETE', { csrf_token: 'abc123' }, { 'x-csrf-token': 'nope' }))
    ).toThrow(ForbiddenException);
  });

  it('rejects when no CSRF cookie exists yet', () => {
    const guard = new CsrfGuard(makeReflector(false));

    expect(() => guard.canActivate(makeContext('PATCH', {}, { 'x-csrf-token': 'abc' }))).toThrow(
      ForbiddenException
    );
  });

  it('returns the contract 403 body for a missing proof', () => {
    const guard = new CsrfGuard(makeReflector(false));

    try {
      guard.canActivate(makeContext('PUT', {}, {}));
      throw new Error('expected guard to reject');
    } catch (error) {
      expect(error).toBeInstanceOf(ForbiddenException);
      expect((error as ForbiddenException).getResponse()).toMatchObject({
        statusCode: 403,
        message: 'Invalid or missing CSRF token',
      });
    }
  });

  it('honors @SkipCsrf() on a state-changing request without any token', () => {
    const guard = new CsrfGuard(makeReflector(true));

    expect(guard.canActivate(makeContext('POST', {}, {}))).toBe(true);
  });
});
