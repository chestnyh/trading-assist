import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "../src/test/setupTests";
import userEvent from "@testing-library/user-event";
import App from "../src/app/app";

type FetchMockRule = {
  pattern: RegExp;
  response: { status: number; data: unknown };
};

const createMockResponse = (status: number, data: unknown) => {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ "content-type": "application/json" }),
    json: async () => data,
  } as unknown as Response;
};

const findFetchCall = (pattern: RegExp) => {
  return (global.fetch as jest.Mock).mock.calls.find(([url]) => pattern.test(String(url)));
};

const setupRender = async () => {
  const user = userEvent.setup();
  window.history.pushState({}, "", "/");
  render(<App />);

  const headerSignInButton = await screen.findByRole("button", { name: /sign in/i });
  await user.click(headerSignInButton);

  const createAccountButton = await screen.findByRole("button", { name: /create account/i });
  await user.click(createAccountButton);

  await screen.findByText(/let's start!/i);
  await screen.findByLabelText(/first name/i);

  return { user };
};

const fillStep1Valid = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/first name/i), "John");
  await user.type(screen.getByLabelText(/last name/i), "Doe");

  const countryButton = screen.getByRole("button", { name: /select your country/i });
  await user.click(countryButton);

  const usOption = await screen.findByRole("button", { name: /united states/i });
  await user.click(usOption);

  await user.click(screen.getByRole("button", { name: /^next$/i }));
  await screen.findByText(/trading preferences/i);
};

const fillStep2SkipOptional = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button", { name: /^next$/i }));
  await screen.findByText(/account info/i);
};

const fillStep3Valid = async (user: ReturnType<typeof userEvent.setup>) => {
  await screen.findByPlaceholderText(/enter your email/i);

  await user.type(screen.getByPlaceholderText(/enter your email/i), "test@example.com");
  await user.type(screen.getByPlaceholderText(/enter your nickname/i), "tester");
  await user.type(screen.getByPlaceholderText(/^enter your password$/i), "Password123*");
  await user.type(screen.getByPlaceholderText(/confirm your password/i), "Password123*");

  const tos = screen.getByLabelText(/terms of service and privacy policy/i);
  await user.click(tos);
};

describe("Registration Flow (Integration)", () => {
  let fetchRules: FetchMockRule[];
  const verificationToken = "123e4567-e89b-12d3-a456-426614174000";

  beforeEach(() => {
    jest.clearAllMocks();

    fetchRules = [];
    global.fetch = jest.fn(async (url: RequestInfo | URL) => {
      const urlStr = String(url);
      const rule = fetchRules.find((r) => r.pattern.test(urlStr));
      if (rule) {
        return createMockResponse(rule.response.status, rule.response.data);
      }
      return createMockResponse(200, {});
    });

    try {
      window.localStorage.clear();
      window.sessionStorage.clear();
    } catch {}
  });

  const mockFetchJson = (pattern: RegExp, status: number, data: unknown) => {
    fetchRules.unshift({ pattern, response: { status, data } });
  };

  it("allows navigation to Sign Up from Sign In via 'Create account'", async () => {
    await setupRender();
    expect(screen.getByText(/let's start!/i)).toBeInTheDocument();
  });

  it("shows step 1 validation errors and does not navigate to step 2", async () => {
    const { user } = await setupRender();

    await user.click(screen.getByRole("button", { name: /^next$/i }));

    await waitFor(() => {
      expect(screen.queryByText(/first name is required/i)).not.toBeNull();
      expect(screen.queryByText(/last name is required/i)).not.toBeNull();
      expect(screen.queryByText(/country is required/i)).not.toBeNull();
    });

    expect(screen.queryByText(/trading preferences/i)).toBeNull();
    expect(findFetchCall(/\/api\/v1\/users$/)).toBeUndefined();
  });

  it("shows step 3 validation error when passwords do not match and does not call API", async () => {
    const { user } = await setupRender();
    await fillStep1Valid(user);
    await fillStep2SkipOptional(user);

    await user.type(screen.getByPlaceholderText(/enter your email/i), "test@example.com");
    await user.type(screen.getByPlaceholderText(/enter your nickname/i), "tester");
    await user.type(screen.getByPlaceholderText(/^enter your password$/i), "Password123*");
    await user.type(screen.getByPlaceholderText(/confirm your password/i), "Password123*DIFF");

    const tos = screen.getByLabelText(/terms of service and privacy policy/i);
    await user.click(tos);

    await user.click(screen.getByRole("button", { name: /^next$/i }));

    await waitFor(() => {
      expect(screen.queryByText(/passwords do not match/i)).not.toBeNull();
    });

    expect(findFetchCall(/\/api\/v1\/users$/)).toBeUndefined();
    expect(screen.queryByText(/email confirmation/i)).toBeNull();
  });

  it("registers successfully and sends correct payload to API", async () => {
    mockFetchJson(/\/api\/v1\/users$/, 201, {
      emailVerificationToken: verificationToken,
    });

    const { user } = await setupRender();
    await fillStep1Valid(user);
    await fillStep2SkipOptional(user);
    await fillStep3Valid(user);

    await user.click(screen.getByRole("button", { name: /^next$/i }));

    await screen.findByText(/email confirmation/i);

    const call = findFetchCall(/\/api\/v1\/users$/);
    expect(call).toBeTruthy();

    const [url, options] = call as unknown as [string, RequestInit];
    expect(String(url)).toMatch(/\/api\/v1\/users$/);
    expect(options.method).toBe("POST");

    const body = JSON.parse(String(options.body));
    expect(body).toMatchObject({
      firstName: "John",
      lastName: "Doe",
      email: "test@example.com",
      nickname: "tester",
      password: "Password123*",
    });
  });

  it("shows server error on 409 and stays on step 3", async () => {
    mockFetchJson(/\/api\/v1\/users$/, 409, { statusCode: 409, message: "Conflict" });

    const { user } = await setupRender();
    await fillStep1Valid(user);
    await fillStep2SkipOptional(user);
    await fillStep3Valid(user);

    await user.click(screen.getByRole("button", { name: /^next$/i }));

    await waitFor(() => {
      expect(screen.queryByText(/already exists/i)).not.toBeNull();
    });

    expect(screen.queryByText(/email confirmation/i)).toBeNull();
  });

  it("verifies email successfully on step 4", async () => {
    mockFetchJson(/\/api\/v1\/users$/, 201, {
      emailVerificationToken: verificationToken,
    });
    mockFetchJson(/\/api\/v1\/auth\/verify-email$/, 200, { success: true });

    const { user } = await setupRender();
    await fillStep1Valid(user);
    await fillStep2SkipOptional(user);
    await fillStep3Valid(user);

    await user.click(screen.getByRole("button", { name: /^next$/i }));
    await screen.findByText(/email confirmation/i);

    fireEvent.change(screen.getByLabelText(/verification code/i), {
      target: { value: "123456" },
    });

    await user.click(screen.getByRole("button", { name: /^verify$/i }));

    await screen.findByText(/email verified!/i);

    const call = findFetchCall(/\/api\/v1\/auth\/verify-email$/);
    expect(call).toBeTruthy();

    const [, options] = call as unknown as [string, RequestInit];
    const body = JSON.parse(String(options.body));
    expect(body).toEqual({
      code: "123456",
      token: verificationToken,
    });
  });
});
