export * from "./lib/models.service";
export * from "./lib/models.module";
export * from "./lib/models";
export * from "./types";

// Re-export PrismaClient and enums from @prisma/client
export { PrismaClient, $Enums } from '@prisma/client';

// Export enum values for DTO (Prisma 7 uses $Enums)
import { $Enums } from '@prisma/client';
export const TradingExperienceLevel = $Enums.TradingExperienceLevel;
export const PrimaryTradingStrategy = $Enums.PrimaryTradingStrategy;
export const RiskTolerance = $Enums.RiskTolerance;
export const TradingPlatform = $Enums.TradingPlatform;