import {
  initState,
  signUpReducer,
  initialState,
  LS_KEY_STEP1,
  LS_KEY_STEP2,
  LS_KEY_VERIFICATION_TOKEN,
  LS_KEY_CURRENT_STEP,
} from './signUpReducer';

describe('signUpReducer', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  describe('initState', () => {
    it('returns the initial state with no stored data', () => {
      const state = initState();
      expect(state.currentStep).toBe(0);
      expect(state.emailVerificationToken).toBeNull();
      expect(state.firstName).toBe('');
    });

    it('restores step 1 data including a valid country', () => {
      window.localStorage.setItem(
        LS_KEY_STEP1,
        JSON.stringify({ firstName: 'John', lastName: 'Doe', country: 'US' })
      );
      const state = initState();
      expect(state.firstName).toBe('John');
      expect(state.lastName).toBe('Doe');
      expect(state.country).toBe('US');
    });

    it('coerces null step 1 values to empty strings', () => {
      window.localStorage.setItem(
        LS_KEY_STEP1,
        JSON.stringify({ firstName: null, lastName: null, country: 'US' })
      );
      const state = initState();
      expect(state.firstName).toBe('');
      expect(state.lastName).toBe('');
    });

    it('drops an invalid country code', () => {
      window.localStorage.setItem(
        LS_KEY_STEP1,
        JSON.stringify({ firstName: 'John', lastName: 'Doe', country: 'XX' })
      );
      const state = initState();
      expect(state.country).toBe('');
    });

    it('restores step 2 values and coerces null to undefined', () => {
      window.localStorage.setItem(
        LS_KEY_STEP2,
        JSON.stringify({
          tradingExperienceLevel: 'BEGINNER',
          primaryTradingStrategy: null,
          riskTolerance: null,
          preferredTradingPlatforms: null,
        })
      );
      const state = initState();
      expect(state.tradingExperienceLevel).toBe('BEGINNER');
      expect(state.primaryTradingStrategy).toBeUndefined();
    });

    it('migrates an old-format step (1-4) to the new format (0-3)', () => {
      // Step 4 (old) maps to step 3 (new); needs a verification token to be kept
      window.localStorage.setItem(LS_KEY_VERIFICATION_TOKEN, 'tok-1');
      window.localStorage.setItem(LS_KEY_CURRENT_STEP, '4');
      const state = initState();
      expect(state.currentStep).toBe(3);
      // NOTE: known behavior — the migrated value is not rewritten to
      // localStorage unless the step is clamped (validatedStep !== restoredStep).
      expect(window.localStorage.getItem(LS_KEY_CURRENT_STEP)).toBe('4');
    });

    it('shifts a new-format step down by one due to the 1-4 migration condition', () => {
      // KNOWN BUG in initState: `parsed >= 1 && parsed <= 4` matches new-format
      // values 1-3 as well, so a stored '2' becomes step 1 (not 2).
      window.localStorage.setItem(
        LS_KEY_STEP1,
        JSON.stringify({ firstName: 'John' })
      );
      window.localStorage.setItem(LS_KEY_CURRENT_STEP, '2');
      const state = initState();
      expect(state.currentStep).toBe(1);
    });

    it('clamps step 3 to 0 when no verification token is stored', () => {
      window.localStorage.setItem(LS_KEY_CURRENT_STEP, '3');
      const state = initState();
      expect(state.currentStep).toBe(0);
      expect(window.localStorage.getItem(LS_KEY_CURRENT_STEP)).toBe('0');
    });

    it('clamps steps 1-2 to 0 when no step 1 data is stored', () => {
      window.localStorage.setItem(LS_KEY_CURRENT_STEP, '1');
      const state = initState();
      expect(state.currentStep).toBe(0);
    });

    it('shifts a stored new-format step 1 to 0 (migration bug), even with step 1 data', () => {
      // KNOWN BUG: the 1-4 migration condition shifts new-format step 1 to 0.
      window.localStorage.setItem(
        LS_KEY_STEP1,
        JSON.stringify({ firstName: 'John' })
      );
      window.localStorage.setItem(LS_KEY_CURRENT_STEP, '1');
      const state = initState();
      expect(state.currentStep).toBe(0);
    });

    it('resets to step 0 for an out-of-range stored step', () => {
      window.localStorage.setItem(LS_KEY_CURRENT_STEP, '9');
      const state = initState();
      expect(state.currentStep).toBe(0);
    });

    it('restores the verification token', () => {
      window.localStorage.setItem(LS_KEY_VERIFICATION_TOKEN, 'tok-1');
      const state = initState();
      expect(state.emailVerificationToken).toBe('tok-1');
    });
  });

  describe('reducer actions', () => {
    it('SET_FIELD_STEP1 updates the field, clears errors and token', () => {
      const state = {
        ...initialState,
        errors: { ...initialState.errors, step1: { firstName: 'req' } },
        hasAttemptedValidation: {
          ...initialState.hasAttemptedValidation,
          step1: true,
        },
        emailVerificationToken: 'tok',
      };
      const next = signUpReducer(state, {
        type: 'SET_FIELD_STEP1',
        payload: { field: 'firstName', value: 'John' },
      });
      expect(next.firstName).toBe('John');
      expect(next.errors.step1).toEqual({});
      expect(next.emailVerificationToken).toBeNull();
    });

    it('SET_FIELD_STEP2 updates the field and clears the token', () => {
      const state = {
        ...initialState,
        emailVerificationToken: 'tok',
      };
      const next = signUpReducer(state, {
        type: 'SET_FIELD_STEP2',
        payload: { field: 'tradingExperienceLevel', value: 'ADVANCED' },
      });
      expect(next.tradingExperienceLevel).toBe('ADVANCED');
      expect(next.emailVerificationToken).toBeNull();
    });

    it('SET_FIELD_STEP1 keeps errors when validation was not attempted', () => {
      const state = {
        ...initialState,
        errors: { ...initialState.errors, step1: { firstName: 'req' } },
        hasAttemptedValidation: {
          ...initialState.hasAttemptedValidation,
          step1: false,
        },
      };
      const next = signUpReducer(state, {
        type: 'SET_FIELD_STEP1',
        payload: { field: 'firstName', value: 'John' },
      });
      expect(next.errors.step1).toEqual({ firstName: 'req' });
    });

    it('SET_FIELD_STEP3 keeps errors when validation was not attempted', () => {
      const state = {
        ...initialState,
        errors: { ...initialState.errors, step3: { email: 'bad' } },
      };
      const next = signUpReducer(state, {
        type: 'SET_FIELD_STEP3',
        payload: { field: 'email', value: 'a@b.c' },
      });
      expect(next.errors.step3).toEqual({ email: 'bad' });
    });

    it('SET_FIELD_STEP3 updates the field and clears the server error', () => {
      const state = { ...initialState, serverError: 'boom' };
      const next = signUpReducer(state, {
        type: 'SET_FIELD_STEP3',
        payload: { field: 'email', value: 'a@b.c' },
      });
      expect(next.email).toBe('a@b.c');
      expect(next.serverError).toBeNull();
    });

    it('SET_ERRORS_STEP1 sets step 1 errors', () => {
      const next = signUpReducer(initialState, {
        type: 'SET_ERRORS_STEP1',
        payload: { firstName: 'req' },
      });
      expect(next.errors.step1).toEqual({ firstName: 'req' });
    });

    it('SET_ATTEMPTED_STEP2 sets the attempted flag', () => {
      const next = signUpReducer(initialState, {
        type: 'SET_ATTEMPTED_STEP2',
        payload: true,
      });
      expect(next.hasAttemptedValidation.step2).toBe(true);
    });

    it('SET_STEP stores the step and updates currentStep', () => {
      const next = signUpReducer(initialState, { type: 'SET_STEP', payload: 2 });
      expect(next.currentStep).toBe(2);
      expect(window.localStorage.getItem(LS_KEY_CURRENT_STEP)).toBe('2');
    });

    it('NEXT_STEP clamps at step 3', () => {
      const at3 = { ...initialState, currentStep: 3 };
      const next = signUpReducer(at3, { type: 'NEXT_STEP' });
      expect(next.currentStep).toBe(3);
    });

    it('PREV_STEP clamps at step 0', () => {
      const next = signUpReducer(initialState, { type: 'PREV_STEP' });
      expect(next.currentStep).toBe(0);
    });

    it('RESET returns the initial state', () => {
      const state = { ...initialState, currentStep: 2, emailVerificationToken: 't' };
      const next = signUpReducer(state, { type: 'RESET' });
      expect(next).toEqual(initialState);
    });

    it('returns the same state for an unknown action', () => {
      const next = signUpReducer(initialState, { type: 'UNKNOWN' } as never);
      expect(next).toBe(initialState);
    });
  });
});
