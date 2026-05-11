import type { z } from 'zod';
import type {
  SignUpState,
  SignUpAction,
  SignUpStep1FormData,
  SignUpStep2FormData,
  SignUpStep3FormData,
  SignUpFormData,
  FieldErrors,
} from './signUpTypes';

// ---------- LocalStorage Keys ----------

export const LS_KEY_STEP1 = 'signUp.step1';
export const LS_KEY_STEP2 = 'signUp.step2';
export const LS_KEY_VERIFICATION_TOKEN = 'signUp.verificationToken';
export const LS_KEY_CURRENT_STEP = 'signUp.currentStep';

// ---------- Initial Values ----------

export const initialStep1Values: SignUpStep1FormData = {
  firstName: '',
  lastName: '',
  country: '',
};

export const initialStep2Values: SignUpStep2FormData = {
  tradingExperienceLevel: undefined,
  primaryTradingStrategy: undefined,
  riskTolerance: undefined,
  preferredTradingPlatforms: undefined,
};

export const initialStep3Values: SignUpStep3FormData = {
  email: '',
  nickname: '',
  password: '',
  confirmPassword: '',
  newsUpdates: false,
  tosPrivacy: false,
};

export const initialState: SignUpState = {
  ...initialStep1Values,
  ...initialStep2Values,
  ...initialStep3Values,
  currentStep: 0,
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
  isSubmitting: false,
  serverError: null,
  emailVerificationToken: null,
};

// ---------- Helper Functions ----------

export function pickFirstFieldErrors<T extends Record<string, unknown>>(
  issues: z.ZodIssue[]
): FieldErrors<T> {
  const errors: FieldErrors<T> = {};
  for (const issue of issues) {
    const field = issue.path[0] as keyof T | undefined;
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
}

// ---------- State Initialization ----------

export function initState(): SignUpState {
  if (typeof window === 'undefined') return initialState;

  const restored: Partial<SignUpFormData> = {};

  // Restore Step 1 from localStorage
  try {
    const step1Raw = window.localStorage.getItem(LS_KEY_STEP1);
    if (step1Raw) {
      const step1Parsed = JSON.parse(step1Raw) as Record<string, unknown>;
      if (step1Parsed.firstName !== undefined) {
        restored.firstName = (
          step1Parsed.firstName === null || step1Parsed.firstName === undefined
            ? ''
            : step1Parsed.firstName
        ) as string;
      }
      if (step1Parsed.lastName !== undefined) {
        restored.lastName = (
          step1Parsed.lastName === null || step1Parsed.lastName === undefined
            ? ''
            : step1Parsed.lastName
        ) as string;
      }
      if (step1Parsed.country !== undefined) {
        restored.country = (
          step1Parsed.country === null || step1Parsed.country === undefined
            ? ''
            : step1Parsed.country
        ) as string;
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
        restored.tradingExperienceLevel = (
          step2Parsed.tradingExperienceLevel === null
            ? undefined
            : step2Parsed.tradingExperienceLevel
        ) as SignUpStep2FormData['tradingExperienceLevel'];
      }
      if (step2Parsed.primaryTradingStrategy !== undefined) {
        restored.primaryTradingStrategy = (
          step2Parsed.primaryTradingStrategy === null
            ? undefined
            : step2Parsed.primaryTradingStrategy
        ) as SignUpStep2FormData['primaryTradingStrategy'];
      }
      if (step2Parsed.riskTolerance !== undefined) {
        restored.riskTolerance = (
          step2Parsed.riskTolerance === null
            ? undefined
            : step2Parsed.riskTolerance
        ) as SignUpStep2FormData['riskTolerance'];
      }
      if (step2Parsed.preferredTradingPlatforms !== undefined) {
        restored.preferredTradingPlatforms = (
          step2Parsed.preferredTradingPlatforms === null
            ? undefined
            : step2Parsed.preferredTradingPlatforms
        ) as SignUpStep2FormData['preferredTradingPlatforms'];
      }
    }
  } catch {
    window.localStorage.removeItem(LS_KEY_STEP2);
  }

  // Restore verification token from localStorage
  let restoredToken: string | null = null;
  try {
    const tokenRaw = window.localStorage.getItem(LS_KEY_VERIFICATION_TOKEN);
    if (tokenRaw) {
      restoredToken = tokenRaw;
    }
  } catch {
    window.localStorage.removeItem(LS_KEY_VERIFICATION_TOKEN);
  }

  // Restore currentStep from localStorage
  // Handle migration from old format (1-4) to new format (0-3)
  let restoredStep: 0 | 1 | 2 | 3 = 0;
  try {
    const stepRaw = window.localStorage.getItem(LS_KEY_CURRENT_STEP);
    if (stepRaw) {
      const parsed = parseInt(stepRaw, 10);
      // Migrate from old format (1-4) to new format (0-3)
      if (parsed >= 1 && parsed <= 4) {
        restoredStep = (parsed - 1) as 0 | 1 | 2 | 3;
      } else if (parsed >= 0 && parsed <= 3) {
        restoredStep = parsed as 0 | 1 | 2 | 3;
      }
    }
  } catch {
    window.localStorage.removeItem(LS_KEY_CURRENT_STEP);
  }

  // ---------- Validate currentStep ----------

  const hasStep1Data = Boolean(
    restored.firstName || restored.lastName || restored.country
  );

  let validatedStep = restoredStep;

  if (restoredStep === 3 && !restoredToken) {
    validatedStep = 0;
  } else if (restoredStep === 2 && !hasStep1Data) {
    validatedStep = 0;
  } else if (restoredStep === 1 && !hasStep1Data) {
    validatedStep = 0;
  }

  if (validatedStep !== restoredStep && typeof window !== 'undefined') {
    window.localStorage.setItem(LS_KEY_CURRENT_STEP, String(validatedStep));
  }

  return {
    ...initialState,
    ...restored,
    emailVerificationToken: restoredToken,
    currentStep: validatedStep,
  };
}

// ---------- Reducer ----------

export function signUpReducer(
  state: SignUpState,
  action: SignUpAction
): SignUpState {
  switch (action.type) {
    case 'SET_FIELD_STEP1': {
      const { field, value } = action.payload;
      const nextErrors = { ...state.errors.step1 };
      if (state.hasAttemptedValidation.step1) delete nextErrors[field];
      const shouldClearToken = state.emailVerificationToken !== null;
      if (shouldClearToken && typeof window !== 'undefined') {
        window.localStorage.removeItem(LS_KEY_VERIFICATION_TOKEN);
      }
      return {
        ...state,
        [field]: value,
        errors: { ...state.errors, step1: nextErrors },
        emailVerificationToken: null,
      };
    }

    case 'SET_FIELD_STEP2': {
      const { field, value } = action.payload;
      const nextErrors = { ...state.errors.step2 };
      if (state.hasAttemptedValidation.step2) delete nextErrors[field];
      const shouldClearToken = state.emailVerificationToken !== null;
      if (shouldClearToken && typeof window !== 'undefined') {
        window.localStorage.removeItem(LS_KEY_VERIFICATION_TOKEN);
      }
      return {
        ...state,
        [field]: value,
        errors: { ...state.errors, step2: nextErrors },
        emailVerificationToken: null,
      };
    }

    case 'SET_FIELD_STEP3': {
      const { field, value } = action.payload;
      const nextErrors = { ...state.errors.step3 };
      if (state.hasAttemptedValidation.step3) delete nextErrors[field];
      const shouldClearToken = state.emailVerificationToken !== null;
      if (shouldClearToken && typeof window !== 'undefined') {
        window.localStorage.removeItem(LS_KEY_VERIFICATION_TOKEN);
      }
      return {
        ...state,
        [field]: value,
        errors: { ...state.errors, step3: nextErrors },
        serverError: null,
        emailVerificationToken: null,
      };
    }

    case 'SET_ERRORS_STEP1':
      return { ...state, errors: { ...state.errors, step1: action.payload } };

    case 'SET_ERRORS_STEP2':
      return { ...state, errors: { ...state.errors, step2: action.payload } };

    case 'SET_ERRORS_STEP3':
      return { ...state, errors: { ...state.errors, step3: action.payload } };

    case 'SET_ATTEMPTED_STEP1':
      return {
        ...state,
        hasAttemptedValidation: {
          ...state.hasAttemptedValidation,
          step1: action.payload,
        },
      };

    case 'SET_ATTEMPTED_STEP2':
      return {
        ...state,
        hasAttemptedValidation: {
          ...state.hasAttemptedValidation,
          step2: action.payload,
        },
      };

    case 'SET_ATTEMPTED_STEP3':
      return {
        ...state,
        hasAttemptedValidation: {
          ...state.hasAttemptedValidation,
          step3: action.payload,
        },
      };

    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };

    case 'SET_SERVER_ERROR':
      return { ...state, serverError: action.payload };

    case 'SET_VERIFICATION_TOKEN':
      return { ...state, emailVerificationToken: action.payload };

    case 'SET_STEP': {
      const newStep = action.payload;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LS_KEY_CURRENT_STEP, String(newStep));
      }
      return { ...state, currentStep: newStep };
    }

    case 'NEXT_STEP': {
      const nextStep = Math.min(state.currentStep + 1, 3) as 0 | 1 | 2 | 3;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LS_KEY_CURRENT_STEP, String(nextStep));
      }
      return {
        ...state,
        currentStep: nextStep,
      };
    }

    case 'PREV_STEP': {
      const prevStep = Math.max(state.currentStep - 1, 0) as 0 | 1 | 2 | 3;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LS_KEY_CURRENT_STEP, String(prevStep));
      }
      return {
        ...state,
        currentStep: prevStep,
      };
    }

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}
