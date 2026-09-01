
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import { RulesPage } from "./RulesPage";
import { AddRulePage } from "./AddRulePage";
import { UpdateRulePage } from "./UpdateRulePage";
import { RuleDetailsPage } from "./RuleDetailsPage";
import { EmptyState } from "./EmptyState";

const mockNavigate = jest.fn();
const mockSetSearchParams = jest.fn();
let mockSearchParams = new URLSearchParams();
let mockParamsId: string | undefined = "rule-1";

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: mockParamsId }),
  useSearchParams: () => [mockSearchParams, mockSetSearchParams],
}));

const mockFetchRules = jest.fn();
const mockDeleteRule = jest.fn();
const mockAddRule = jest.fn();
const mockUpdateRule = jest.fn();
const mockGetRuleById = jest.fn();

const baseRulesContext = {
  rules: [] as any[],
  isLoading: false,
  fetchRules: mockFetchRules,
  totalCount: 0,
  error: null as string | null,
  deleteRule: mockDeleteRule,
  addRule: mockAddRule,
  updateRule: mockUpdateRule,
  getRuleById: mockGetRuleById,
};

let mockRulesContextValue = { ...baseRulesContext };

jest.mock("../../app/contexts/RulesContext", () => ({
  useRules: () => mockRulesContextValue,
}));

jest.mock("../../app/contexts/AuthContext", () => ({
  useAuth: () => ({ token: "test-token" }),
}));

jest.mock("../../app/components/RuleForm", () => ({
  RuleForm: (props: any) => (
    <div data-testid="rule-form">
      <span>{props.title}</span>
      <button onClick={() => props.onSubmit({ name: "Test", description: "d", ruleBody: {} })}>
        submit
      </button>
      <button onClick={props.onCancel}>cancel</button>
    </div>
  ),
}));

jest.mock("../../app/components/RuleItem", () => ({
  RuleItem: ({ rule, onDelete }: any) => (
    <div data-testid="rule-item">
      <span>{rule.name}</span>
      <button onClick={onDelete}>delete-{rule.id}</button>
    </div>
  ),
}));

jest.mock("../../app/components/Pagination", () => ({
  Pagination: ({ onChange, current }: any) => (
    <div data-testid="pagination">
      <span>page-{current}</span>
      <button onClick={() => onChange(current + 1)}>next</button>
    </div>
  ),
}));

jest.mock("../../shared/ui/modals/ConfirmationModal", () => ({
  ConfirmationModal: ({ isOpen, onConfirm, onClose }: any) =>
    isOpen ? (
      <div data-testid="confirm-modal">
        <button onClick={onConfirm}>confirm</button>
        <button onClick={onClose}>close</button>
      </div>
    ) : null,
}));

jest.mock("../../shared/ui/feedback/ErrorAlert", () => ({
  ErrorAlert: ({ message }: any) => <div data-testid="error-alert">{message}</div>,
}));

jest.mock("../../shared/ui/spiner/Spinner", () => ({
  Spinner: () => <div data-testid="spinner">loading...</div>,
}));

jest.mock("../notFound/NotFound", () => ({
  NotFound: () => <div data-testid="not-found">Not found</div>,
}));

jest.mock("../../shared/ui/forms/JsonEditorField", () => ({
  JsonEditorField: () => <div data-testid="json-editor" />,
}));

jest.mock("./components/LogsPanel", () => ({
  LogsPanel: () => <div data-testid="logs-panel" />,
}));

jest.mock("./components/action-editor", () => ({
  ActionEditor: () => <div data-testid="action-editor" />,
  parseRuleBodyToActionTree: jest.fn(() => ({ type: "root" })),
}));

jest.mock("./hooks/useRuleLogs", () => ({
  useRuleLogs: () => ({
    logs: [],
    isConnected: true,
    isReconnecting: false,
    error: null,
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockRulesContextValue = { ...baseRulesContext };
  mockSearchParams = new URLSearchParams();
  mockParamsId = "rule-1";
});

describe("EmptyState", () => {
  it("renders the empty message and navigates to /rules/add on click", () => {
    render(<EmptyState />);
    expect(screen.getByText(/don't have rules yet/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button"));
    expect(mockNavigate).toHaveBeenCalledWith("/rules/add");
  });
});

describe("AddRulePage", () => {
  it("renders the form with the correct title", () => {
    render(<AddRulePage />);
    expect(screen.getByText("Adding Rule")).toBeInTheDocument();
  });

  it("calls addRule and navigates to /rules on success", async () => {
    mockAddRule.mockResolvedValue(true);
    render(<AddRulePage />);

    fireEvent.click(screen.getByText("submit"));

    await waitFor(() => expect(mockAddRule).toHaveBeenCalledWith({
      name: "Test",
      description: "d",
      ruleBody: {},
    }));
    expect(mockNavigate).toHaveBeenCalledWith("/rules");
  });

  it("does not navigate when addRule resolves false", async () => {
    mockAddRule.mockResolvedValue(false);
    render(<AddRulePage />);

    fireEvent.click(screen.getByText("submit"));

    await waitFor(() => expect(mockAddRule).toHaveBeenCalled());
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("navigates to /rules on cancel", () => {
    render(<AddRulePage />);
    fireEvent.click(screen.getByText("cancel"));
    expect(mockNavigate).toHaveBeenCalledWith("/rules");
  });
});

describe("UpdateRulePage", () => {
  it("shows a spinner while fetching the rule", () => {
    mockGetRuleById.mockReturnValue(new Promise(() => {})); 
    render(<UpdateRulePage />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("shows NotFound when the rule doesn't exist", async () => {
    mockGetRuleById.mockResolvedValue(null);
    render(<UpdateRulePage />);
    expect(await screen.findByTestId("not-found")).toBeInTheDocument();
  });

  it("renders the form with initial data once loaded", async () => {
    mockGetRuleById.mockResolvedValue({
      id: "rule-1",
      name: "My rule",
      description: "desc",
      ruleBody: {},
    });
    render(<UpdateRulePage />);
    expect(await screen.findByText("Update Rule")).toBeInTheDocument();
  });

  it("calls updateRule and navigates on success", async () => {
    mockGetRuleById.mockResolvedValue({
      id: "rule-1",
      name: "My rule",
      description: "desc",
      ruleBody: {},
    });
    mockUpdateRule.mockResolvedValue(true);

    render(<UpdateRulePage />);
    fireEvent.click(await screen.findByText("submit"));

    await waitFor(() => expect(mockUpdateRule).toHaveBeenCalledWith("rule-1", {
      name: "Test",
      description: "d",
      ruleBody: {},
    }));
    expect(mockNavigate).toHaveBeenCalledWith("/rules");
  });

  it("shows an error alert when updateRule throws", async () => {
    mockGetRuleById.mockResolvedValue({
      id: "rule-1",
      name: "My rule",
      description: "desc",
      ruleBody: {},
    });
    mockUpdateRule.mockRejectedValue(new Error("Boom"));

    render(<UpdateRulePage />);
    fireEvent.click(await screen.findByText("submit"));

    expect(await screen.findByTestId("error-alert")).toHaveTextContent("Boom");
    expect(mockNavigate).not.toHaveBeenCalledWith("/rules");
  });
});

describe("RuleDetailsPage", () => {
  it("shows a spinner while loading", () => {
    mockGetRuleById.mockReturnValue(new Promise(() => {}));
    render(<RuleDetailsPage />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("shows NotFound when the rule is missing", async () => {
    mockGetRuleById.mockResolvedValue(null);
    render(<RuleDetailsPage />);
    expect(await screen.findByTestId("not-found")).toBeInTheDocument();
  });

  it("renders rule name, description and panels once loaded", async () => {
    mockGetRuleById.mockResolvedValue({
      id: "rule-1",
      name: "My rule",
      description: "Some description",
      ruleBody: { type: "action" },
    });

    render(<RuleDetailsPage />);

    expect(await screen.findByText("My rule")).toBeInTheDocument();
    expect(screen.getByText("Some description")).toBeInTheDocument();
    expect(screen.getByTestId("logs-panel")).toBeInTheDocument();
    expect(screen.getByTestId("json-editor")).toBeInTheDocument();
  });

  it("navigates back to /rules when back button is clicked", async () => {
    mockGetRuleById.mockResolvedValue({
      id: "rule-1",
      name: "My rule",
      description: "",
      ruleBody: {},
    });
    render(<RuleDetailsPage />);

    fireEvent.click(await screen.findByText("Back"));
    expect(mockNavigate).toHaveBeenCalledWith("/rules");
  });
});

describe("RulesPage", () => {
  it("shows a spinner on initial load", () => {
    mockRulesContextValue = { ...baseRulesContext, isLoading: true, rules: [] };
    render(<RulesPage />);
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  it("shows an error state with a retry button", () => {
    mockRulesContextValue = { ...baseRulesContext, error: "Network error", rules: [] };
    render(<RulesPage />);

    expect(screen.getByTestId("error-alert")).toHaveTextContent("Network error");
    fireEvent.click(screen.getByText("Retry"));
    expect(mockFetchRules).toHaveBeenCalled();
  });

  it("shows EmptyState when there are no rules at all", () => {
    mockRulesContextValue = { ...baseRulesContext, totalCount: 0, rules: [] };
    render(<RulesPage />);
    expect(screen.getByText(/don't have rules yet/i)).toBeInTheDocument();
  });

  it("shows NotFound when the current page has no rules but rules exist elsewhere", () => {
    mockRulesContextValue = { ...baseRulesContext, totalCount: 5, rules: [] };
    render(<RulesPage />);
    expect(screen.getByTestId("not-found")).toBeInTheDocument();
  });

  it("renders the list of rules", () => {
    mockRulesContextValue = {
      ...baseRulesContext,
      totalCount: 2,
      rules: [
        { id: "1", name: "Rule One" },
        { id: "2", name: "Rule Two" },
      ],
    };
    render(<RulesPage />);

    expect(screen.getByText("Rule One")).toBeInTheDocument();
    expect(screen.getByText("Rule Two")).toBeInTheDocument();
  });

  it("shows pagination only when totalCount exceeds the page size", () => {
    mockRulesContextValue = {
      ...baseRulesContext,
      totalCount: 25,
      rules: [{ id: "1", name: "Rule One" }],
    };
    render(<RulesPage />);
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("opens the confirmation modal and deletes a rule", async () => {
    mockRulesContextValue = {
      ...baseRulesContext,
      totalCount: 1,
      rules: [{ id: "1", name: "Rule One" }],
    };
    mockDeleteRule.mockResolvedValue(true);

    render(<RulesPage />);

    fireEvent.click(screen.getByText("delete-1"));
    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("confirm"));
    await waitFor(() => expect(mockDeleteRule).toHaveBeenCalledWith("1"));
  });

  it("shows a delete error when deleteRule throws", async () => {
    mockRulesContextValue = {
      ...baseRulesContext,
      totalCount: 1,
      rules: [{ id: "1", name: "Rule One" }],
    };
    mockDeleteRule.mockRejectedValue(new Error("Delete failed"));

    render(<RulesPage />);

    fireEvent.click(screen.getByText("delete-1"));
    fireEvent.click(screen.getByText("confirm"));

    expect(await screen.findByTestId("error-alert")).toHaveTextContent("Delete failed");
  });

  it("navigates to /rules/add when the add button is clicked", () => {
    mockRulesContextValue = {
      ...baseRulesContext,
      totalCount: 1,
      rules: [{ id: "1", name: "Rule One" }],
    };
    render(<RulesPage />);

    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(mockNavigate).toHaveBeenCalledWith("/rules/add");
  });
});