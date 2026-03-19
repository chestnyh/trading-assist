import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "../src/test/setupTests";
import userEvent from "@testing-library/user-event";
import App from "../src/app/app";

const mockFetchJsonOnce = (status: number, data: unknown) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ "content-type": "application/json" }),
    json: async () => data,
  } as unknown as Response);
};

const setupRender = async () => {
  const user = userEvent.setup();
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
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({}),
    } as unknown as Response);
    // Ensure unauthenticated state
    try {
      window.localStorage.clear();
      window.sessionStorage.clear();
    } catch {}
  });

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
    expect(global.fetch).not.toHaveBeenCalled();
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
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("logs in successfully and navigates to Dashboard", async () => {
    mockFetchJsonOnce(201, {
      access_token: "test-token",
      user: { id: 1, email: "test@example.com", nickname: "tester" },
    });

    const { user } = await setupRender();
    await fillValidForm(user);
    const signInButton = screen.getByRole("button", { name: /^sign in$/i });
    await user.click(signInButton);

    await waitFor(() => {
      expect(screen.getAllByText(/dashboard/i).length).toBeGreaterThan(0);
    });

    const loginCall = (global.fetch as jest.Mock).mock.calls.find(([url]) =>
      String(url).match(/\/api\/v1\/auth\/login$/)
    );
    expect(loginCall).toBeTruthy();
    const [url, options] = loginCall as unknown as [string, RequestInit];
    expect(String(url)).toMatch(/\/api\/v1\/auth\/login$/);
    expect(options.method).toBe("POST");
    const parsedBody = JSON.parse(String(options.body));
    expect(parsedBody.rememberMe).toBeUndefined();
  });

  it("includes rememberMe when checkbox checked", async () => {
    mockFetchJsonOnce(201, {
      access_token: "test-token",
      user: { id: 1, email: "test@example.com", nickname: "tester" },
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

    const loginCall = (global.fetch as jest.Mock).mock.calls.find(([url]) =>
      String(url).match(/\/api\/v1\/auth\/login$/)
    );
    expect(loginCall).toBeTruthy();
    const [, options] = loginCall as unknown as [string, RequestInit];
    const parsedBody = JSON.parse(String(options.body));
    expect(parsedBody.rememberMe).toBe(true);
  });

  it("shows 'Invalid credentials' error on 401 and does not navigate", async () => {
    mockFetchJsonOnce(401, { statusCode: 401, message: "Invalid credentials" });

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
    (global.fetch as jest.Mock).mockRejectedValueOnce(new TypeError("Failed to fetch"));

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
});
