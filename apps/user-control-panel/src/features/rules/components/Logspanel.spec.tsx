import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LogsPanel } from "./LogsPanel";
import { RuleLogEntry } from "../hooks/useRuleLogs";

function makeLog(overrides: Partial<RuleLogEntry> = {}): RuleLogEntry {
  return {
    runId: "abcdef1234567890",
    timestamp: "2026-01-01T12:00:00.123Z",
    level: "info",
    message: "hello",
    data: undefined,
    ...overrides,
  } as RuleLogEntry;
}

describe("LogsPanel", () => {
  it("shows the empty state when there are no logs", () => {
    render(<LogsPanel logs={[]} isConnected isReconnecting={false} error={null} />);
    expect(screen.getByText(/No logs yet/i)).toBeInTheDocument();
    expect(screen.getByText("(0 entries)")).toBeInTheDocument();
  });

  it("renders the entry count and each log's level/message", () => {
    const logs = [makeLog({ message: "first" }), makeLog({ message: "second", level: "error" })];
    render(<LogsPanel logs={logs} isConnected isReconnecting={false} error={null} />);

    expect(screen.getByText("(2 entries)")).toBeInTheDocument();
    expect(screen.getByText("first")).toBeInTheDocument();
    expect(screen.getByText("second")).toBeInTheDocument();
    expect(screen.getByText("[ERROR]")).toBeInTheDocument();
  });

  it("shows 'Live' when connected", () => {
    render(<LogsPanel logs={[]} isConnected isReconnecting={false} error={null} />);
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("shows 'Disconnected' when not connected and not reconnecting", () => {
    render(<LogsPanel logs={[]} isConnected={false} isReconnecting={false} error={null} />);
    expect(screen.getByText("Disconnected")).toBeInTheDocument();
  });

  it("shows 'Reconnecting...' while reconnecting", () => {
    render(<LogsPanel logs={[]} isConnected={false} isReconnecting error={null} />);
    expect(screen.getByText("Reconnecting...")).toBeInTheDocument();
  });

  it("shows the error message when an error is present", () => {
    render(<LogsPanel logs={[]} isConnected isReconnecting={false} error={new Error("Connection lost")} />);
    expect(screen.getByText("Connection lost")).toBeInTheDocument();
  });

  it("falls back to a JSON preview when a log has no message but has data", () => {
    const logs = [makeLog({ message: "", data: { foo: "bar" } })];
    render(<LogsPanel logs={logs} isConnected isReconnecting={false} error={null} />);
    expect(screen.getByText(/"foo":"bar"/)).toBeInTheDocument();
  });

  it("falls back to 'No message' when a log has neither message nor data", () => {
    const logs = [makeLog({ message: "", data: undefined })];
    render(<LogsPanel logs={logs} isConnected isReconnecting={false} error={null} />);
    expect(screen.getByText("No message")).toBeInTheDocument();
  });

   it("toggles expanded JSON data when the chevron button is clicked", () => {
    const logs = [makeLog({ message: "with data", data: { count: 42 } })];
    render(<LogsPanel logs={logs} isConnected isReconnecting={false} error={null} />);
 
    expect(screen.queryByText(/"count": 42/)).not.toBeInTheDocument();
 
    fireEvent.click(screen.getByLabelText("Expand log details"));
    expect(screen.getByText(/"count": 42/)).toBeInTheDocument();
 
    fireEvent.click(screen.getByLabelText("Collapse log details"));
    expect(screen.queryByText(/"count": 42/)).not.toBeInTheDocument();
  });

  it("shows a 'Resume auto-scroll' button after the user pauses auto-scroll, and it re-enables it", () => {
    const logs = [makeLog()];
    render(<LogsPanel logs={logs} isConnected isReconnecting={false} error={null} />);

    fireEvent.click(screen.getByTitle("Pause auto-scroll"));

    const resumeButton = screen.getByText("Resume auto-scroll");
    expect(resumeButton).toBeInTheDocument();

    fireEvent.click(resumeButton);
    expect(screen.getByTitle("Pause auto-scroll")).toBeInTheDocument();
  });
});