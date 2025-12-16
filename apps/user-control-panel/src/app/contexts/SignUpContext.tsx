import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useReducer,
} from "react";
import { z } from "zod";
import {
    CreateUserDtoSchema,
    TradingExperienceLevelSchema,
    PrimaryTradingStrategySchema,
    RiskToleranceSchema,
    TradingPlatformSchema,
} from "@trading-bot/api-client";

// ---------- Schemas ----------

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

// ---------- Types ----------

export type SignUpStep1FormData = z.infer<typeof SignUpStep1Schema>;
export type SignUpStep2FormData = z.infer<typeof SignUpStep2Schema>;
export type SignUpStep3FormData = z.infer<typeof SignUpStep3Schema>;

type SignUpFormData = SignUpStep1FormData & SignUpStep2FormData & SignUpStep3FormData;

type FieldErrors<T extends Record<string, unknown>> = Partial<Record<keyof T, string>>;

type SignUpState = SignUpFormData & {
    errors: {
        step1: FieldErrors<SignUpStep1FormData>;
        step2: FieldErrors<SignUpStep2FormData>;
        step3: FieldErrors<SignUpStep3FormData>;
    };
    hasAttemptedValidation: {
        step1: boolean;
        step2: boolean;
        step3: boolean;
    };
};

type SignUpAction =
    | { type: "SET_FIELD_STEP1"; payload: { field: keyof SignUpStep1FormData; value: unknown } }
    | { type: "SET_FIELD_STEP2"; payload: { field: keyof SignUpStep2FormData; value: unknown } }
    | { type: "SET_FIELD_STEP3"; payload: { field: keyof SignUpStep3FormData; value: unknown } }
    | { type: "SET_ERRORS_STEP1"; payload: FieldErrors<SignUpStep1FormData> }
    | { type: "SET_ERRORS_STEP2"; payload: FieldErrors<SignUpStep2FormData> }
    | { type: "SET_ERRORS_STEP3"; payload: FieldErrors<SignUpStep3FormData> }
    | { type: "SET_ATTEMPTED_STEP1"; payload: boolean }
    | { type: "SET_ATTEMPTED_STEP2"; payload: boolean }
    | { type: "SET_ATTEMPTED_STEP3"; payload: boolean }
    | { type: "RESET" };

// ---------- Constants ----------

export const LS_KEY_STEP1 = "signUp.step1";
export const LS_KEY_STEP2 = "signUp.step2";

const initialStep1Values: SignUpStep1FormData = {
    firstName: "",
    lastName: "",
    country: "",
};

const initialStep2Values: SignUpStep2FormData = {
    tradingExperienceLevel: undefined,
    primaryTradingStrategy: undefined,
    riskTolerance: undefined,
    preferredTradingPlatforms: undefined,
};

const initialStep3Values: SignUpStep3FormData = {
    email: "",
    nickname: "",
    password: "",
    confirmPassword: "",
    newsUpdates: false,
    tosPrivacy: false,
};

const initialState: SignUpState = {
    ...initialStep1Values,
    ...initialStep2Values,
    ...initialStep3Values,
    errors: {
        step1: {},
        step2: {},
        step3: {},
    },
    hasAttemptedValidation: {
        step1: false,
        step2: false,
        step3: false,
    },
};

// ---------- Helper Functions ----------

function pickFirstFieldErrors<T extends Record<string, unknown>>(
    issues: z.ZodIssue[]
): FieldErrors<T> {
    const errors: FieldErrors<T> = {};
    for (const issue of issues) {
        const field = issue.path[0] as keyof T | undefined;
        if (field && !errors[field]) errors[field] = issue.message;
    }
    return errors;
}

function initState(): SignUpState {
    if (typeof window === "undefined") return initialState;

    const restored: Partial<SignUpFormData> = {};

    // Restore Step 1 from localStorage
    try {
        const step1Raw = window.localStorage.getItem(LS_KEY_STEP1);
        if (step1Raw) {
            const step1Parsed = JSON.parse(step1Raw) as Record<string, unknown>;
            if (step1Parsed.firstName !== undefined) {
                restored.firstName = (step1Parsed.firstName === null || step1Parsed.firstName === undefined
                    ? ""
                    : step1Parsed.firstName) as string;
            }
            if (step1Parsed.lastName !== undefined) {
                restored.lastName = (step1Parsed.lastName === null || step1Parsed.lastName === undefined
                    ? ""
                    : step1Parsed.lastName) as string;
            }
            if (step1Parsed.country !== undefined) {
                restored.country = (step1Parsed.country === null || step1Parsed.country === undefined
                    ? ""
                    : step1Parsed.country) as string;
            }
        }
    } catch {
        window.localStorage.removeItem(LS_KEY_STEP1);
    }

    // Restore Step 2 from localStorage
    try {
        const step2Raw = window.localStorage.getItem(LS_KEY_STEP2);
        if (step2Raw) {
            const step2Parsed = JSON.parse(step2Raw) as Record<string, unknown>;
            if (step2Parsed.tradingExperienceLevel !== undefined) {
                restored.tradingExperienceLevel = (step2Parsed.tradingExperienceLevel === null
                    ? undefined
                    : step2Parsed.tradingExperienceLevel) as SignUpStep2FormData["tradingExperienceLevel"];
            }
            if (step2Parsed.primaryTradingStrategy !== undefined) {
                restored.primaryTradingStrategy = (step2Parsed.primaryTradingStrategy === null
                    ? undefined
                    : step2Parsed.primaryTradingStrategy) as SignUpStep2FormData["primaryTradingStrategy"];
            }
            if (step2Parsed.riskTolerance !== undefined) {
                restored.riskTolerance = (step2Parsed.riskTolerance === null
                    ? undefined
                    : step2Parsed.riskTolerance) as SignUpStep2FormData["riskTolerance"];
            }
            if (step2Parsed.preferredTradingPlatforms !== undefined) {
                restored.preferredTradingPlatforms = (step2Parsed.preferredTradingPlatforms === null
                    ? undefined
                    : step2Parsed.preferredTradingPlatforms) as SignUpStep2FormData["preferredTradingPlatforms"];
            }
        }
    } catch {
        window.localStorage.removeItem(LS_KEY_STEP2);
    }

    return {
        ...initialState,
        ...restored,
    };
}

// ---------- Reducer ----------

function reducer(state: SignUpState, action: SignUpAction): SignUpState {
    switch (action.type) {
        case "SET_FIELD_STEP1": {
            const { field, value } = action.payload;
            const nextErrors = { ...state.errors.step1 };
            if (state.hasAttemptedValidation.step1) delete nextErrors[field];
            return {
                ...state,
                [field]: value,
                errors: { ...state.errors, step1: nextErrors },
            };
        }

        case "SET_FIELD_STEP2": {
            const { field, value } = action.payload;
            const nextErrors = { ...state.errors.step2 };
            if (state.hasAttemptedValidation.step2) delete nextErrors[field];
            return {
                ...state,
                [field]: value,
                errors: { ...state.errors, step2: nextErrors },
            };
        }

        case "SET_FIELD_STEP3": {
            const { field, value } = action.payload;
            const nextErrors = { ...state.errors.step3 };
            if (state.hasAttemptedValidation.step3) delete nextErrors[field];
            return {
                ...state,
                [field]: value,
                errors: { ...state.errors, step3: nextErrors },
            };
        }

        case "SET_ERRORS_STEP1":
            return { ...state, errors: { ...state.errors, step1: action.payload } };

        case "SET_ERRORS_STEP2":
            return { ...state, errors: { ...state.errors, step2: action.payload } };

        case "SET_ERRORS_STEP3":
            return { ...state, errors: { ...state.errors, step3: action.payload } };

        case "SET_ATTEMPTED_STEP1":
            return {
                ...state,
                hasAttemptedValidation: { ...state.hasAttemptedValidation, step1: action.payload },
            };

        case "SET_ATTEMPTED_STEP2":
            return {
                ...state,
                hasAttemptedValidation: { ...state.hasAttemptedValidation, step2: action.payload },
            };

        case "SET_ATTEMPTED_STEP3":
            return {
                ...state,
                hasAttemptedValidation: { ...state.hasAttemptedValidation, step3: action.payload },
            };

        case "RESET":
            return initialState;

        default:
            return state;
    }
}

// ---------- Context ----------

type SignUpContextValue = {
    // Step 1
    step1: {
        state: SignUpStep1FormData & {
            errors: FieldErrors<SignUpStep1FormData>;
            hasAttemptedValidation: boolean;
        };
        setField: (field: keyof SignUpStep1FormData, value: SignUpStep1FormData[keyof SignUpStep1FormData]) => void;
        validateAndGetResult: () => { ok: boolean; data: SignUpStep1FormData };
    };
    // Step 2
    step2: {
        state: SignUpStep2FormData & {
            errors: FieldErrors<SignUpStep2FormData>;
            hasAttemptedValidation: boolean;
        };
        setField: (field: keyof SignUpStep2FormData, value: SignUpStep2FormData[keyof SignUpStep2FormData]) => void;
        validateAndGetResult: () => { ok: boolean; data: SignUpStep2FormData };
    };
    // Step 3
    step3: {
        state: SignUpStep3FormData & {
            errors: FieldErrors<SignUpStep3FormData>;
            hasAttemptedValidation: boolean;
        };
        setField: (field: keyof SignUpStep3FormData, value: SignUpStep3FormData[keyof SignUpStep3FormData]) => void;
        validateAndGetResult: () => { ok: boolean; data: SignUpStep3FormData };
    };
    // Common
    reset: () => void;
    clearStorage: () => void;
};

const SignUpContext = createContext<SignUpContextValue | null>(null);

// ---------- Provider ----------

export function SignUpProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer<typeof reducer, undefined>(
        reducer,
        undefined,
        initState
    );

    // Save Step 1 to localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;

        const step1Data: SignUpStep1FormData = {
            firstName: state.firstName,
            lastName: state.lastName,
            country: state.country,
        };

        if (!step1Data.firstName && !step1Data.lastName && !step1Data.country) return;

        try {
            window.localStorage.setItem(LS_KEY_STEP1, JSON.stringify(step1Data));
        } catch {
            // Ignore localStorage errors
        }
    }, [state.firstName, state.lastName, state.country]);

    // Save Step 2 to localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;

        const step2Data: SignUpStep2FormData = {
            tradingExperienceLevel: state.tradingExperienceLevel,
            primaryTradingStrategy: state.primaryTradingStrategy,
            riskTolerance: state.riskTolerance,
            preferredTradingPlatforms: state.preferredTradingPlatforms,
        };

        if (
            !step2Data.tradingExperienceLevel &&
            !step2Data.primaryTradingStrategy &&
            !step2Data.riskTolerance &&
            (!step2Data.preferredTradingPlatforms || step2Data.preferredTradingPlatforms.length === 0)
        ) {
            return;
        }

        try {
            const dataToStore: Record<string, unknown> = {};
            for (const key in initialStep2Values) {
                const fieldValue = step2Data[key as keyof SignUpStep2FormData];
                dataToStore[key] = fieldValue === undefined ? null : fieldValue;
            }
            window.localStorage.setItem(LS_KEY_STEP2, JSON.stringify(dataToStore));
        } catch {
            // Ignore localStorage errors
        }
    }, [
        state.tradingExperienceLevel,
        state.primaryTradingStrategy,
        state.riskTolerance,
        state.preferredTradingPlatforms,
    ]);

    const value = useMemo<SignUpContextValue>(() => {
        return {
            step1: {
                state: {
                    firstName: state.firstName,
                    lastName: state.lastName,
                    country: state.country,
                    errors: state.errors.step1,
                    hasAttemptedValidation: state.hasAttemptedValidation.step1,
                },
                setField: (field, value) => {
                    dispatch({ type: "SET_FIELD_STEP1", payload: { field, value } });
                },
                validateAndGetResult: () => {
                    const data: SignUpStep1FormData = {
                        firstName: state.firstName,
                        lastName: state.lastName,
                        country: state.country,
                    };

                    dispatch({ type: "SET_ATTEMPTED_STEP1", payload: true });

                    const res = SignUpStep1Schema.safeParse(data);
                    if (res.success) {
                        dispatch({ type: "SET_ERRORS_STEP1", payload: {} });
                        return { ok: true, data };
                    }

                    const errors = pickFirstFieldErrors<SignUpStep1FormData>(res.error.issues);
                    dispatch({ type: "SET_ERRORS_STEP1", payload: errors });
                    return { ok: false, data };
                },
            },
            step2: {
                state: {
                    tradingExperienceLevel: state.tradingExperienceLevel,
                    primaryTradingStrategy: state.primaryTradingStrategy,
                    riskTolerance: state.riskTolerance,
                    preferredTradingPlatforms: state.preferredTradingPlatforms,
                    errors: state.errors.step2,
                    hasAttemptedValidation: state.hasAttemptedValidation.step2,
                },
                setField: (field, value) => {
                    dispatch({ type: "SET_FIELD_STEP2", payload: { field, value } });
                },
                validateAndGetResult: () => {
                    const data: SignUpStep2FormData = {
                        tradingExperienceLevel: state.tradingExperienceLevel,
                        primaryTradingStrategy: state.primaryTradingStrategy,
                        riskTolerance: state.riskTolerance,
                        preferredTradingPlatforms: state.preferredTradingPlatforms,
                    };

                    dispatch({ type: "SET_ATTEMPTED_STEP2", payload: true });

                    const res = SignUpStep2Schema.safeParse(data);
                    if (res.success) {
                        dispatch({ type: "SET_ERRORS_STEP2", payload: {} });
                        return { ok: true, data };
                    }

                    const errors = pickFirstFieldErrors<SignUpStep2FormData>(res.error.issues);
                    dispatch({ type: "SET_ERRORS_STEP2", payload: errors });
                    return { ok: false, data };
                },
            },
            step3: {
                state: {
                    email: state.email,
                    nickname: state.nickname,
                    password: state.password,
                    confirmPassword: state.confirmPassword,
                    newsUpdates: state.newsUpdates,
                    tosPrivacy: state.tosPrivacy,
                    errors: state.errors.step3,
                    hasAttemptedValidation: state.hasAttemptedValidation.step3,
                },
                setField: (field, value) => {
                    dispatch({ type: "SET_FIELD_STEP3", payload: { field, value } });
                },
                validateAndGetResult: () => {
                    const data: SignUpStep3FormData = {
                        email: state.email,
                        nickname: state.nickname,
                        password: state.password,
                        confirmPassword: state.confirmPassword,
                        newsUpdates: state.newsUpdates,
                        tosPrivacy: state.tosPrivacy,
                    };

                    dispatch({ type: "SET_ATTEMPTED_STEP3", payload: true });

                    const res = SignUpStep3Schema.safeParse(data);
                    if (res.success) {
                        dispatch({ type: "SET_ERRORS_STEP3", payload: {} });
                        return { ok: true, data };
                    }

                    const errors = pickFirstFieldErrors<SignUpStep3FormData>(res.error.issues);
                    dispatch({ type: "SET_ERRORS_STEP3", payload: errors });
                    return { ok: false, data };
                },
            },
            reset: () => {
                dispatch({ type: "RESET" });
                if (typeof window !== "undefined") {
                    window.localStorage.removeItem(LS_KEY_STEP1);
                    window.localStorage.removeItem(LS_KEY_STEP2);
                }
            },
            clearStorage: () => {
                if (typeof window !== "undefined") {
                    window.localStorage.removeItem(LS_KEY_STEP1);
                    window.localStorage.removeItem(LS_KEY_STEP2);
                }
            },
        };
    }, [state]);

    return React.createElement(SignUpContext.Provider, { value }, children);
}

// ---------- Hooks ----------

export function useSignUpStep1() {
    const ctx = useContext(SignUpContext);
    if (!ctx) throw new Error("useSignUpStep1 must be used within SignUpProvider");
    return ctx.step1;
}

export function useSignUpStep2() {
    const ctx = useContext(SignUpContext);
    if (!ctx) throw new Error("useSignUpStep2 must be used within SignUpProvider");
    return ctx.step2;
}

export function useSignUpStep3() {
    const ctx = useContext(SignUpContext);
    if (!ctx) throw new Error("useSignUpStep3 must be used within SignUpProvider");
    return ctx.step3;
}
