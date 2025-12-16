/**
 * Zod schemas for API validation
 * These should match the OpenAPI spec
 */

import { z } from 'zod';

export const TradingExperienceLevelSchema = z.enum([
  'Beginner',
  'Intermediate',
  'Advanced',
]);

export const PrimaryTradingStrategySchema = z.enum([
  'Scalping',
  'DayTrading',
  'SwingTrading',
  'PositionTrading',
  'Automated',
]);

export const RiskToleranceSchema = z.enum([
  'Conservative',
  'Moderate',
  'Aggressive',
]);

export const TradingPlatformSchema = z.enum([
  'Binance',
  'Bybit',
  'Kraken',
  'Other',
]);

export const CreateUserDtoSchema = z.object({
  nickname: z.string().min(3, 'Nickname must be at least 3 characters long'),
  email: z.string().email('Please provide a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/.*[A-Z].*/, 'Password must contain at least one uppercase letter')
    .regex(/.*[a-z].*/, 'Password must contain at least one lowercase letter')
    .regex(/.*\d.*/, 'Password must contain at least one number')
    .regex(
      /.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/]*/,
      'Password must contain at least one special character'
    ),
  firstName: z
    .string()
    .min(1, 'First name must be at least 1 character long')
    .max(50, 'First name must not exceed 50 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'First name can only contain letters, spaces, hyphens, and apostrophes'
    ),
  lastName: z
    .string()
    .min(1, 'Last name must be at least 1 character long')
    .max(50, 'Last name must not exceed 50 characters')
    .regex(
      /^[a-zA-Z\s'-]+$/,
      'Last name can only contain letters, spaces, hyphens, and apostrophes'
    ),
  tradingExperienceLevel: TradingExperienceLevelSchema.optional(),
  primaryTradingStrategy: PrimaryTradingStrategySchema.optional(),
  riskTolerance: RiskToleranceSchema.optional(),
  preferredTradingPlatforms: z.array(TradingPlatformSchema).optional(),
});

export const LoginDtoSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const VerifyEmailDtoSchema = z.object({
  code: z.string().min(6, 'Verification code must be 6 digits'),
  token: z.string().uuid('Token must be a valid UUID'),
});
