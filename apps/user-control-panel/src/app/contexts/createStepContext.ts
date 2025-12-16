import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { z } from 'zod';

// ---------- Generic Step Context Factory ----------

type FieldErrors<T extends Record<string, unknown>> = Partial<
  Record<keyof T, string>
>;

type StepState<T extends Record<string, unknown>> = T & {
  errors: FieldErrors<T>;
  hasAttemptedValidation: boolean;
};

type StepAction<T extends Record<string, unknown>> =
  | { type: 'SET_FIELD'; payload: { field: keyof T; value: unknown } }
  | { type: 'SET_ERRORS'; payload: FieldErrors<T> }
  | { type: 'SET_ATTEMPTED'; payload: boolean }
  | { type: 'RESET'; payload: StepState<T> };

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

export function createStepContext<T extends Record<string, unknown>>(cfg: {
  name: string; // used only for error messages
  schema: z.ZodObject<z.ZodRawShape>;
  lsKey: string;
  initialValues: T;
  isEmpty: (data: T) => boolean;
}) {
  const initialState: StepState<T> = {
    ...cfg.initialValues,
    errors: {},
    hasAttemptedValidation: false,
  };

  function initState(): StepState<T> {
    if (typeof window === 'undefined') return initialState;

    try {
      const raw = window.localStorage.getItem(cfg.lsKey);
      if (!raw) return initialState;

      const parsed = JSON.parse(raw) as Record<string, unknown>;

      const restored: Partial<T> = {};
      for (const key in cfg.initialValues) {
        restored[key] = (
          parsed[key] === null ? undefined : parsed[key]
        ) as T[Extract<keyof T, string>];
      }

      return {
        ...initialState,
        ...restored,
        hasAttemptedValidation: false,
      };
    } catch {
      window.localStorage.removeItem(cfg.lsKey);
      return initialState;
    }
  }

  function reducer(state: StepState<T>, action: StepAction<T>): StepState<T> {
    switch (action.type) {
      case 'SET_FIELD': {
        const { field, value } = action.payload;

        const nextErrors = { ...state.errors };
        if (state.hasAttemptedValidation) delete nextErrors[field];

        return { ...state, [field]: value, errors: nextErrors };
      }

      case 'SET_ERRORS':
        return { ...state, errors: action.payload };

      case 'SET_ATTEMPTED':
        return { ...state, hasAttemptedValidation: action.payload };

      case 'RESET':
        return action.payload;

      default:
        return state;
    }
  }

  type ContextValue = {
    state: StepState<T>;
    setField: (field: keyof T, value: T[keyof T]) => void;
    validateAndGetResult: () => { ok: boolean; data: T };
    reset: () => void;
    clearStorage: () => void;
  };

  const Ctx = createContext<ContextValue | null>(null);

  function Provider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer<typeof reducer, undefined>(
      reducer,
      undefined,
      initState
    );

    useEffect(() => {
      if (typeof window === 'undefined') return;

      const { errors, hasAttemptedValidation, ...stepData } = state;

      if (cfg.isEmpty(stepData as unknown as T)) return;

      try {
        const dataToStore: Record<string, unknown> = {};
        const stepDataRecord = stepData as Record<string, unknown>;
        for (const key in cfg.initialValues) {
          const fieldValue = stepDataRecord[key];
          dataToStore[key] = fieldValue === undefined ? null : fieldValue;
        }
        window.localStorage.setItem(cfg.lsKey, JSON.stringify(dataToStore));
      } catch {
        // no-op
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    const value = useMemo<ContextValue>(() => {
      return {
        state,

        setField: (field, value) =>
          dispatch({ type: 'SET_FIELD', payload: { field, value } }),

        validateAndGetResult: () => {
          const { errors, hasAttemptedValidation, ...data } = state;

          dispatch({ type: 'SET_ATTEMPTED', payload: true });

          const res = cfg.schema.safeParse(data);
          if (res.success) {
            dispatch({ type: 'SET_ERRORS', payload: {} });
            return { ok: true, data: data as unknown as T };
          }

          const nextErrors = pickFirstFieldErrors<T>(res.error.issues);
          dispatch({ type: 'SET_ERRORS', payload: nextErrors });

          return { ok: false, data: data as unknown as T };
        },

        reset: () => {
          dispatch({ type: 'RESET', payload: initialState });
          if (typeof window !== 'undefined')
            window.localStorage.removeItem(cfg.lsKey);
        },

        clearStorage: () => {
          if (typeof window !== 'undefined')
            window.localStorage.removeItem(cfg.lsKey);
        },
      };
    }, [state]);

    return React.createElement(Ctx.Provider, { value }, children);
  }

  function useStep() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error(`${cfg.name} must be used within its Provider`);
    return ctx;
  }

  return { Provider, useStep, LS_KEY: cfg.lsKey };
}
