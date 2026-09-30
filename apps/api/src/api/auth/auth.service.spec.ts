import { UnauthorizedException } from '@nestjs/common';
import { AuthService, STREAM_JWT_AUDIENCE, STREAM_TICKET_PURPOSE } from './auth.service';

const USER = {
  id: 1,
  email: 'user@example.com',
  nickname: 'johndoe123',
  role: 'USER',
  country: 'UA',
  firstName: 'John',
  lastName: 'Doe',
};

const createHarness = () => {
  const jwtService = { sign: jest.fn().mockReturnValue('signed.jwt.token') };
  const cryptoService = { hashPassword: jest.fn().mockResolvedValue('hashed-password') };
  const sessionService = {
    issue: jest.fn().mockResolvedValue({
      token: 'refresh-token',
      sessionId: 'session-1',
      familyId: 'family-1',
      userId: USER.id,
      rememberMe: false,
      expiresAt: new Date(),
      maxAgeMs: undefined,
    }),
    rotate: jest.fn(),
    revokeByToken: jest.fn().mockResolvedValue(undefined),
    revokeAllForUser: jest.fn().mockResolvedValue(undefined),
    getAccessTtlMs: jest.fn().mockReturnValue(900_000),
  };

  const modelsService: any = {
    user: {
      findUnique: jest.fn().mockResolvedValue(USER),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    passwordReset: {
      findUnique: jest.fn(),
      delete: jest.fn().mockResolvedValue(undefined),
      deleteMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  modelsService.runInTransaction = jest.fn(async (fn: (tx: unknown) => Promise<unknown>) =>
    fn(modelsService)
  );

  const configService = {
    get: (key: string) =>
      ({
        JWT_STREAM_TICKET_EXPIRES_IN: '60s',
      })[key],
  };

  const service = new AuthService(
    jwtService as never,
    modelsService as never,
    configService as never,
    cryptoService as never,
    sessionService as never
  );

  return { service, jwtService, sessionService, modelsService, cryptoService };
};

const createResponse = () => ({ cookie: jest.fn(), clearCookie: jest.fn() });

describe('AuthService', () => {
  it('issues the full cookie set on login and never returns a credential in the body (FR-003)', async () => {
    const { service, jwtService, sessionService } = createHarness();
    const res = createResponse();

    const result = await service.login(USER, false, res as never);

    expect(result).toEqual({
      user: {
        id: 1,
        nickname: 'johndoe123',
        email: 'user@example.com',
        name: 'John Doe',
        role: 'USER',
        country: 'UA',
      },
    });
    expect(result).not.toHaveProperty('access_token');
    expect(sessionService.issue).toHaveBeenCalledWith(1, false);

    const cookieNames = res.cookie.mock.calls.map(([name]) => name);
    expect(cookieNames).toEqual(['access_token', 'refresh_token', 'csrf_token']);
  });

  it('signs the access credential with the api audience and the short configured TTL', async () => {
    const { service, jwtService } = createHarness();
    const res = createResponse();

    await service.login(USER, false, res as never);

    expect(jwtService.sign).toHaveBeenCalledWith(
      expect.objectContaining({ sub: 1, email: 'user@example.com', role: 'USER' }),
      expect.objectContaining({ audience: 'api', expiresIn: 900 })
    );
  });

  it('passes "Remember me" through to the refresh credential issuance', async () => {
    const { service, sessionService } = createHarness();
    const res = createResponse();

    await service.login(USER, true, res as never);

    expect(sessionService.issue).toHaveBeenCalledWith(1, true);
  });

  it('rotates the credential and reissues cookies on refresh', async () => {
    const { service, sessionService, modelsService } = createHarness();
    const res = createResponse();
    sessionService.rotate.mockResolvedValue({
      token: 'new-refresh',
      sessionId: 'session-2',
      familyId: 'family-1',
      userId: USER.id,
      rememberMe: false,
      expiresAt: new Date(),
      maxAgeMs: undefined,
    });

    const result = await service.refresh('old-refresh', res as never);

    expect(sessionService.rotate).toHaveBeenCalledWith('old-refresh');
    expect(modelsService.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res.cookie).toHaveBeenCalledTimes(3);
    expect(result.user).toMatchObject({ id: 1, role: 'USER' });
  });

  it('rejects refresh when no credential is presented', async () => {
    const { service } = createHarness();
    const res = createResponse();

    await expect(service.refresh(undefined, res as never)).rejects.toBeInstanceOf(
      UnauthorizedException
    );
  });

  it('revokes the refresh family and clears cookies on logout, and stays idempotent', async () => {
    const { service, sessionService } = createHarness();
    const res = createResponse();

    await expect(service.logout('refresh-token', res as never)).resolves.toEqual({ success: true });

    expect(sessionService.revokeByToken).toHaveBeenCalledWith('refresh-token');
    expect(res.clearCookie).toHaveBeenCalledTimes(3);

    const emptyRes = createResponse();
    await expect(service.logout(undefined, emptyRes as never)).resolves.toEqual({ success: true });
    expect(sessionService.revokeByToken).toHaveBeenCalledTimes(1);
    expect(emptyRes.clearCookie).toHaveBeenCalledTimes(3);
  });

  it('issues a stream ticket scoped to the log-stream audience and purpose (FR-006, R-006)', () => {
    const { service, jwtService } = createHarness();

    const result = service.issueStreamTicket(USER);

    expect(result).toEqual({ ticket: 'signed.jwt.token', expiresIn: 60 });
    expect(jwtService.sign).toHaveBeenCalledWith(
      expect.objectContaining({ sub: 1, purpose: STREAM_TICKET_PURPOSE }),
      expect.objectContaining({ audience: STREAM_JWT_AUDIENCE, expiresIn: 60 })
    );
  });

  it('revokes every session for the user inside the password-reset transaction (FR-023)', async () => {
    const { service, sessionService, modelsService } = createHarness();
    modelsService.passwordReset.findUnique.mockResolvedValue({
      id: 10,
      userId: 5,
      verified: true,
      createdAt: new Date(),
      code: '123456',
      attemptsCount: 0,
    });

    const result = await service.resetPassword('reset-token', 'NewPassword123!');

    expect(result.success).toBe(true);
    expect(modelsService.runInTransaction).toHaveBeenCalledTimes(1);
    expect(modelsService.user.update).toHaveBeenCalledWith({
      where: { id: 5 },
      data: { password: 'hashed-password' },
    });
    expect(sessionService.revokeAllForUser).toHaveBeenCalledWith(5, modelsService);
  });
});
