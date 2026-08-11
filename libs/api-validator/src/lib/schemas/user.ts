import { z } from 'zod';
import { createSchemaValidator } from '../core';

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

const EmailSchema = z.string().email('Please provide a valid email address');

const StrongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(
    /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/]/,
    'Password must contain at least one special character'
  );

const FirstNameSchema = z
  .string()
  .min(1, 'First name is required')
  .max(50, 'First name must not exceed 50 characters')
  .regex(
    /^[a-zA-Z\s'-]+$/,
    'First name can only contain letters, spaces, hyphens, and apostrophes'
  );

const LastNameSchema = z
  .string()
  .min(1, 'Last name is required')
  .max(50, 'Last name must not exceed 50 characters')
  .regex(
    /^[a-zA-Z\s'-]+$/,
    'Last name can only contain letters, spaces, hyphens, and apostrophes'
  );

const CountrySchema = z
  .string()
  .length(2, 'Country must be a valid 2-letter country code')
  .toUpperCase();

export const CreateUserDtoSchema = z.object({
  nickname: z.string().min(3, 'Nickname must be at least 3 characters long'),
  email: EmailSchema,
  password: StrongPasswordSchema,
  country: CountrySchema,
  firstName: FirstNameSchema,
  lastName: LastNameSchema,
  tradingExperienceLevel: TradingExperienceLevelSchema.optional(),
  primaryTradingStrategy: PrimaryTradingStrategySchema.optional(),
  riskTolerance: RiskToleranceSchema.optional(),
  preferredTradingPlatforms: z.array(TradingPlatformSchema).optional(),
});

export const LoginDtoSchema = z.object({
  email: EmailSchema,
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long'),
  rememberMe: z.boolean().optional(),
});

export const VerifyEmailDtoSchema = z.object({
  code: z
    .string()
    .min(1, 'Verification code is required')
    .length(6, 'Verification code must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Verification code must contain only digits'),
  token: z.string().uuid('Token must be a valid UUID'),
});

export const ForgotPasswordDtoSchema = z.object({
  email: EmailSchema,
});

export const VerifyPasswordResetDtoSchema = z.object({
  code: z
    .string()
    .min(1, 'Verification code is required')
    .length(6, 'Verification code must be exactly 6 digits')
    .regex(/^\d+$/, 'Verification code must contain only numbers'),
  token: z.string().uuid('Token must be a valid UUID'),
});

export const ResetPasswordDtoSchema = z.object({
  password: StrongPasswordSchema,
  token: z.string().uuid('Token must be a valid UUID'),
});

export const CreateUserDtoSchemaValidator = createSchemaValidator(CreateUserDtoSchema);
export const LoginDtoSchemaValidator = createSchemaValidator(LoginDtoSchema);
export const VerifyEmailDtoSchemaValidator = createSchemaValidator(VerifyEmailDtoSchema);
export const ForgotPasswordDtoSchemaValidator = createSchemaValidator(ForgotPasswordDtoSchema);
export const VerifyPasswordResetDtoSchemaValidator = createSchemaValidator(VerifyPasswordResetDtoSchema);
export const ResetPasswordDtoSchemaValidator = createSchemaValidator(ResetPasswordDtoSchema);
