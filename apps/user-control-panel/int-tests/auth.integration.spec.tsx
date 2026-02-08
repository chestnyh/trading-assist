import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "../src/app/contexts/AuthContext";
import { SignIn } from "../src/features/signIn/SignIn";

jest.mock("../src/app/contexts/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockUseAuth = useAuth as unknown as jest.Mock;

const setupRender = () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter
      initialEntries={["/auth/sign-in"]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <SignIn />
    </MemoryRouter>
  );
  return { user };
};

const fillValidForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/email/i), "test@example.com");
  await user.type(screen.getByPlaceholderText(/enter your password/i), "Password123*");
};

describe("Authorization Flow (Integration)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      login: jest.fn(),
      isAuthenticated: false,
      isLoading: false,
      user: null,
      logout: jest.fn(),
      signUp: jest.fn(),
      token: null,
    });
  });

  it("shows email validation error for invalid email and does not call API", async () => {
    const { user } = setupRender();
    await user.type(screen.getByLabelText(/email/i), "invalid-email");
    await user.type(screen.getByPlaceholderText(/enter your password/i), "Password123*");
    const signInButton = screen.getByRole("button", { name: /^sign in$/i });
    await user.click(signInButton);

    await waitFor(() => {
      expect(screen.queryByText(/please provide a valid email address/i)).not.toBeNull();
    });
    expect(mockUseAuth().login).not.toHaveBeenCalled();
  });

  it("shows password validation error for short password and does not call API", async () => {
    const { user } = setupRender();
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByPlaceholderText(/enter your password/i), "short");
    const signInButton = screen.getByRole("button", { name: /^sign in$/i });
    await user.click(signInButton);

    await waitFor(() => {
      expect(screen.queryByText(/password must be at least 8 characters long/i)).not.toBeNull();
    });
    expect(mockUseAuth().login).not.toHaveBeenCalled();
  });

  it("calls API with correct payload and navigates on success", async () => {
    const login = jest.fn().mockResolvedValue({ success: true });
    mockUseAuth.mockReturnValue({
      ...mockUseAuth.mock.results[0]?.value,
      login,
      isAuthenticated: false,
      isLoading: false,
    });

    const { user } = setupRender();
    await fillValidForm(user);
    const signInButton = screen.getByRole("button", { name: /^sign in$/i });
    await user.click(signInButton);

    await waitFor(() => expect(login).toHaveBeenCalled());
    expect(login).toHaveBeenCalledWith("test@example.com", "Password123*", false);
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/dashboard"));
  });

  it("includes rememberMe in payload when checkbox checked", async () => {
    const login = jest.fn().mockResolvedValue({ success: true });
    mockUseAuth.mockReturnValue({
      ...mockUseAuth.mock.results[0]?.value,
      login,
      isAuthenticated: false,
      isLoading: false,
    });

    const { user } = setupRender();
    await fillValidForm(user);
    const rememberMeCheckbox = screen.getByLabelText(/remember me/i);
    await user.click(rememberMeCheckbox);
    const signInButton = screen.getByRole("button", { name: /^sign in$/i });
    await user.click(signInButton);

    await waitFor(() => expect(login).toHaveBeenCalled());
    expect(login).toHaveBeenCalledWith("test@example.com", "Password123*", true);
  });

  it("shows 'Invalid credentials' error on 401 and does not navigate", async () => {
    const login = jest.fn().mockResolvedValue({ success: false, error: "Invalid credentials" });
    mockUseAuth.mockReturnValue({
      ...mockUseAuth.mock.results[0]?.value,
      login,
      isAuthenticated: false,
      isLoading: false,
    });

    const { user } = setupRender();
    await fillValidForm(user);
    const signInButton = screen.getByRole("button", { name: /^sign in$/i });
    await user.click(signInButton);

    await waitFor(() => {
      expect(screen.queryByText(/invalid credentials/i)).not.toBeNull();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("shows network error message when fetch fails and does not navigate", async () => {
    const login = jest.fn().mockResolvedValue({
      success: false,
      error:
        "Unable to connect to the server. Please check your internet connection and ensure the server is running.",
    });
    mockUseAuth.mockReturnValue({
      ...mockUseAuth.mock.results[0]?.value,
      login,
      isAuthenticated: false,
      isLoading: false,
    });

    const { user } = setupRender();
    await fillValidForm(user);
    const signInButton = screen.getByRole("button", { name: /^sign in$/i });
    await user.click(signInButton);

    await waitFor(() => {
      expect(
        screen.queryByText(/unable to connect to the server/i)
      ).not.toBeNull();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
