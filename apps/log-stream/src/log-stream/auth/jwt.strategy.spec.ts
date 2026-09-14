import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { STREAM_JWT_AUDIENCE, STREAM_TICKET_PURPOSE, JwtStrategy } from './jwt.strategy';

const SECRET = 'test-secret';

describe('log-stream JwtStrategy', () => {
  const modelsService = {
    user: { findUnique: jest.fn().mockResolvedValue({ id: 1, email: 'user@example.com' }) },
  };
  const configProvider = { get: jest.fn().mockReturnValue(SECRET) };

  beforeEach(() => {
    jest.clearAllMocks();
    modelsService.user.findUnique.mockResolvedValue({ id: 1, email: 'user@example.com' });
  });

  it('accepts a stream ticket but rejects an api access token (audience separation)', async () => {
    const jwt = new JwtService({ secret: SECRET });
    const streamTicket = jwt.sign(
      { sub: 1, purpose: STREAM_TICKET_PURPOSE },
      { audience: STREAM_JWT_AUDIENCE, expiresIn: '60s' }
    );
    const accessToken = jwt.sign({ sub: 1 }, { audience: 'api', expiresIn: '15m' });

    await expect(
      jwt.verifyAsync(streamTicket, { audience: STREAM_JWT_AUDIENCE })
    ).resolves.toMatchObject({ sub: 1 });
    await expect(
      jwt.verifyAsync(accessToken, { audience: STREAM_JWT_AUDIENCE })
    ).rejects.toThrow();
  });

  it('rejects a token that lacks the stream purpose', async () => {
    const strategy = new JwtStrategy(modelsService as never, configProvider as never);

    await expect(strategy.validate({ sub: 1, email: 'user@example.com' })).rejects.toBeInstanceOf(
      UnauthorizedException
    );
  });

  it('resolves the user for a valid stream ticket', async () => {
    const strategy = new JwtStrategy(modelsService as never, configProvider as never);

    await expect(
      strategy.validate({ sub: 1, email: 'user@example.com', purpose: STREAM_TICKET_PURPOSE })
    ).resolves.toMatchObject({ id: 1 });
  });
});
