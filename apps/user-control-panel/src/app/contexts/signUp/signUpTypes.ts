import type { z } from "zod";
import type {
    SignUpStep1Schema,
    SignUpStep2Schema,
    SignUpStep3Schema,
} from "./signUpSchemas";

// ---------- Form Data Types ----------

export type SignUpStep1FormData = z.infer<typeof SignUpStep1Schema>;
export type SignUpStep2FormData = z.infer<typeof SignUpStep2Schema>;
export type SignUpStep3FormData = z.infer<typeof SignUpStep3Schema>;

export type SignUpFormData = SignUpStep1FormData & SignUpStep2FormData & SignUpStep3FormData;

// ---------- Error Types ----------

export type FieldErrors<T extends Record<string, unknown>> = Partial<Record<keyof T, string>>;

// ---------- State Types ----------

export type SignUpState = SignUpFormData & {
    currentStep: 1 | 2 | 3 | 4;
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
    isSubmitting: boolean;
    serverError: string | null;
    emailVerificationToken: string | null;
};

// ---------- Action Types ----------

export type SignUpAction =
    | { type: "SET_FIELD_STEP1"; payload: { field: keyof SignUpStep1FormData; value: unknown } }
    | { type: "SET_FIELD_STEP2"; payload: { field: keyof SignUpStep2FormData; value: unknown } }
    | { type: "SET_FIELD_STEP3"; payload: { field: keyof SignUpStep3FormData; value: unknown } }
    | { type: "SET_ERRORS_STEP1"; payload: FieldErrors<SignUpStep1FormData> }
    | { type: "SET_ERRORS_STEP2"; payload: FieldErrors<SignUpStep2FormData> }
    | { type: "SET_ERRORS_STEP3"; payload: FieldErrors<SignUpStep3FormData> }
    | { type: "SET_ATTEMPTED_STEP1"; payload: boolean }
    | { type: "SET_ATTEMPTED_STEP2"; payload: boolean }
    | { type: "SET_ATTEMPTED_STEP3"; payload: boolean }
    | { type: "SET_SUBMITTING"; payload: boolean }
    | { type: "SET_SERVER_ERROR"; payload: string | null }
    | { type: "SET_VERIFICATION_TOKEN"; payload: string | null }
    | { type: "SET_STEP"; payload: 1 | 2 | 3 | 4 }
    | { type: "NEXT_STEP" }
    | { type: "PREV_STEP" }
    | { type: "RESET" };

// ---------- Context Value Type ----------

export type SignUpContextValue = {
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
    // Registration
    registerUser: () => Promise<{ ok: boolean; error?: string }>;
    isSubmitting: boolean;
    serverError: string | null;
    emailVerificationToken: string | null;
    // Navigation
    currentStep: 1 | 2 | 3 | 4;
    goToStep: (step: 1 | 2 | 3 | 4) => void;
    nextStep: () => void;
    prevStep: () => void;
};
