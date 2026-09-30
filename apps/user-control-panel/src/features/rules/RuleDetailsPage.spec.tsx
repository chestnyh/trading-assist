import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RuleDetailsPage } from "./RuleDetailsPage";

const mockNavigate = jest.fn();
let mockParamsId: string | undefined = "rule-1";

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: mockParamsId }),
}));

const mockGetRuleById = jest.fn();
jest.mock("../../app/contexts/RulesContext", () => ({
  useRules: () => ({ getRuleById: mockGetRuleById }),
}));

jest.mock("../../app/contexts/AuthContext", () => ({
  useAuth: () => ({ token: "test-token" }),
}));

const mockUseRuleLogs = jest.fn();
jest.mock("./hooks/useRuleLogs", () => ({
  useRuleLogs: (...args: any[]) => mockUseRuleLogs(...args),
}));

jest.mock("./components/action-editor", () => ({
  ActionEditor: ({ action }: any) => <div data-testid="action-editor">{action?.type}</div>,
  parseRuleBodyToActionTree: jest.fn((body: any) => (body ? { type: "root" } : null)),
}));

jest.mock("../../shared/ui/forms/JsonEditorField", () => ({
  JsonEditorField: ({ value }: any) => <div data-testid="json-view">{JSON.stringify(value)}</div>,
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockParamsId = "rule-1";
  mockUseRuleLogs.mockReturnValue({
    logs: [],
    isConnected: true,
    isReconnecting: false,
    error: null,
  });
});

const existingRule = {
  id: "rule-1",
  name: "My rule",
  description: "Some description",
  ruleBody: { type: "action" },
};

describe("RuleDetailsPage (component integration)", () => {
  it("shows the real Spinner while loading", () => {
    mockGetRuleById.mockReturnValue(new Promise(() => undefined));
    render(<RuleDetailsPage />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows the real NotFound page when the rule is missing", async () => {
    mockGetRuleById.mockResolvedValue(null);
    render(<RuleDetailsPage />);

    expect(await screen.findByText("404")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Go to Dashboard" }));
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("fetches the rule by the id from the route params", async () => {
    mockParamsId = "rule-7";
    mockGetRuleById.mockResolvedValue({ ...existingRule, id: "rule-7" });
    render(<RuleDetailsPage />);

    await waitFor(() => expect(mockGetRuleById).toHaveBeenCalledWith("rule-7"));
  });

  it("passes ruleId and token through to useRuleLogs", async () => {
    mockParamsId = "rule-7";
    mockGetRuleById.mockResolvedValue({ ...existingRule, id: "rule-7" });
    render(<RuleDetailsPage />);

    await screen.findByText(existingRule.name);
    expect(mockUseRuleLogs).toHaveBeenCalledWith({ ruleId: "rule-7", token: "test-token" });
  });

  it("renders rule name, description, structured view and JSON view once loaded", async () => {
    mockGetRuleById.mockResolvedValue(existingRule);
    render(<RuleDetailsPage />);

    expect(await screen.findByText("My rule")).toBeInTheDocument();
    expect(screen.getByText("Some description")).toBeInTheDocument();
    expect(screen.getByText("Structured View:")).toBeInTheDocument();
    expect(screen.getByTestId("action-editor")).toBeInTheDocument();
    expect(screen.getByTestId("json-view")).toBeInTheDocument();
  });

  it("falls back to a placeholder when the rule has no description", async () => {
    mockGetRuleById.mockResolvedValue({ ...existingRule, description: "" });
    render(<RuleDetailsPage />);

    expect(await screen.findByText("No description provided.")).toBeInTheDocument();
  });

  it("skips the structured view when the rule body can't be parsed to an action tree", async () => {
    mockGetRuleById.mockResolvedValue({ ...existingRule, ruleBody: null });
    render(<RuleDetailsPage />);

    await screen.findByText("My rule");
    expect(screen.queryByText("Structured View:")).not.toBeInTheDocument();
    expect(screen.getByTestId("json-view")).toBeInTheDocument();
  });

  it("renders the real LogsPanel reflecting a live connection", async () => {
    mockGetRuleById.mockResolvedValue(existingRule);
    render(<RuleDetailsPage />);

    await screen.findByText("My rule");
    expect(screen.getByText("Execution Logs:")).toBeInTheDocument();
    expect(screen.getByText("Live")).toBeInTheDocument();
    expect(screen.getByText("(0 entries)")).toBeInTheDocument();
  });

  it("renders real logs coming from useRuleLogs inside the real LogsPanel", async () => {
    mockGetRuleById.mockResolvedValue(existingRule);
    mockUseRuleLogs.mockReturnValue({
      logs: [
        {
          ruleId: 1,
          userId: 1,
          runId: "run-123456789",
          timestamp: "2026-01-01T12:00:00.123Z",
          level: "warn",
          type: "text",
          message: "Something happened",
        },
      ],
      isConnected: true,
      isReconnecting: false,
      error: null,
    });

    render(<RuleDetailsPage />);

    await screen.findByText("My rule");
    expect(screen.getByText("(1 entries)")).toBeInTheDocument();
    expect(screen.getByText("Something happened")).toBeInTheDocument();
    expect(screen.getByText("[WARN]")).toBeInTheDocument();
  });

  it("shows the real LogsPanel disconnected/error state", async () => {
    mockGetRuleById.mockResolvedValue(existingRule);
    mockUseRuleLogs.mockReturnValue({
      logs: [],
      isConnected: false,
      isReconnecting: false,
      error: new Error("Connection lost"),
    });

    render(<RuleDetailsPage />);

    await screen.findByText("My rule");
    expect(screen.getByText("Disconnected")).toBeInTheDocument();
    expect(screen.getByText("Connection lost")).toBeInTheDocument();
  });

  it("navigates back to /rules when the Back button is clicked", async () => {
    mockGetRuleById.mockResolvedValue(existingRule);
    render(<RuleDetailsPage />);

    fireEvent.click(await screen.findByText("Back"));
    expect(mockNavigate).toHaveBeenCalledWith("/rules");
  });
});