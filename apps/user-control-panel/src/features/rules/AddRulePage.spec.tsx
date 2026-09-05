import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AddRulePage } from "./AddRulePage";
import { isValidationError, extractFieldToMessageFromValidationError } from "@trading-bot/api-client";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const mockAddRule = jest.fn();
let mockRulesContextValue = { addRule: mockAddRule, isLoading: false };
jest.mock("../../app/contexts/RulesContext", () => ({
  useRules: () => mockRulesContextValue,
}));

jest.mock("@trading-bot/api-client", () => ({
  isValidationError: jest.fn(),
  extractFieldToMessageFromValidationError: jest.fn(),
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

jest.mock("../../shared/ui/forms/Input", () => ({
  Input: ({ label, id, value, onChange, error, required }: any) => (
    <div>
      <label htmlFor={id}>{label}{required ? " *" : ""}</label>
      <input id={id} value={value} onChange={onChange} />
      {error && <span data-testid={`${id}-error`}>{error}</span>}
    </div>
  ),
}));

jest.mock("../../shared/ui/forms/TextArea", () => ({
  TextArea: ({ label, id, value, onChange, error, required }: any) => (
    <div>
      <label htmlFor={id}>{label}{required ? " *" : ""}</label>
      <textarea id={id} value={value} onChange={onChange} />
      {error && <span data-testid={`${id}-error`}>{error}</span>}
    </div>
  ),
}));

const mockIsValidationError = isValidationError as unknown as jest.Mock;
const mockExtractFieldToMessage = extractFieldToMessageFromValidationError as unknown as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockRulesContextValue = { addRule: mockAddRule, isLoading: false };
  mockIsValidationError.mockReturnValue(false);
  mockExtractFieldToMessage.mockReturnValue({});
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

  it("keeps Save disabled until the form becomes dirty", () => {
    render(<AddRulePage />);
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/rule name/i), { target: { value: "My rule" } });
    expect(screen.getByRole("button", { name: "Save" })).not.toBeDisabled();
  });

  it("shows a validation error and does not call addRule while no action type is selected", async () => {
    render(<AddRulePage />);

    fireEvent.change(screen.getByLabelText(/rule name/i), { target: { value: "My rule" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Rule body is required")).toBeInTheDocument();
    expect(mockAddRule).not.toHaveBeenCalled();
  });

  it("builds a rule body via the real ActionEditor and submits it", async () => {
    mockAddRule.mockResolvedValue(true);
    render(<AddRulePage />);

    fireEvent.change(screen.getByLabelText(/rule name/i), { target: { value: "My rule" } });
    fireEvent.change(screen.getByLabelText(/rule description/i), { target: { value: "Desc" } });
    selectFirstActionType();

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() =>
      expect(mockAddRule).toHaveBeenCalledWith(
        expect.objectContaining({ name: "My rule", description: "Desc" })
      )
    );
    expect(mockNavigate).toHaveBeenCalledWith("/rules");
  });

  it("switches to JSON mode and renders the mocked json editor", () => {
    render(<AddRulePage />);

    fireEvent.click(screen.getByRole("button", { name: "JSON" }));

    expect(screen.queryByRole("combobox", { name: /action type/i })).not.toBeInTheDocument();
    expect(screen.getByTestId("json-value")).toBeInTheDocument();
  });

  it("does not navigate when addRule resolves false", async () => {
    mockAddRule.mockResolvedValue(false);
    render(<AddRulePage />);

    fireEvent.change(screen.getByLabelText(/rule name/i), { target: { value: "My rule" } });
    selectFirstActionType();
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(mockAddRule).toHaveBeenCalled());
    expect(mockNavigate).not.toHaveBeenCalled();
  });
  

  it("shows field-level errors from a validation error thrown by addRule", async () => {
    const validationError = new Error("Validation failed");
    mockAddRule.mockRejectedValue(validationError);
    mockIsValidationError.mockReturnValue(true);
    mockExtractFieldToMessage.mockReturnValue({ name: "Name already exists" });

    render(<AddRulePage />);
    fireEvent.change(screen.getByLabelText(/rule name/i), { target: { value: "Dup" } });
    selectFirstActionType();
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByTestId("rule-name-error")).toHaveTextContent("Name already exists");
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("shows a generic form error when addRule throws a non-validation error", async () => {
    mockAddRule.mockRejectedValue(new Error("Server exploded"));
    mockIsValidationError.mockReturnValue(false);

    render(<AddRulePage />);
    fireEvent.change(screen.getByLabelText(/rule name/i), { target: { value: "X" } });
    selectFirstActionType();
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Server exploded")).toBeInTheDocument();
  });

  it("navigates to /rules on cancel", () => {
    render(<AddRulePage />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockNavigate).toHaveBeenCalledWith("/rules");
  });

  it("shows 'Processing...' and disables buttons while isLoading", () => {
    mockRulesContextValue = { addRule: mockAddRule, isLoading: true };
    render(<AddRulePage />);

    expect(screen.getByRole("button", { name: "Processing..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  });
});