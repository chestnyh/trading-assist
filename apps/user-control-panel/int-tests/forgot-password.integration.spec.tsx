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

  const forgotPasswordButton = await screen.findByRole("button", { name: /forgot password\?/i });
  await user.click(forgotPasswordButton);

  await screen.findByText(/insert your email/i);
  await screen.findByPlaceholderText(/enter your email/i);

  return { user };
};

describe("Forgot / Restore Password Flow (Integration)", () => {
  let fetchRules: FetchMockRule[];
  const resetToken = "123e4567-e89b-12d3-a456-426614174000";

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
    } catch (e) {
      void e;
    }
  });

  const mockFetchJson = (pattern: RegExp, status: number, data: unknown) => {
    fetchRules.unshift({ pattern, response: { status, data } });
  };

  it("navigates to restore password page from Sign In", async () => {
    await setupRender();
    expect(screen.getByText(/insert your email/i)).toBeInTheDocument();
  });

  it("shows validation error when email is invalid and does not call API", async () => {
    const { user } = await setupRender();

    await user.type(screen.getByPlaceholderText(/enter your email/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /send me code on email/i }));

    await waitFor(() => {
      expect(screen.queryByText(/valid email address/i)).not.toBeNull();
    });

    expect(findFetchCall(/\/api\/v1\/auth\/forgot-password$/)).toBeUndefined();
  });

  it("requests password reset code successfully, stores token, and navigates to step 2", async () => {
    mockFetchJson(/\/api\/v1\/auth\/forgot-password$/, 200, {
      token: resetToken,
      message: "Password reset code sent to your email",
    });

    const { user } = await setupRender();

    await user.type(screen.getByPlaceholderText(/enter your email/i), "test@example.com");
    await user.click(screen.getByRole("button", { name: /send me code on email/i }));

    await screen.findByText(/insert code/i);

    expect(window.localStorage.getItem("password_reset_token")).toBe(resetToken);

    const call = findFetchCall(/\/api\/v1\/auth\/forgot-password$/);
    expect(call).toBeTruthy();

    const [, options] = call as unknown as [string, RequestInit];
    const body = JSON.parse(String(options.body));
    expect(body).toEqual({ email: "test@example.com" });
  });

  it("shows network error when forgot-password request fails with network error", async () => {
    const { user } = await setupRender();

    (global.fetch as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Failed to fetch");
    });

    await user.type(screen.getByPlaceholderText(/enter your email/i), "test@example.com");
    await user.click(screen.getByRole("button", { name: /send me code on email/i }));

    await waitFor(() => {
      expect(
        screen.queryByText(/failed to connect to the server|unable to connect|make sure the backend is running/i)
      ).not.toBeNull();
    });
  });

  it("shows step 2 error when token is missing and does not call verify endpoint", async () => {
    mockFetchJson(/\/api\/v1\/auth\/forgot-password$/, 200, {
      token: resetToken,
      message: "Password reset code sent to your email",
    });

    const { user } = await setupRender();

    await user.type(screen.getByPlaceholderText(/enter your email/i), "test@example.com");
    await user.click(screen.getByRole("button", { name: /send me code on email/i }));

    await screen.findByText(/insert code/i);

    window.localStorage.removeItem("password_reset_token");

    await user.type(screen.getByLabelText(/secret code/i), "123456");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.queryByText(/invalid or expired token/i)).not.toBeNull();
    });

    expect(findFetchCall(/\/api\/v1\/auth\/verify-password-reset$/)).toBeUndefined();
  });

  it("verifies code successfully and navigates to step 3", async () => {
    mockFetchJson(/\/api\/v1\/auth\/forgot-password$/, 200, {
      token: resetToken,
      message: "Password reset code sent to your email",
    });
    mockFetchJson(/\/api\/v1\/auth\/verify-password-reset$/, 200, {
      message: "Code verified successfully",
    });

    const { user } = await setupRender();

    await user.type(screen.getByPlaceholderText(/enter your email/i), "test@example.com");
    await user.click(screen.getByRole("button", { name: /send me code on email/i }));

    await screen.findByText(/insert code/i);

    await user.type(screen.getByLabelText(/secret code/i), "123456");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await screen.findByText(/enter new password/i);

    const call = findFetchCall(/\/api\/v1\/auth\/verify-password-reset$/);
    expect(call).toBeTruthy();

    const [, options] = call as unknown as [string, RequestInit];
    const body = JSON.parse(String(options.body));
    expect(body).toEqual({ code: "123456", token: resetToken });
  });

  it("shows error on invalid code (401) and invalidates session", async () => {
    mockFetchJson(/\/api\/v1\/auth\/forgot-password$/, 200, {
      token: resetToken,
      message: "Password reset code sent to your email",
    });
    mockFetchJson(/\/api\/v1\/auth\/verify-password-reset$/, 401, {
      statusCode: 401,
      message: "Unauthorized",
    });

    const { user } = await setupRender();

    await user.type(screen.getByPlaceholderText(/enter your email/i), "test@example.com");
    await user.click(screen.getByRole("button", { name: /send me code on email/i }));

    await screen.findByText(/insert code/i);

    await user.type(screen.getByLabelText(/secret code/i), "123456");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.queryByText(/session invalid or expired/i)).not.toBeNull();
    });

    expect(window.localStorage.getItem("password_reset_token")).toBeNull();
  });

  it("shows max attempts exceeded (429) and switches to 'Request New Code'", async () => {
    mockFetchJson(/\/api\/v1\/auth\/forgot-password$/, 200, {
      token: resetToken,
      message: "Password reset code sent to your email",
    });
    mockFetchJson(/\/api\/v1\/auth\/verify-password-reset$/, 429, {
      statusCode: 429,
      message: "Maximum attempts exceeded. This session has been invalidated.",
    });

    const { user } = await setupRender();

    await user.type(screen.getByPlaceholderText(/enter your email/i), "test@example.com");
    await user.click(screen.getByRole("button", { name: /send me code on email/i }));

    await screen.findByText(/insert code/i);

    await user.type(screen.getByLabelText(/secret code/i), "123456");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.queryByText(/maximum attempts exceeded|too many requests/i)).not.toBeNull();
    });

    expect(await screen.findByRole("button", { name: /request new code/i })).toBeInTheDocument();
    expect(window.localStorage.getItem("password_reset_token")).toBeNull();
  });

  it("resets password successfully and navigates to sign-in", async () => {
    mockFetchJson(/\/api\/v1\/auth\/forgot-password$/, 200, {
      token: resetToken,
      message: "Password reset code sent to your email",
    });
    mockFetchJson(/\/api\/v1\/auth\/verify-password-reset$/, 200, {
      message: "Code verified successfully",
    });
    mockFetchJson(/\/api\/v1\/auth\/reset-password$/, 200, {
      message: "Password has been reset successfully",
    });

    const { user } = await setupRender();

    await user.type(screen.getByPlaceholderText(/enter your email/i), "test@example.com");
    await user.click(screen.getByRole("button", { name: /send me code on email/i }));

    await screen.findByText(/insert code/i);

    await user.type(screen.getByLabelText(/secret code/i), "123456");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await screen.findByText(/enter new password/i);

    await user.type(screen.getByPlaceholderText(/enter new password/i), "NewPassword123*");
    await user.type(screen.getByPlaceholderText(/confirm new password/i), "NewPassword123*");
    await user.click(screen.getByRole("button", { name: /set up new password/i }));

    await waitFor(() => {
      expect(window.localStorage.getItem("password_reset_token")).toBeNull();
    });

    await screen.findByText(/sign in into your account/i);

    const call = findFetchCall(/\/api\/v1\/auth\/reset-password$/);
    expect(call).toBeTruthy();

    const [, options] = call as unknown as [string, RequestInit];
    const body = JSON.parse(String(options.body));
    expect(body).toEqual({
      token: resetToken,
      password: "NewPassword123*",
    });
  });

  it("shows error when passwords do not match and does not call reset endpoint", async () => {
    mockFetchJson(/\/api\/v1\/auth\/forgot-password$/, 200, {
      token: resetToken,
      message: "Password reset code sent to your email",
    });
    mockFetchJson(/\/api\/v1\/auth\/verify-password-reset$/, 200, {
      message: "Code verified successfully",
    });

    const { user } = await setupRender();

    await user.type(screen.getByPlaceholderText(/enter your email/i), "test@example.com");
    await user.click(screen.getByRole("button", { name: /send me code on email/i }));

    await screen.findByText(/insert code/i);

    await user.type(screen.getByLabelText(/secret code/i), "123456");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await screen.findByText(/enter new password/i);

    await user.type(screen.getByPlaceholderText(/enter new password/i), "NewPassword123*");
    await user.type(screen.getByPlaceholderText(/confirm new password/i), "DifferentPassword123*");

    await user.click(screen.getByRole("button", { name: /set up new password/i }));

    await waitFor(() => {
      expect(screen.queryByText(/passwords do not match/i)).not.toBeNull();
    });

    expect(findFetchCall(/\/api\/v1\/auth\/reset-password$/)).toBeUndefined();
  });

  it("shows validation error for password and does not call reset endpoint", async () => {
    mockFetchJson(/\/api\/v1\/auth\/forgot-password$/, 200, {
      token: resetToken,
      message: "Password reset code sent to your email",
    });
    mockFetchJson(/\/api\/v1\/auth\/verify-password-reset$/, 200, {
      message: "Code verified successfully",
    });

    const { user } = await setupRender();

    await user.type(screen.getByPlaceholderText(/enter your email/i), "test@example.com");
    await user.click(screen.getByRole("button", { name: /send me code on email/i }));

    await screen.findByText(/insert code/i);

    await user.type(screen.getByLabelText(/secret code/i), "123456");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await screen.findByText(/enter new password/i);

    await user.type(screen.getByPlaceholderText(/enter new password/i), "short");
    await user.type(screen.getByPlaceholderText(/confirm new password/i), "short");

    await user.click(screen.getByRole("button", { name: /set up new password/i }));

    await waitFor(() => {
      expect(screen.queryByText(/password must be at least/i)).not.toBeNull();
    });

    expect(findFetchCall(/\/api\/v1\/auth\/reset-password$/)).toBeUndefined();
  });
});
