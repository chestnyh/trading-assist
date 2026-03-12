/**
 * Zod schemas for API validation
 * These should match the OpenAPI spec
 */

export {
  TradingExperienceLevelSchema,
  PrimaryTradingStrategySchema,
  RiskToleranceSchema,
  TradingPlatformSchema,
  CreateUserDtoSchema,
  LoginDtoSchema,
  VerifyEmailDtoSchema,
  ForgotPasswordDtoSchema,
  VerifyPasswordResetDtoSchema,
  ResetPasswordDtoSchema,
} from '@trading-bot/api-validator';
