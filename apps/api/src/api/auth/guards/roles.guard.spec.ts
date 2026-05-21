import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  const makeContext = (user: any) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    }) as any;

  it('allows when no roles required', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(undefined),
    } as any;

    const guard = new RolesGuard(reflector);
    expect(guard.canActivate(makeContext({ role: 'USER' }))).toBe(true);
  });

  it('denies when roles required but user has no role', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['ADMIN']),
    } as any;

    const guard = new RolesGuard(reflector);
    expect(guard.canActivate(makeContext({}))).toBe(false);
  });

  it('allows when user role matches required roles', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['ADMIN']),
    } as any;

    const guard = new RolesGuard(reflector);
    expect(guard.canActivate(makeContext({ role: 'ADMIN' }))).toBe(true);
  });

  it('denies when user role does not match required roles', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['ADMIN']),
    } as any;

    const guard = new RolesGuard(reflector);
    expect(guard.canActivate(makeContext({ role: 'USER' }))).toBe(false);
  });
});
