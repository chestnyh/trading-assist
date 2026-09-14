import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, randomBytes, randomUUID } from 'crypto';
import { ModelsService } from '@trading-bot/models';
import { ServicesConfigs } from '@trading-bot/configs';
import { parseDurationToMs } from './duration';

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const DEFAULT_ACCESS_TTL_MS = 15 * 60_000;

type SessionDelegate = Pick<ModelsService, 'session'>;

export interface IssuedRefreshCredential {
  token: string;
  sessionId: string;
  familyId: string;
  userId: number;
  rememberMe: boolean;
  expiresAt: Date;
  /** Present only for persistent ("Remember me") sessions. */
  maxAgeMs?: number;
}

@Injectable()
export class SessionService {
  constructor(
    private readonly modelsService: ModelsService,
    private readonly configService: ServicesConfigs
  ) {}

  getAccessTtlMs(): number {
    return parseDurationToMs(
      this.configService.get('JWT_ACCESS_EXPIRES_IN'),
      DEFAULT_ACCESS_TTL_MS
    );
  }

  private getSessionTtlMs(rememberMe: boolean): number {
    return rememberMe
      ? parseDurationToMs(this.configService.get('JWT_REFRESH_REMEMBER_EXPIRES_IN'), 30 * DAY_MS)
      : parseDurationToMs(this.configService.get('JWT_REFRESH_EXPIRES_IN'), 24 * HOUR_MS);
  }

  private getGraceMs(): number {
    const configured = Number(this.configService.get('AUTH_REFRESH_GRACE_MS'));
    return Number.isFinite(configured) && configured >= 0 ? configured : 10_000;
  }

  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private generateToken(): string {
    return randomBytes(48).toString('base64url');
  }

  findByToken(token: string) {
    return this.modelsService.session.findUnique({
      where: { tokenHash: this.hashToken(token) },
    });
  }

  /**
   * Issues a refresh credential. When `familyId` is provided the new row extends an
   * existing session lineage (rotation); otherwise a new family starts (sign-in).
   */
  async issue(
    userId: number,
    rememberMe: boolean,
    familyId?: string
  ): Promise<IssuedRefreshCredential> {
    const token = this.generateToken();
    const ttlMs = this.getSessionTtlMs(rememberMe);
    const expiresAt = new Date(Date.now() + ttlMs);

    const row = await this.modelsService.session.create({
      data: {
        userId,
        familyId: familyId ?? randomUUID(),
        tokenHash: this.hashToken(token),
        rememberMe,
        expiresAt,
      },
    });

    return {
      token,
      sessionId: row.id,
      familyId: row.familyId,
      userId,
      rememberMe,
      expiresAt,
      maxAgeMs: rememberMe ? ttlMs : undefined,
    };
  }

  /**
   * Consumes the presented credential and returns its replacement. A credential that was
   * already rotated is treated as a legitimate concurrent renewal inside the grace window;
   * outside it, the whole family is revoked (reuse detection).
   */
  async rotate(token: string): Promise<IssuedRefreshCredential> {
    const now = new Date();
    const row = await this.findByToken(token);

    if (!row || row.expiresAt <= now) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (row.revokedAt || row.replacedById) {
      const withinGrace =
        !!row.replacedById &&
        !!row.lastUsedAt &&
        now.getTime() - row.lastUsedAt.getTime() <= this.getGraceMs();

      if (withinGrace) {
        return this.issue(row.userId, row.rememberMe, row.familyId);
      }

      await this.revokeFamily(row.familyId);
      throw new UnauthorizedException('Refresh token has already been used');
    }

    const successor = await this.issue(row.userId, row.rememberMe, row.familyId);

    await this.modelsService.session.update({
      where: { id: row.id },
      data: {
        revokedAt: now,
        replacedById: successor.sessionId,
        lastUsedAt: now,
      },
    });

    return successor;
  }

  async revokeFamily(familyId: string, client: SessionDelegate = this.modelsService): Promise<void> {
    await client.session.updateMany({
      where: { familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async revokeByToken(token: string): Promise<void> {
    const row = await this.findByToken(token);
    if (!row) {
      return;
    }
    await this.revokeFamily(row.familyId);
  }

  async revokeAllForUser(
    userId: number,
    client: SessionDelegate = this.modelsService
  ): Promise<void> {
    await client.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
