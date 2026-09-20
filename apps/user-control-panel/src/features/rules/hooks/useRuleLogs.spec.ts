import { renderHook, act, waitFor } from "@testing-library/react";
import { useRuleLogs } from "./useRuleLogs";

class FakeEventSource {
  static instances: FakeEventSource[] = [];
  url: string;
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;
  closed = false;

  constructor(url: string) {
    this.url = url;
    FakeEventSource.instances.push(this);
  }

  close() {
    this.closed = true;
  }
}

beforeEach(() => {
  jest.useFakeTimers();
  FakeEventSource.instances = [];
  (global as any).EventSource = FakeEventSource;
  process.env.LOG_STREAM_BASE_URL = "http://localhost:8080";
});

afterEach(() => {
  jest.useRealTimers();
});

const latestSource = () => FakeEventSource.instances[FakeEventSource.instances.length - 1];

describe("useRuleLogs", () => {
  it("does not connect and does not set an error when there is no token", () => {
  const { result } = renderHook(() => useRuleLogs({ ruleId: "1", token: null }));

  expect(FakeEventSource.instances).toHaveLength(0);
  expect(result.current.error).toBeNull();
  expect(result.current.isConnected).toBe(false);
});

  it("opens a connection to the correct URL and marks connected on open", () => {
    const { result } = renderHook(() => useRuleLogs({ ruleId: "42", token: "tok" }));

    expect(FakeEventSource.instances).toHaveLength(1);
    expect(latestSource().url).toBe(
      "http://localhost:8080/stream/rules/42/logs?token=tok"
    );

    act(() => {
      latestSource().onopen?.();
    });

    expect(result.current.isConnected).toBe(true);
    expect(result.current.isReconnecting).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("appends parsed log entries on message", () => {
    const { result } = renderHook(() => useRuleLogs({ ruleId: "1", token: "tok" }));

    const entry = {
      ruleId: 1,
      userId: 1,
      runId: "run-1",
      timestamp: "2026-01-01T00:00:00.000Z",
      level: "info",
      type: "text",
      message: "hello",
    };

    act(() => {
      latestSource().onmessage?.({ data: JSON.stringify(entry) });
    });

    expect(result.current.logs).toEqual([entry]);
  });

  it("ignores malformed messages instead of throwing", () => {
    const { result } = renderHook(() => useRuleLogs({ ruleId: "1", token: "tok" }));

    act(() => {
      latestSource().onmessage?.({ data: "{not valid json" });
    });

    expect(result.current.logs).toEqual([]);
  });

  it("marks disconnected and reconnecting on error, then reconnects after the delay", () => {
    const { result } = renderHook(() => useRuleLogs({ ruleId: "1", token: "tok" }));
    expect(FakeEventSource.instances).toHaveLength(1);

    act(() => {
      latestSource().onerror?.(new Event("error"));
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.isReconnecting).toBe(true);
    expect(FakeEventSource.instances).toHaveLength(1); 

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(FakeEventSource.instances).toHaveLength(2);
  });

  it("stops retrying and calls onError after reaching the max reconnect attempts", () => {
    const onError = jest.fn();
    renderHook(() => useRuleLogs({ ruleId: "1", token: "tok", onError }));

    for (let i = 0; i < 10; i++) {
      act(() => {
        latestSource().onerror?.(new Event("error"));
      });
      act(() => {
        jest.advanceTimersByTime(3000);
      });
    }

    act(() => {
      latestSource().onerror?.(new Event("error"));
    });

    expect(onError).toHaveBeenCalledWith(new Error("Max reconnection attempts reached"));
  });

  it("does not reconnect after the effect cleanup runs on unmount", () => {
    const { unmount } = renderHook(() => useRuleLogs({ ruleId: "1", token: "tok" }));
    const source = latestSource();

    unmount();
    expect(source.closed).toBe(true);

    act(() => {
      source.onerror?.(new Event("error"));
      jest.advanceTimersByTime(3000);
    });

    expect(FakeEventSource.instances).toHaveLength(1);
  });

  it("reconnects with a new URL when ruleId changes", () => {
    const { rerender } = renderHook(
      ({ ruleId }) => useRuleLogs({ ruleId, token: "tok" }),
      { initialProps: { ruleId: "1" } }
    );

    expect(latestSource().url).toContain("/stream/rules/1/logs");

    rerender({ ruleId: "2" });

    expect(latestSource().url).toContain("/stream/rules/2/logs");
    expect(FakeEventSource.instances[0].closed).toBe(true);
  });

  it("resets the reconnect attempt counter after a successful open", () => {
    const onError = jest.fn();
    renderHook(() => useRuleLogs({ ruleId: "1", token: "tok", onError }));

    act(() => {
      latestSource().onerror?.(new Event("error"));
      jest.advanceTimersByTime(3000);
    });
    act(() => {
      latestSource().onopen?.();
    });

    for (let i = 0; i < 9; i++) {
      act(() => {
        latestSource().onerror?.(new Event("error"));
        jest.advanceTimersByTime(3000);
      });
    }
    expect(onError).not.toHaveBeenCalled();
  });
});