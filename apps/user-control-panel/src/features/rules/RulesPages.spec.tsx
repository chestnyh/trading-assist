import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RulesPage } from "./RulesPage";

const mockNavigate = jest.fn();
const mockSetSearchParams = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams, mockSetSearchParams],
}));

const mockFetchRules = jest.fn();
const mockDeleteRule = jest.fn();

const baseRulesContext = {
  rules: [] as any[],
  isLoading: false,
  fetchRules: mockFetchRules,
  totalCount: 0,
  error: null as string | null,
  deleteRule: mockDeleteRule,
  addRule: jest.fn(),
  updateRule: jest.fn(),
  getRuleById: jest.fn(),
};

let mockRulesContextValue = { ...baseRulesContext };

jest.mock("../../app/contexts/RulesContext", () => ({
  useRules: () => mockRulesContextValue,
}));

beforeAll(() => {
  window.scrollTo = jest.fn();
});

beforeEach(() => {
  jest.clearAllMocks();
  mockRulesContextValue = { ...baseRulesContext };
  mockSearchParams = new URLSearchParams();
});

const makeRule = (overrides: Partial<any> = {}) => ({
  id: "1",
  name: "Rule One",
  description: "desc",
  ruleBody: {},
  ...overrides,
});

const getRuleRow = (ruleName: string) =>
  screen.getByText(ruleName).closest(".cursor-pointer") as HTMLElement;

describe("RulesPage (component integration)", () => {
  it("shows a spinner on initial load (real Spinner)", () => {
    mockRulesContextValue = { ...baseRulesContext, isLoading: true, rules: [] };
    render(<RulesPage />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("calls fetchRules on mount with the current page", () => {
    render(<RulesPage />);
    expect(mockFetchRules).toHaveBeenCalledWith(1);
  });

  it("re-fetches when the page query param changes", () => {
    mockSearchParams = new URLSearchParams("page=3");
    render(<RulesPage />);
    expect(mockFetchRules).toHaveBeenCalledWith(3);
  });

  it("shows a real error state and retries via the real Button", () => {
    mockRulesContextValue = { ...baseRulesContext, error: "Network error", rules: [] };
    render(<RulesPage />);

    expect(screen.getByText("Network error")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(mockFetchRules).toHaveBeenCalledWith(1);
  });

  it("shows the real EmptyState and navigates to /rules/add on click", () => {
    mockRulesContextValue = { ...baseRulesContext, totalCount: 0, rules: [] };
    render(<RulesPage />);

    expect(screen.getByText(/don't have rules yet/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button"));
    expect(mockNavigate).toHaveBeenCalledWith("/rules/add");
  });

  it("shows the real NotFound page when the current page has no rules but rules exist elsewhere", () => {
    mockRulesContextValue = { ...baseRulesContext, totalCount: 5, rules: [] };
    render(<RulesPage />);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Go to Dashboard" }));
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("renders the real RuleItem list with names and descriptions", () => {
    mockRulesContextValue = {
      ...baseRulesContext,
      totalCount: 2,
      rules: [
        makeRule({ id: "1", name: "Rule One", description: "First rule" }),
        makeRule({ id: "2", name: "Rule Two", description: "Second rule" }),
      ],
    };
    render(<RulesPage />);

    expect(screen.getByText("Rule One")).toBeInTheDocument();
    expect(screen.getByText("First rule")).toBeInTheDocument();
    expect(screen.getByText("Rule Two")).toBeInTheDocument();
    expect(screen.getByText("Second rule")).toBeInTheDocument();
  });

  it("navigates to the rule details page when a row is clicked", () => {
    mockRulesContextValue = {
      ...baseRulesContext,
      totalCount: 1,
      rules: [makeRule({ id: "42", name: "Rule One" })],
    };
    render(<RulesPage />);

    fireEvent.click(getRuleRow("Rule One"));
    expect(mockNavigate).toHaveBeenCalledWith("/rules/42");
  });

  it("navigates to the update page from the edit button without triggering row navigation", () => {
    mockRulesContextValue = {
      ...baseRulesContext,
      totalCount: 1,
      rules: [makeRule({ id: "42", name: "Rule One" })],
    };
    render(<RulesPage />);

    const row = getRuleRow("Rule One");
    fireEvent.click(within(row).getByRole("button", { name: /edit rule/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/rules/42/update");
    expect(mockNavigate).not.toHaveBeenCalledWith("/rules/42");
  });

  it("shows pagination only when totalCount exceeds the page size", () => {
    mockRulesContextValue = {
      ...baseRulesContext,
      totalCount: 25,
      rules: [makeRule()],
    };
    render(<RulesPage />);

    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
  });

  it("does not show pagination when totalCount is within the page size", () => {
    mockRulesContextValue = {
      ...baseRulesContext,
      totalCount: 5,
      rules: [makeRule()],
    };
    render(<RulesPage />);

    expect(screen.queryByRole("button", { name: "1" })).not.toBeInTheDocument();
  });

  it("changes the page via the real Pagination and scrolls to top", () => {
    mockRulesContextValue = {
      ...baseRulesContext,
      totalCount: 45,
      rules: [makeRule()],
    };
    render(<RulesPage />);

    fireEvent.click(screen.getByRole("button", { name: "2" }));

    expect(mockSetSearchParams).toHaveBeenCalledWith({ page: "2" });
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("navigates to /rules/add when the add button is clicked", () => {
    mockRulesContextValue = {
      ...baseRulesContext,
      totalCount: 1,
      rules: [makeRule()],
    };
    render(<RulesPage />);

    fireEvent.click(screen.getByRole("button", { name: "Add rule" }));
    expect(mockNavigate).toHaveBeenCalledWith("/rules/add");
  });

  it("opens the real ConfirmationModal on delete and deletes on confirm", async () => {
    mockRulesContextValue = {
      ...baseRulesContext,
      totalCount: 1,
      rules: [makeRule({ id: "1", name: "Rule One" })],
    };
    mockDeleteRule.mockResolvedValue(true);

    render(<RulesPage />);

    const row = getRuleRow("Rule One");
    fireEvent.click(within(row).getByRole("button", { name: /delete rule/i }));

    const modal = await screen.findByRole("dialog");
    expect(within(modal).getByText("Delete Rule")).toBeInTheDocument();
    expect(
      within(modal).getByText(/are you sure you want to delete this rule/i)
    ).toBeInTheDocument();

    fireEvent.click(within(modal).getByRole("button", { name: "Delete" }));

    await waitFor(() => expect(mockDeleteRule).toHaveBeenCalledWith("1"));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("closes the modal without deleting on cancel", async () => {
    mockRulesContextValue = {
      ...baseRulesContext,
      totalCount: 1,
      rules: [makeRule({ id: "1", name: "Rule One" })],
    };
    render(<RulesPage />);

    const row = getRuleRow("Rule One");
    fireEvent.click(within(row).getByRole("button", { name: /delete rule/i }));

    const modal = await screen.findByRole("dialog");
    fireEvent.click(within(modal).getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(mockDeleteRule).not.toHaveBeenCalled();
  });

  it("closes the modal via the X button as well", async () => {
    mockRulesContextValue = {
      ...baseRulesContext,
      totalCount: 1,
      rules: [makeRule({ id: "1", name: "Rule One" })],
    };
    render(<RulesPage />);

    const row = getRuleRow("Rule One");
    fireEvent.click(within(row).getByRole("button", { name: /delete rule/i }));

    const modal = await screen.findByRole("dialog");
    fireEvent.click(within(modal).getByRole("button", { name: "Close" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows a real ErrorAlert when deleteRule throws, and closes the modal", async () => {
    mockRulesContextValue = {
      ...baseRulesContext,
      totalCount: 1,
      rules: [makeRule({ id: "1", name: "Rule One" })],
    };
    mockDeleteRule.mockRejectedValue(new Error("Delete failed"));

    render(<RulesPage />);

    const row = getRuleRow("Rule One");
    fireEvent.click(within(row).getByRole("button", { name: /delete rule/i }));

    const modal = await screen.findByRole("dialog");
    fireEvent.click(within(modal).getByRole("button", { name: "Delete" }));

    expect(await screen.findByText("Delete failed")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("clears the previous delete error when a new delete is confirmed", async () => {
    mockRulesContextValue = {
      ...baseRulesContext,
      totalCount: 1,
      rules: [makeRule({ id: "1", name: "Rule One" })],
    };
    mockDeleteRule.mockRejectedValueOnce(new Error("Delete failed"));

    render(<RulesPage />);
    const row = getRuleRow("Rule One");

    fireEvent.click(within(row).getByRole("button", { name: /delete rule/i }));
    fireEvent.click(
      within(await screen.findByRole("dialog")).getByRole("button", { name: "Delete" })
    );
    expect(await screen.findByText("Delete failed")).toBeInTheDocument();

    mockDeleteRule.mockResolvedValueOnce(true);
    fireEvent.click(within(getRuleRow("Rule One")).getByRole("button", { name: /delete rule/i }));

    expect(screen.queryByText("Delete failed")).not.toBeInTheDocument();
  });
});