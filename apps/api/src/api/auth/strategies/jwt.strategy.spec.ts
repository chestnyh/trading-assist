import { JwtService } from '@nestjs/jwt';
import { API_JWT_AUDIENCE, JwtStrategy, extractAccessCookie } from './jwt.strategy';

const SECRET = 'test-secret';

describe('API JwtStrategy', () => {
  it('extracts the access credential from the access_token cookie only', () => {
    expect(extractAccessCookie({ cookies: { access_token: 'cookie-token' } } as never)).toBe(
      'cookie-token'
    );
    expect(extractAccessCookie({ cookies: {} } as never)).toBeNull();
    // A Bearer header must not be accepted (FR-006).
    expect(
      extractAccessCookie({ headers: { authorization: 'Bearer cookie-token' } } as never)
    ).toBeNull();
    expect(extractAccessCookie(undefined as never)).toBeNull();
  });

  it('accepts tokens carrying the api audience and rejects others', async () => {
    const jwt = new JwtService({ secret: SECRET });
    const token = jwt.sign({ sub: 1 }, { audience: API_JWT_AUDIENCE, expiresIn: '15m' });

    await expect(
      jwt.verifyAsync(token, { audience: API_JWT_AUDIENCE })
    ).resolves.toMatchObject({ sub: 1 });
    await expect(jwt.verifyAsync(token, { audience: 'log-stream' })).rejects.toThrow();
  });

  it('rejects an access credential once its short lifetime elapsed (SC-009)', async () => {
    const jwt = new JwtService({ secret: SECRET });
    const expired = jwt.sign({ sub: 1 }, { audience: API_JWT_AUDIENCE, expiresIn: '-1s' });

    await expect(jwt.verifyAsync(expired, { audience: API_JWT_AUDIENCE })).rejects.toThrow();
  });

  it('resolves the user identified by the token subject', async () => {
    const usersService = {
      findUserById: jest.fn().mockResolvedValue({ id: 42, role: 'USER' }),
    };
    const configProvider = { get: jest.fn().mockReturnValue(SECRET) };

    const strategy = new JwtStrategy(usersService as never, configProvider as never);

    await expect(
      strategy.validate({ sub: 42, email: 'user@example.com', nickname: 'tester' })
    ).resolves.toMatchObject({ id: 42 });
    expect(usersService.findUserById).toHaveBeenCalledWith(42);
  });
});
