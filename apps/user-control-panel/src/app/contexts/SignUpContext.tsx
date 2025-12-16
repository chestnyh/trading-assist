import { z } from "zod";
import {
    CreateUserDtoSchema,
    TradingExperienceLevelSchema,
    PrimaryTradingStrategySchema,
    RiskToleranceSchema,
    TradingPlatformSchema,
} from "@trading-bot/api-client";

import { createStepContext } from "./createStepContext";


export const SignUpStep1Schema = z.object({
    firstName: CreateUserDtoSchema.shape.firstName,
    lastName: CreateUserDtoSchema.shape.lastName,
    country: z.string().min(1, "Country is required"),
});

export const SignUpStep2Schema = z.object({
    tradingExperienceLevel: TradingExperienceLevelSchema.optional(),
    primaryTradingStrategy: PrimaryTradingStrategySchema.optional(),
    riskTolerance: RiskToleranceSchema.optional(),
    preferredTradingPlatforms: z.array(TradingPlatformSchema).optional(),
});

export type SignUpStep1FormData = z.infer<typeof SignUpStep1Schema>;
export type SignUpStep2FormData = z.infer<typeof SignUpStep2Schema>;

export const LS_KEY_STEP1 = "signUp.step1";
export const LS_KEY_STEP2 = "signUp.step2";

export const {
    Provider: SignUpStep1Provider,
    useStep: useSignUpStep1,
} = createStepContext<SignUpStep1FormData>({
    name: "useSignUpStep1",
    schema: SignUpStep1Schema,
    lsKey: LS_KEY_STEP1,
    initialValues: { firstName: "", lastName: "", country: "" },
    isEmpty: (d) => !d.firstName && !d.lastName && !d.country,
});

export const {
    Provider: SignUpStep2Provider,
    useStep: useSignUpStep2,
} = createStepContext<SignUpStep2FormData>({
    name: "useSignUpStep2",
    schema: SignUpStep2Schema,
    lsKey: LS_KEY_STEP2,
    initialValues: {
        tradingExperienceLevel: undefined,
        primaryTradingStrategy: undefined,
        riskTolerance: undefined,
        preferredTradingPlatforms: undefined,
    },
    isEmpty: (d) =>
        !d.tradingExperienceLevel &&
        !d.primaryTradingStrategy &&
        !d.riskTolerance &&
        (!d.preferredTradingPlatforms || d.preferredTradingPlatforms.length === 0),
});
