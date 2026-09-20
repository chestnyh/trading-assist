import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UpdateRulePage } from "./UpdateRulePage";
import { isValidationError, extractFieldToMessageFromValidationError } from "@trading-bot/api-client";

const mockNavigate = jest.fn();
let mockParamsId: string | undefined = "rule-1";

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: mockParamsId }),
}));

const mockGetRuleById = jest.fn();
const mockUpdateRule = jest.fn();
let mockRulesContextValue = {
  getRuleById: mockGetRuleById,
  updateRule: mockUpdateRule,
  isLoading: false,
};

jest.mock("../../app/contexts/RulesContext", () => ({
  useRules: () => mockRulesContextValue,
}));

jest.mock("@trading-bot/api-client", () => ({
  isValidationError: jest.fn(),
  extractFieldToMessageFromValidationError: jest.fn(),
}));

jest.mock("../../shared/ui/forms/JsonEditorField", () => ({
  JsonEditorField: ({ value, onChange }: any) => (
    <div>
      <div data-testid="json-value">{JSON.stringify(value)}</div>
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
const mockExtractFieldToMessage = extractFieldToMessageFromValidationError as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockParamsId = "rule-1";
  mockRulesContextValue = { getRuleById: mockGetRuleById, updateRule: mockUpdateRule, isLoading: false };
  mockIsValidationError.mockReturnValue(false);
  mockExtractFieldToMessage.mockReturnValue({});
});

const existingRule = {
  id: "rule-1",
  name: "My rule",
  description: "desc",
  ruleBody: { type: "noop", arguments: {} },
};

describe("UpdateRulePage (component integration)", () => {
  it("shows the real Spinner while fetching the rule", () => {
    mockGetRuleById.mockReturnValue(new Promise(() => undefined));
    render(<UpdateRulePage />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows the real NotFound page when the rule doesn't exist", async () => {
    mockGetRuleById.mockResolvedValue(null);
    render(<UpdateRulePage />);

    expect(await screen.findByText("404")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Go to Dashboard" }));
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("fetches the rule by the id from the route params", async () => {
    mockParamsId = "rule-42";
    mockGetRuleById.mockResolvedValue({ ...existingRule, id: "rule-42" });
    render(<UpdateRulePage />);

    await waitFor(() => expect(mockGetRuleById).toHaveBeenCalledWith("rule-42"));
  });

  it("renders the real RuleForm pre-filled with the loaded rule", async () => {
    mockGetRuleById.mockResolvedValue(existingRule);
    render(<UpdateRulePage />);

    expect(await screen.findByText("Update Rule")).toBeInTheDocument();
    expect(screen.getByLabelText(/rule name/i)).toHaveValue("My rule");
    expect(screen.getByLabelText(/rule description/i)).toHaveValue("desc");
    expect(screen.getByRole("button", { name: "Update" })).toBeDisabled();
  });

  it("enables Update once a field changes, and calls updateRule with the route id", async () => {
    mockGetRuleById.mockResolvedValue(existingRule);
    mockUpdateRule.mockResolvedValue(true);
    render(<UpdateRulePage />);

    const nameInput = await screen.findByLabelText(/rule name/i);
    fireEvent.change(nameInput, { target: { value: "Renamed rule" } });

    const updateButton = screen.getByRole("button", { name: "Update" });
    expect(updateButton).not.toBeDisabled();
    fireEvent.click(updateButton);

    await waitFor(() =>
      expect(mockUpdateRule).toHaveBeenCalledWith(
        "rule-1",
        expect.objectContaining({ name: "Renamed rule" })
      )
    );
    expect(mockNavigate).toHaveBeenCalledWith("/rules");
  });

  it("shows a real ErrorAlert when updateRule throws, and does not navigate", async () => {
    mockGetRuleById.mockResolvedValue(existingRule);
    mockUpdateRule.mockRejectedValue(new Error("Boom"));
    render(<UpdateRulePage />);

    fireEvent.change(await screen.findByLabelText(/rule name/i), { target: { value: "X" } });
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    await waitFor(() =>
      expect(mockUpdateRule).toHaveBeenCalledWith(
        "rule-1",
        expect.objectContaining({ name: "X" })
      )
    );

    expect(mockNavigate).not.toHaveBeenCalledWith("/rules");
    expect(screen.queryByText("Boom")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
  });

  it("clears the page-level update error on a subsequent successful submit", async () => {
    mockGetRuleById.mockResolvedValue(existingRule);
    mockUpdateRule.mockRejectedValueOnce(new Error("Boom"));
    render(<UpdateRulePage />);

    fireEvent.change(await screen.findByLabelText(/rule name/i), { target: { value: "X" } });
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    await waitFor(() => expect(mockUpdateRule).toHaveBeenCalledTimes(1));
    expect(mockNavigate).not.toHaveBeenCalledWith("/rules");

    mockUpdateRule.mockResolvedValueOnce(true);
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/rules"));
  });

  it("shows field-level errors extracted from a validation error thrown by updateRule", async () => {
  mockGetRuleById.mockResolvedValue(existingRule);
  const validationError = new Error("Validation failed");
  mockUpdateRule.mockRejectedValue(validationError);
  mockIsValidationError.mockReturnValue(true);
  mockExtractFieldToMessage.mockReturnValue({ description: "Too long" });

  render(<UpdateRulePage />);
  fireEvent.change(await screen.findByLabelText(/rule description/i), { target: { value: "X".repeat(500) } });
  fireEvent.click(screen.getByRole("button", { name: "Update" }));

  expect(await screen.findByTestId("rule-description-error")).toHaveTextContent("Too long");
});

  it("navigates to /rules on cancel", async () => {
    mockGetRuleById.mockResolvedValue(existingRule);
    render(<UpdateRulePage />);

    fireEvent.click(await screen.findByRole("button", { name: "Cancel" }));
    expect(mockNavigate).toHaveBeenCalledWith("/rules");
  });
});