import React, { createContext, ReactNode, useContext, useEffect, useMemo, useReducer } from "react";
import { z } from "zod";
import { CreateUserDtoSchema } from "@trading-bot/api-client";

// ---------- Schema ----------

const step1FirstNameSchema = CreateUserDtoSchema.shape.firstName;
const step1LastNameSchema = CreateUserDtoSchema.shape.lastName;
const step1CountrySchema = z.string().min(1, "Country is required");

export const SignUpStep1Schema = z.object({
    firstName: step1FirstNameSchema,
    lastName: step1LastNameSchema,
    country: step1CountrySchema,
});

export type SignUpStep1FormData = z.infer<typeof SignUpStep1Schema>;
type Step1Field = keyof SignUpStep1FormData;
type Step1Errors = Partial<Record<Step1Field, string>>;

// ----------  LocalStorage ----------

export const LS_KEY_STEP1 = "signUp.step1";

export function clearSignUpStep1Data(): void {
    if (typeof window !== "undefined") {
        window.localStorage.removeItem(LS_KEY_STEP1);
    }
}

// ----------  State / Actions ----------

type Step1State = SignUpStep1FormData & {
    errors: Step1Errors;
    hasAttemptedValidation: boolean;
};

type Step1Action =
    | { type: "SET_FIELD"; payload: { field: Step1Field; value: string } }
    | { type: "SET_ERRORS"; payload: Step1Errors }
    | { type: "SET_ATTEMPTED"; payload: boolean }
    | { type: "RESET" };

const step1InitialState: Step1State = {
    firstName: "",
    lastName: "",
    country: "",
    errors: {},
    hasAttemptedValidation: false,
};

function initStep1State(): Step1State {
    if (typeof window === "undefined") return step1InitialState;

    try {
        const raw = window.localStorage.getItem(LS_KEY_STEP1);
        if (!raw) return step1InitialState;

        const parsed = JSON.parse(raw) as Partial<SignUpStep1FormData>;
        return {
            ...step1InitialState,
            firstName: parsed.firstName ?? "",
            lastName: parsed.lastName ?? "",
            country: parsed.country ?? "",
            hasAttemptedValidation: false,
        };
    } catch {
        window.localStorage.removeItem(LS_KEY_STEP1);
        return step1InitialState;
    }
}

function step1Reducer(state: Step1State, action: Step1Action): Step1State {
    switch (action.type) {
        case "SET_FIELD": {
            const { field, value } = action.payload;

            const nextErrors = { ...state.errors };
            if (state.hasAttemptedValidation) delete nextErrors[field];

            return { ...state, [field]: value, errors: nextErrors };
        }

        case "SET_ERRORS":
            return { ...state, errors: action.payload };

        case "SET_ATTEMPTED":
            return { ...state, hasAttemptedValidation: action.payload };

        case "RESET":
            return step1InitialState;

        default:
            return state;
    }
}

// ---------- Helpers ----------

function validateStep1(data: SignUpStep1FormData): { ok: boolean; errors: Step1Errors } {
    const res = SignUpStep1Schema.safeParse(data);
    if (res.success) return { ok: true, errors: {} };

    const errors: Step1Errors = {};
    for (const issue of res.error.issues) {
        const field = issue.path[0] as Step1Field | undefined;
        if (field && !errors[field]) errors[field] = issue.message;
    }
    return { ok: false, errors };
}

// ---------- Context ----------

type Step1ContextValue = {
    state: Step1State;

    setField: (field: Step1Field, value: string) => void;

    validateAndGetResult: () => { ok: boolean; data: SignUpStep1FormData };

    reset: () => void;
};

const Step1Context = createContext<Step1ContextValue | null>(null);

export function SignUpStep1Provider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(step1Reducer, undefined, initStep1State);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const allEmpty = !state.firstName && !state.lastName && !state.country;
        if (allEmpty) return;

        try {
            const toStore: SignUpStep1FormData = {
                firstName: state.firstName,
                lastName: state.lastName,
                country: state.country,
            };
            window.localStorage.setItem(LS_KEY_STEP1, JSON.stringify(toStore));
        } catch {
            // no-op
        }
    }, [state.firstName, state.lastName, state.country]);

    const value = useMemo<Step1ContextValue>(() => {
        return {
            state,

            setField: (field, value) => dispatch({ type: "SET_FIELD", payload: { field, value } }),

            validateAndGetResult: () => {
                const data: SignUpStep1FormData = {
                    firstName: state.firstName,
                    lastName: state.lastName,
                    country: state.country,
                };

                dispatch({ type: "SET_ATTEMPTED", payload: true });

                const result = validateStep1(data);
                dispatch({ type: "SET_ERRORS", payload: result.errors });

                return { ok: result.ok, data };
            },

            reset: () => {
                dispatch({ type: "RESET" });
                if (typeof window !== "undefined") window.localStorage.removeItem(LS_KEY_STEP1);
            },
        };
    }, [state]);

    return <Step1Context.Provider value={value}>{children}</Step1Context.Provider>;
}

export function useSignUpStep1() {
    const ctx = useContext(Step1Context);
    if (!ctx) throw new Error("useSignUpStep1 must be used within a SignUpStep1Provider");
    return ctx;
}
