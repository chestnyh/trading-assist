import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import type { ReactElement } from "react";
import "@testing-library/jest-dom";
import { AddRulePage } from "./AddRulePage";
import { RulesProvider } from "../../app/contexts/RulesContext";
import {
  isValidationError,
  extractFieldToMessageFromValidationError,
  customInstance,
  rulesControllerCreate,
} from "@trading-bot/api-client";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const mockUseAuth = jest.fn();
jest.mock("../../app/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock("@trading-bot/api-client", () => ({
  isValidationError: jest.fn(),
  extractFieldToMessageFromValidationError: jest.fn(),
  customInstance: jest.fn(),
  rulesControllerCreate: jest.fn(),
}));

jest.mock("../../shared/ui/forms/JsonEditorField", () => ({
  JsonEditorField: ({ value, onChange, error }: any) => (
    <div>
      <div data-testid="json-value">{JSON.stringify(value)}</div>
      {error && <div data-testid="json-error">{error}</div>}
      <button type="button" onClick={() => onChange({ type: "noop", arguments: {} })}>
        Simulate valid json
      </button>
    </div>
  ),
}));

const mockIsValidationError = isValidationError as unknown as jest.Mock;
const mockExtractFieldToMessage = extractFieldToMessageFromValidationError as unknown as jest.Mock;
const mockCustomInstance = customInstance as unknown as jest.Mock;
const mockRulesControllerCreate = rulesControllerCreate as unknown as jest.Mock;

const buildAuthValue = (token: string | null) => ({
  token,
  user: token ? { id: 1, email: "test@example.com", nickname: "tester" } : null,
  isAuthenticated: !!token,
  isLoading: false,
  login: jest.fn(),
  signUp: jest.fn(),
  logout: jest.fn(),
});

const renderWithProviders = (ui: ReactElement) =>
  render(<RulesProvider>{ui}</RulesProvider>);

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAuth.mockReturnValue(buildAuthValue("test-token"));
  mockIsValidationError.mockReturnValue(false);
  mockExtractFieldToMessage.mockReturnValue({});
  mockCustomInstance.mockResolvedValue({ status: 200, data: { rules: [], total: 0 } });
  mockRulesControllerCreate.mockReset();
});

const selectFirstActionType = () => {
  const actionSelect = screen.getByRole("combobox", { name: /action type/i });
  const firstRealOption = within(actionSelect)
    .getAllByRole("option")
    .find((opt) => (opt as HTMLOptionElement).value !== "") as HTMLOptionElement;
  fireEvent.change(actionSelect, { target: { value: firstRealOption.value } });
  return firstRealOption.value;
};

describe("AddRulePage (component integration, real RuleForm/ActionEditor)", () => {

  it("keeps Save disabled until the form becomes dirty", async () => {
    renderWithProviders(<AddRulePage />);
    expect(await screen.findByRole("button", { name: "Save" })).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/rule name/i), { target: { value: "My rule" } });
    expect(screen.getByRole("button", { name: "Save" })).not.toBeDisabled();
  });

  it("shows a validation error and does not call addRule while no action type is selected", async () => {
    renderWithProviders(<AddRulePage />);
    await screen.findByRole("button", { name: "Save" });

    fireEvent.change(screen.getByLabelText(/rule name/i), { target: { value: "My rule" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Rule body is required")).toBeInTheDocument();
    expect(mockRulesControllerCreate).not.toHaveBeenCalled();
  });

  it("builds a rule body via the real ActionEditor and submits it", async () => {
    mockRulesControllerCreate.mockResolvedValue({ status: 201, data: {} });
    renderWithProviders(<AddRulePage />);
    await screen.findByRole("button", { name: "Save" });

    fireEvent.change(screen.getByLabelText(/rule name/i), { target: { value: "My rule" } });
    fireEvent.change(screen.getByLabelText(/rule description/i), { target: { value: "Desc" } });
    selectFirstActionType();

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(mockRulesControllerCreate).toHaveBeenCalledWith(
        expect.objectContaining({ name: "My rule", description: "Desc" })
      )
    );
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/rules"));
  });

  it("switches to JSON mode and renders the mocked json editor", async () => {
    renderWithProviders(<AddRulePage />);
    await screen.findByRole("button", { name: "Save" });

    fireEvent.click(screen.getByRole("button", { name: "JSON" }));

    expect(screen.queryByRole("combobox", { name: /action type/i })).not.toBeInTheDocument();
    expect(screen.getByTestId("json-value")).toBeInTheDocument();
  });

  it("does not navigate when there is no auth token", async () => {
    mockUseAuth.mockReturnValue(buildAuthValue(null));
    renderWithProviders(<AddRulePage />);

    fireEvent.change(screen.getByLabelText(/rule name/i), { target: { value: "My rule" } });
    selectFirstActionType();
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
    expect(mockRulesControllerCreate).not.toHaveBeenCalled();
  });

  it("shows field-level errors from a validation error thrown by addRule", async () => {
    const validationError = new Error("Validation failed");
    mockRulesControllerCreate.mockRejectedValue(validationError);
    mockIsValidationError.mockReturnValue(true);
    mockExtractFieldToMessage.mockReturnValue({ name: "Name already exists" });

    renderWithProviders(<AddRulePage />);
    await screen.findByRole("button", { name: "Save" });
    fireEvent.change(screen.getByLabelText(/rule name/i), { target: { value: "Dup" } });
    selectFirstActionType();
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Name already exists")).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("shows a generic form error when addRule throws a non-validation error", async () => {
    mockRulesControllerCreate.mockRejectedValue(new Error("Server exploded"));
    mockIsValidationError.mockReturnValue(false);

    renderWithProviders(<AddRulePage />);
    await screen.findByRole("button", { name: "Save" });
    fireEvent.change(screen.getByLabelText(/rule name/i), { target: { value: "X" } });
    selectFirstActionType();
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Server exploded")).toBeInTheDocument();
  });

  it("navigates to /rules on cancel", async () => {
    renderWithProviders(<AddRulePage />);
    await screen.findByRole("button", { name: "Save" });

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockNavigate).toHaveBeenCalledWith("/rules");
  });

  it("shows 'Processing...' and disables buttons while isLoading", async () => {
    renderWithProviders(<AddRulePage />);
    await screen.findByRole("button", { name: "Save" });

    let resolveCreate!: (value: unknown) => void;
    mockRulesControllerCreate.mockReturnValue(
      new Promise((resolve) => { resolveCreate = resolve; })
    );

    fireEvent.change(screen.getByLabelText(/rule name/i), { target: { value: "My rule" } });
    selectFirstActionType();
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByRole("button", { name: "Processing..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();

    resolveCreate({ status: 201, data: {} });
  });
});
