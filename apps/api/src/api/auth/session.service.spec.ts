import { UnauthorizedException } from '@nestjs/common';
import { SessionService } from './session.service';

const DAY_MS = 86_400_000;

const createConfig = (overrides: Record<string, unknown> = {}) =>
  ({
    get: (key: string) =>
      ({
        JWT_ACCESS_EXPIRES_IN: '15m',
        JWT_REFRESH_EXPIRES_IN: '24h',
        JWT_REFRESH_REMEMBER_EXPIRES_IN: '30d',
        AUTH_REFRESH_GRACE_MS: '10000',
        ...overrides,
      })[key],
  }) as never;

const createModelsMock = () => {
  const rows: any[] = [];

  const session = {
    create: jest.fn(async ({ data }: any) => {
      const row = {
        id: `session-${rows.length + 1}`,
        revokedAt: null,
        replacedById: null,
        lastUsedAt: null,
        createdAt: new Date(),
        ...data,
      };
      rows.push(row);
      return row;
    }),
    findUnique: jest.fn(
      async ({ where }: any) => rows.find((row) => row.tokenHash === where.tokenHash) ?? null
    ),
    update: jest.fn(async ({ where, data }: any) => {
      const row = rows.find((candidate) => candidate.id === where.id);
      Object.assign(row, data);
      return row;
    }),
    updateMany: jest.fn(async ({ where, data }: any) => {
      let count = 0;
      for (const row of rows) {
        if (where.familyId !== undefined && row.familyId !== where.familyId) continue;
        if (where.userId !== undefined && row.userId !== where.userId) continue;
        if (where.revokedAt !== undefined && row.revokedAt !== where.revokedAt) continue;
        Object.assign(row, data);
        count += 1;
      }
      return { count };
    }),
  };

  return { rows, session };
};

describe('SessionService', () => {
  it('issues an opaque credential whose hash (never the raw token) is stored', async () => {
    const models = createModelsMock();
    const service = new SessionService(models as never, createConfig());

    const issued = await service.issue(7, false);

    expect(issued.token).toEqual(expect.any(String));
    expect(issued.token.length).toBeGreaterThan(40);
    expect(models.rows[0].tokenHash).toBe(service.hashToken(issued.token));
    expect(models.rows[0].tokenHash).not.toBe(issued.token);
    expect(models.rows[0].familyId).toBe(issued.familyId);
  });

  it('applies the "Remember me" lifetime and cookie persistence', async () => {
    const rememberModels = createModelsMock();
    const rememberService = new SessionService(rememberModels as never, createConfig());
    const remembered = await rememberService.issue(1, true);

    expect(remembered.maxAgeMs).toBe(30 * DAY_MS);
    expect(remembered.expiresAt.getTime() - Date.now()).toBeGreaterThan(29 * DAY_MS);

    const sessionModels = createModelsMock();
    const sessionService = new SessionService(sessionModels as never, createConfig());
    const sessionOnly = await sessionService.issue(1, false);

    expect(sessionOnly.maxAgeMs).toBeUndefined();
    expect(sessionOnly.expiresAt.getTime() - Date.now()).toBeLessThanOrEqual(24 * 60 * 60 * 1000);
  });

  it('rotates a valid credential, revoking and linking the predecessor', async () => {
    const models = createModelsMock();
    const service = new SessionService(models as never, createConfig());
    const issued = await service.issue(3, false);

    const successor = await service.rotate(issued.token);

    expect(successor.token).not.toBe(issued.token);
    expect(successor.familyId).toBe(issued.familyId);

    const predecessor = models.rows.find((row) => row.id === issued.sessionId);
    expect(predecessor.revokedAt).toBeInstanceOf(Date);
    expect(predecessor.replacedById).toBe(successor.sessionId);
    expect(predecessor.lastUsedAt).toBeInstanceOf(Date);
  });

  it('rejects an expired credential', async () => {
    const models = createModelsMock();
    const service = new SessionService(models as never, createConfig());
    const issued = await service.issue(3, false);
    models.rows[0].expiresAt = new Date(Date.now() - 1000);

    await expect(service.rotate(issued.token)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('revokes the whole family when a rotated credential is replayed outside the grace window', async () => {
    const models = createModelsMock();
    const service = new SessionService(models as never, createConfig());
    const issued = await service.issue(4, false);
    const successor = await service.rotate(issued.token);

    // Simulate the replay happening well after the grace window.
    const predecessor = models.rows.find((row) => row.id === issued.sessionId);
    predecessor.lastUsedAt = new Date(Date.now() - 60_000);

    await expect(service.rotate(issued.token)).rejects.toBeInstanceOf(UnauthorizedException);

    const family = models.rows.filter((row) => row.familyId === issued.familyId);
    expect(family.length).toBeGreaterThan(1);
    expect(family.every((row) => row.revokedAt instanceof Date)).toBe(true);
    expect(successor.sessionId).toBeTruthy();
  });

  it('treats a replay inside the grace window as a legitimate concurrent renewal', async () => {
    const models = createModelsMock();
    const service = new SessionService(models as never, createConfig());
    const issued = await service.issue(5, false);
    await service.rotate(issued.token);

    const renewed = await service.rotate(issued.token);

    expect(renewed.token).toEqual(expect.any(String));
    expect(renewed.familyId).toBe(issued.familyId);
    // No false-positive family invalidation.
    const family = models.rows.filter((row) => row.familyId === issued.familyId);
    expect(family.some((row) => row.revokedAt === null)).toBe(true);
  });

  it('revokes every credential for a user (password reset)', async () => {
    const models = createModelsMock();
    const service = new SessionService(models as never, createConfig());
    await service.issue(9, false);
    await service.issue(9, true);

    await service.revokeAllForUser(9);

    expect(models.rows.every((row) => row.revokedAt instanceof Date)).toBe(true);
  });

  it('revokeByToken is a no-op for an unknown token', async () => {
    const models = createModelsMock();
    const service = new SessionService(models as never, createConfig());

    await expect(service.revokeByToken('unknown')).resolves.toBeUndefined();
  });
});
