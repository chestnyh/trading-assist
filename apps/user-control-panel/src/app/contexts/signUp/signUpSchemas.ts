import { z } from "zod";
import {
    CreateUserDtoSchema,
    TradingExperienceLevelSchema,
    PrimaryTradingStrategySchema,
    RiskToleranceSchema,
    TradingPlatformSchema,
} from "@trading-bot/api-validator";

// ---------- Step 1: Personal Information ----------

export const SignUpStep1Schema = z.object({
    firstName: CreateUserDtoSchema.shape.firstName,
    lastName: CreateUserDtoSchema.shape.lastName,
    country: z.string().min(1, "Country is required"),
});

// ---------- Step 2: Trading Preferences ----------

export const SignUpStep2Schema = z.object({
    tradingExperienceLevel: TradingExperienceLevelSchema.optional(),
    primaryTradingStrategy: PrimaryTradingStrategySchema.optional(),
    riskTolerance: RiskToleranceSchema.optional(),
    preferredTradingPlatforms: z.array(TradingPlatformSchema).optional(),
});

// ---------- Step 3: Account Information ----------

export const SignUpStep3Schema = z
    .object({
        email: CreateUserDtoSchema.shape.email,
        nickname: CreateUserDtoSchema.shape.nickname,
        password: CreateUserDtoSchema.shape.password,
        confirmPassword: z.string().min(1, "Please confirm your password"),
        newsUpdates: z.boolean().optional(),
        tosPrivacy: z.boolean(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })
    .refine((data) => data.tosPrivacy === true, {
        message: "You must accept the Terms of Service and Privacy Policy",
        path: ["tosPrivacy"],
    });
