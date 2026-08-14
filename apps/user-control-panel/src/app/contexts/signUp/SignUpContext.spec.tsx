import { render, screen, act } from '@testing-library/react';
import {
  SignUpProvider,
  useSignUpContext,
  useSignUpStep1,
} from './SignUpContext';
import {
  usersApiControllerCreateUser,
} from '@trading-bot/api-client';

jest.mock('@trading-bot/api-client', () => {
  const actual = jest.requireActual('@trading-bot/api-client');
  return {
    ...actual,
    usersApiControllerCreateUser: jest.fn(),
  };
});

const mockCreateUser = usersApiControllerCreateUser as jest.Mock;

// Access the live context by rendering an inline hook consumer that invokes a
// callback. We keep a ref-like holder that is refreshed on each render.

let latestCtx: ReturnType<typeof useSignUpContext> | null = null;
let latestStep1: ReturnType<typeof useSignUpStep1> | null = null;
const ctx = () => latestCtx as NonNullable<ReturnType<typeof useSignUpContext>>;
const step1 = () => latestStep1 as NonNullable<ReturnType<typeof useSignUpStep1>>;

// Probe component that surfaces the current context state into the DOM.
function Probe() {
  latestCtx = useSignUpContext();
  latestStep1 = useSignUpStep1();
  return (
    <div>
      <span data-testid="probe-ready">ready</span>
      <span data-testid="step">{latestCtx.currentStep}</span>
      <span data-testid="serverError">{latestCtx.serverError || ''}</span>
      <span data-testid="token">{latestCtx.emailVerificationToken || ''}</span>
      <span data-testid="submitting">{String(latestCtx.isSubmitting)}</span>
    </div>
  );
}

const setup = async () => {
  render(
    <SignUpProvider>
      <Probe />
    </SignUpProvider>
  );
  await screen.findByTestId('probe-ready');
};

const getStep = () => Number(screen.getByTestId('step').textContent);
const getServerError = () => screen.getByTestId('serverError').textContent;
const getToken = () => screen.getByTestId('token').textContent;

describe('SignUpContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    latestCtx = null;
    latestStep1 = null;
  });

  it('persists step 1 data to localStorage', async () => {
    await setup();
    act(() => {
      step1().setField('firstName', 'John');
      step1().setField('lastName', 'Doe');
      step1().setField('country', 'US');
    });

    await act(async () => {
      // flush effect updates
    });
    const stored = window.localStorage.getItem('signUp.step1');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)).toMatchObject({
      firstName: 'John',
      lastName: 'Doe',
      country: 'US',
    });
  });

  it('validates step 1 and returns ok when data is valid', async () => {
    await setup();
    act(() => {
      step1().setField('firstName', 'John');
      step1().setField('lastName', 'Doe');
      step1().setField('country', 'US');
    });
    const res = step1().validateAndGetResult();
    expect(res.ok).toBe(true);
    expect(res.data).toMatchObject({ firstName: 'John', lastName: 'Doe', country: 'US' });
  });

  it('validates step 1 and reports field errors when data is invalid', async () => {
    await setup();
    const res = step1().validateAndGetResult();
    expect(res.ok).toBe(false);
    expect(res.data.firstName).toBe('');
    // After validation the errors are dispatched; flush the update and re-read.
    await act(async () => {
      // flush dispatched errors
    });
    expect(step1().state.errors.firstName).toBeTruthy();
  });

  it('registers a user successfully and stores the verification token', async () => {
    mockCreateUser.mockResolvedValue({ emailVerificationToken: 'token-123' });
    await setup();
    act(() => {
      step1().setField('firstName', 'John');
      step1().setField('lastName', 'Doe');
      step1().setField('country', 'US');
    });

    let result!: Awaited<{ ok: boolean; error?: string }>;
    await act(async () => {
      result = await ctx().registerUser();
    });

    expect(result).toEqual({ ok: true });
    expect(window.localStorage.getItem('signUp.verificationToken')).toBe('token-123');
    expect(getToken()).toBe('token-123');
  });

  it('registers a user with a nested data response and stores token', async () => {
    mockCreateUser.mockResolvedValue({ data: { emailVerificationToken: 'nested-token' } });
    await setup();
    act(() => {
      step1().setField('firstName', 'John');
      step1().setField('lastName', 'Doe');
      step1().setField('country', 'US');
    });

    await act(async () => {
      await ctx().registerUser();
    });

    expect(window.localStorage.getItem('signUp.verificationToken')).toBe('nested-token');
    expect(getToken()).toBe('nested-token');
  });

  it('registers a user successfully when the response has no token', async () => {
    mockCreateUser.mockResolvedValue({});
    await setup();
    act(() => {
      step1().setField('firstName', 'John');
      step1().setField('lastName', 'Doe');
      step1().setField('country', 'US');
    });

    await act(async () => {
      await ctx().registerUser();
    });

    expect(window.localStorage.getItem('signUp.verificationToken')).toBeNull();
    expect(getToken()).toBe('');
  });

  it('surfaces network error message when registration fails', async () => {
    mockCreateUser.mockRejectedValue({
      isNetworkError: true,
      message: 'Failed to connect',
    });
    await setup();
    act(() => {
      step1().setField('firstName', 'John');
    });

    await act(async () => {
      await ctx().registerUser();
    });

    expect(getServerError()).toMatch(/unable to connect to the server/i);
  });

  it('surfaces 409 conflict message when email/nickname already exist', async () => {
    mockCreateUser.mockRejectedValue({ status: 409, message: 'Conflict' });
    await setup();
    act(() => {
      step1().setField('firstName', 'John');
    });

    await act(async () => {
      await ctx().registerUser();
    });

    expect(getServerError()).toMatch(/already exists/i);
  });

  it('surfaces server error message for status >= 500', async () => {
    mockCreateUser.mockRejectedValue({ status: 500, message: 'Internal' });
    await setup();
    act(() => {
      step1().setField('firstName', 'John');
    });

    await act(async () => {
      await ctx().registerUser();
    });

    expect(getServerError()).toMatch(/server error/i);
  });

  it('surfaces generic message for unknown errors', async () => {
    mockCreateUser.mockRejectedValue({ message: 'Something broke' });
    await setup();
    act(() => {
      step1().setField('firstName', 'John');
    });

    await act(async () => {
      await ctx().registerUser();
    });

    expect(getServerError()).toMatch(/something broke/i);
  });

  it('surfaces network error for a status 0 response', async () => {
    mockCreateUser.mockRejectedValue({ status: 0, message: 'offline' });
    await setup();
    act(() => {
      step1().setField('firstName', 'John');
    });

    await act(async () => {
      await ctx().registerUser();
    });

    expect(getServerError()).toMatch(/unable to connect to the server/i);
  });

  it('surfaces an invalid-information message for a status 400 response', async () => {
    mockCreateUser.mockRejectedValue({ status: 400, message: 'Bad data' });
    await setup();
    act(() => {
      step1().setField('firstName', 'John');
    });

    await act(async () => {
      await ctx().registerUser();
    });

    expect(getServerError()).toMatch(/some information is incorrect/i);
  });

  it('handles "Failed to fetch" as network error', async () => {
    mockCreateUser.mockRejectedValue(new TypeError('Failed to fetch'));
    await setup();
    act(() => {
      step1().setField('firstName', 'John');
    });

    await act(async () => {
      await ctx().registerUser();
    });

    expect(getServerError()).toMatch(/unable to connect to the server/i);
  });

  it('supports next/prev step navigation and persists the step', async () => {
    await setup();
    expect(getStep()).toBe(0);

    await act(async () => {
      ctx().nextStep();
    });
    expect(getStep()).toBe(1);
    expect(window.localStorage.getItem('signUp.currentStep')).toBe('1');

    await act(async () => {
      ctx().prevStep();
    });
    expect(getStep()).toBe(0);

    await act(async () => {
      ctx().goToStep(3);
    });
    expect(getStep()).toBe(3);
  });

  it('does not go below step 0 via prevStep', async () => {
    await setup();
    await act(async () => {
      ctx().prevStep();
    });
    expect(getStep()).toBe(0);
  });

  it('does not go above step 3 via nextStep', async () => {
    await setup();
    await act(async () => {
      ctx().goToStep(3);
      ctx().nextStep();
    });
    expect(getStep()).toBe(3);
  });

  it('clears storage via clearStorage', async () => {
    window.localStorage.setItem('signUp.step1', 'x');
    window.localStorage.setItem('signUp.step2', 'y');
    window.localStorage.setItem('signUp.verificationToken', 't');
    window.localStorage.setItem('signUp.currentStep', '2');
    await setup();

    await act(async () => {
      ctx().clearStorage();
    });

    expect(window.localStorage.getItem('signUp.step1')).toBeNull();
    expect(window.localStorage.getItem('signUp.step2')).toBeNull();
    expect(window.localStorage.getItem('signUp.verificationToken')).toBeNull();
    expect(window.localStorage.getItem('signUp.currentStep')).toBeNull();
  });

  it('resets the state and clears step storage', async () => {
    await setup();
    act(() => {
      step1().setField('firstName', 'John');
    });
    await act(async () => {
      ctx().reset();
    });

    expect(getStep()).toBe(0);
    expect(window.localStorage.getItem('signUp.step1')).toBeNull();
    expect(window.localStorage.getItem('signUp.step2')).toBeNull();
  });
});
