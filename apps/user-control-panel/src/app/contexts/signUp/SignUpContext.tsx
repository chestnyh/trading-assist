import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useReducer,
} from "react";
import {
    usersApiControllerCreateUser,
    type CreateUserDto,
} from "@trading-bot/api-client";

import { SignUpStep1Schema, SignUpStep2Schema, SignUpStep3Schema } from "./signUpSchemas";
import {
    signUpReducer,
    initState,
    pickFirstFieldErrors,
    initialStep2Values,
    LS_KEY_STEP1,
    LS_KEY_STEP2,
    LS_KEY_VERIFICATION_TOKEN,
    LS_KEY_CURRENT_STEP,
} from "./signUpReducer";
import type {
    SignUpContextValue,
    SignUpStep1FormData,
    SignUpStep2FormData,
    SignUpStep3FormData,
} from "./signUpTypes";

// ---------- Context ----------

const SignUpContext = createContext<SignUpContextValue | null>(null);

// ---------- Provider ----------

export function SignUpProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer<typeof signUpReducer, undefined>(
        signUpReducer,
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
                    window.localStorage.removeItem(LS_KEY_VERIFICATION_TOKEN);
                    window.localStorage.removeItem(LS_KEY_CURRENT_STEP);
                }
            },
            registerUser: async () => {
                const createUserDto: CreateUserDto = {
                    firstName: state.firstName,
                    lastName: state.lastName,
                    email: state.email,
                    nickname: state.nickname,
                    password: state.password,
                    tradingExperienceLevel: state.tradingExperienceLevel,
                    primaryTradingStrategy: state.primaryTradingStrategy,
                    riskTolerance: state.riskTolerance,
                    preferredTradingPlatforms: state.preferredTradingPlatforms,
                };

                dispatch({ type: "SET_SUBMITTING", payload: true });
                dispatch({ type: "SET_SERVER_ERROR", payload: null });

                try {
                    const response = await usersApiControllerCreateUser(createUserDto);

                    let token: string | undefined;

                    if (response && typeof response === 'object') {
                        if ('emailVerificationToken' in response) {
                            token = (response as unknown as { emailVerificationToken: string }).emailVerificationToken;
                        }
                        else if ('data' in response && response.data && typeof response.data === 'object') {
                            const data = response.data as unknown as { emailVerificationToken?: string };
                            token = data.emailVerificationToken;
                        }
                    }

                    if (token) {
                        dispatch({ type: "SET_VERIFICATION_TOKEN", payload: token });
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem(LS_KEY_VERIFICATION_TOKEN, token);
                        }
                    }

                    dispatch({ type: "SET_SUBMITTING", payload: false });
                    return { ok: true };
                } catch (error: unknown) {
                    dispatch({ type: "SET_SUBMITTING", payload: false });

                    let errorMessage = "Registration failed. Please try again.";

                    if (error && typeof error === "object") {
                        if ("message" in error) {
                            const message = String(error.message);

                            if (message === "Failed to fetch" || message.includes("fetch")) {
                                errorMessage = "Unable to connect to the server. Please check your internet connection and ensure the server is running.";
                            } else {
                                errorMessage = message;
                            }
                        } else if ("status" in error) {
                            const status = (error as { status: number }).status;
                            if (status === 409) {
                                errorMessage = "Email or nickname already exists. Please use different credentials.";
                            } else if (status === 400) {
                                errorMessage = "Some information is incorrect. Please check all fields and try again.";
                            } else if (status >= 500) {
                                errorMessage = "Server error. Please try again later.";
                            }
                        }
                    } else if (error instanceof TypeError && error.message === "Failed to fetch") {
                        errorMessage = "Unable to connect to the server. Please check your internet connection and ensure the server is running.";
                    }

                    dispatch({ type: "SET_SERVER_ERROR", payload: errorMessage });
                    return { ok: false, error: errorMessage };
                }
            },
            isSubmitting: state.isSubmitting,
            serverError: state.serverError,
            emailVerificationToken: state.emailVerificationToken,
            // Navigation
            currentStep: state.currentStep,
            goToStep: (step: 0 | 1 | 2 | 3) => {
                dispatch({ type: "SET_STEP", payload: step });
            },
            nextStep: () => {
                dispatch({ type: "NEXT_STEP" });
            },
            prevStep: () => {
                dispatch({ type: "PREV_STEP" });
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

export function useSignUpContext() {
    const ctx = useContext(SignUpContext);
    if (!ctx) throw new Error("useSignUpContext must be used within SignUpProvider");
    return {
        registerUser: ctx.registerUser,
        isSubmitting: ctx.isSubmitting,
        serverError: ctx.serverError,
        emailVerificationToken: ctx.emailVerificationToken,
        reset: ctx.reset,
        clearStorage: ctx.clearStorage,
        // Navigation
        currentStep: ctx.currentStep,
        goToStep: ctx.goToStep,
        nextStep: ctx.nextStep,
        prevStep: ctx.prevStep,
    };
}
