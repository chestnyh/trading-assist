import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "../src/test/setupTests";
import userEvent from "@testing-library/user-event";
import App from "../src/app/app";

type FetchMockRule = {
  pattern: RegExp;
  response?: { status: number; data: unknown };
  networkError?: boolean;
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
  // Navigate to Sign In via header button
  const headerSignInButton = await screen.findByRole("button", { name: /sign in/i });
  await user.click(headerSignInButton);
  // Ensure Sign In form is visible
  await screen.findByText(/sign in into your account/i);
  // Wait for inputs to be ready
  await screen.findByLabelText(/email/i);
  return { user };
};

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/email/i), "test@example.com");
  await user.type(screen.getByPlaceholderText(/enter your password/i), "Password123*");
};

describe("Authorization Flow (Integration)", () => {
  let fetchRules: FetchMockRule[];

  beforeEach(() => {
    jest.clearAllMocks();

    fetchRules = [];
    global.fetch = jest.fn(async (url: RequestInfo | URL) => {
      const urlStr = String(url);
      const rule = fetchRules.find((r) => r.pattern.test(urlStr));

      if (rule) {
        if (rule.networkError) {
          throw new TypeError("Failed to fetch");
        }
        return createMockResponse(rule.response!.status, rule.response!.data);
      }

      // The session-lookup bootstrap runs on every mount; default to "not signed in".
      if (/\/api\/v1\/auth\/me$/.test(urlStr)) {
        return createMockResponse(401, { statusCode: 401, message: "Unauthorized" });
      }

      return createMockResponse(200, {});
    });

    // Ensure unauthenticated state
    try {
      window.localStorage.clear();
      window.sessionStorage.clear();
    } catch (e) {
      void e;
    }
  });

  const mockFetchJson = (pattern: RegExp, status: number, data: unknown) => {
    fetchRules.unshift({ pattern, response: { status, data } });
  };

  const mockFetchNetworkError = (pattern: RegExp) => {
    fetchRules.unshift({ pattern, networkError: true });
  };

  it("allows navigation to Sign In from Main via header button", async () => {
    await setupRender();
    expect(screen.getByText(/sign in into your account/i)).toBeInTheDocument();
  });

  it("shows email validation error for invalid email and does not call API", async () => {
    const { user } = await setupRender();
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    fireEvent.change(passwordInput, { target: { value: "Password123*" } });

    const signInButton = screen.getByRole("button", { name: /^sign in$/i });
    await user.click(signInButton);

    await waitFor(() => {
      expect(screen.queryByText(/please provide a valid email address/i)).not.toBeNull();
    });
    expect(findFetchCall(/\/api\/v1\/auth\/login$/)).toBeUndefined();
  });

  it("shows password validation error for short password and does not call API", async () => {
    const { user } = await setupRender();
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByPlaceholderText(/enter your password/i), "short");
    const signInButton = screen.getByRole("button", { name: /^sign in$/i });
    await user.click(signInButton);

    await waitFor(() => {
      expect(screen.queryByText(/password must be at least 6 characters long/i)).not.toBeNull();
    });
    expect(findFetchCall(/\/api\/v1\/auth\/login$/)).toBeUndefined();
  });

  it("logs in with cookies, stores no credential, and navigates to Dashboard", async () => {
    mockFetchJson(/\/api\/v1\/auth\/login$/, 200, {
      user: { id: 1, email: "test@example.com", nickname: "tester", role: "USER" },
    });

    const { user } = await setupRender();
    await fillValidForm(user);
    const signInButton = screen.getByRole("button", { name: /^sign in$/i });
    await user.click(signInButton);

    await waitFor(() => {
      expect(screen.getAllByText(/dashboard/i).length).toBeGreaterThan(0);
    });

    const loginCall = findFetchCall(/\/api\/v1\/auth\/login$/);
    expect(loginCall).toBeTruthy();
    const [url, options] = loginCall as unknown as [string, RequestInit];
    expect(String(url)).toMatch(/\/api\/v1\/auth\/login$/);
    expect(options.method).toBe("POST");
    expect(options.credentials).toBe("include");

    const parsedBody = JSON.parse(String(options.body));
    expect(parsedBody.rememberMe).toBeUndefined();

    // FR-001 / FR-003 / FR-008: no credential is stored client-side.
    expect(window.localStorage.getItem("auth_token")).toBeNull();
    expect(window.sessionStorage.getItem("auth_token")).toBeNull();
    expect(window.localStorage.getItem("user_data")).toBeNull();
    expect(window.sessionStorage.getItem("user_data")).toBeNull();
  });

  it("includes rememberMe when checkbox checked", async () => {
    mockFetchJson(/\/api\/v1\/auth\/login$/, 200, {
      user: { id: 1, email: "test@example.com", nickname: "tester", role: "USER" },
    });

    const { user } = await setupRender();
    await fillValidForm(user);
    const rememberMeCheckbox = screen.getByLabelText(/remember me/i);
    await user.click(rememberMeCheckbox);
    const signInButton = screen.getByRole("button", { name: /^sign in$/i });
    await user.click(signInButton);

    await waitFor(() => {
      expect(screen.getAllByText(/dashboard/i).length).toBeGreaterThan(0);
    });

    const loginCall = findFetchCall(/\/api\/v1\/auth\/login$/);
    expect(loginCall).toBeTruthy();
    const [, options] = loginCall as unknown as [string, RequestInit];
    const parsedBody = JSON.parse(String(options.body));
    expect(parsedBody.rememberMe).toBe(true);
  });

  it("shows 'Invalid credentials' error on 401 and does not navigate", async () => {
    mockFetchJson(/\/api\/v1\/auth\/login$/, 401, { statusCode: 401, message: "Invalid credentials" });

    const { user } = await setupRender();
    await fillValidForm(user);
    const signInButton = screen.getByRole("button", { name: /^sign in$/i });
    await user.click(signInButton);

    await waitFor(
      () => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
    expect(screen.queryByText(/dashboard/i)).toBeNull();
  });

  it("shows network error message when fetch fails and does not navigate", async () => {
    mockFetchNetworkError(/\/api\/v1\/auth\/login$/);

    const { user } = await setupRender();
    await fillValidForm(user);
    const signInButton = screen.getByRole("button", { name: /^sign in$/i });
    await user.click(signInButton);

    await waitFor(
      () => {
        expect(screen.getByText(/unable to connect/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
    expect(screen.queryByText(/dashboard/i)).toBeNull();
  });

  it("clears legacy stored credentials on bootstrap (FR-014)", async () => {
    window.localStorage.setItem("auth_token", "stale-token");
    window.localStorage.setItem("user_data", "{}");
    window.sessionStorage.setItem("auth_token", "stale-session-token");

    await setupRender();

    expect(window.localStorage.getItem("auth_token")).toBeNull();
    expect(window.localStorage.getItem("user_data")).toBeNull();
    expect(window.sessionStorage.getItem("auth_token")).toBeNull();
  });
});
