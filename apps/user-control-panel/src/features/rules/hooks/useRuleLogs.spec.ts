import { renderHook, act } from "@testing-library/react";
import { authControllerStreamTicket } from "@trading-assist/api-client";
import { useRuleLogs } from "./useRuleLogs";

jest.mock("@trading-assist/api-client", () => ({
  authControllerStreamTicket: jest.fn(),
}));

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
  (authControllerStreamTicket as jest.Mock).mockResolvedValue({
    status: 200,
    data: { ticket: "tok" },
  });
});

afterEach(() => {
  jest.useRealTimers();
});

const latestSource = () => FakeEventSource.instances[FakeEventSource.instances.length - 1];

// Lets the async connect() finish: ticket resolves, then EventSource is created.
// eslint-disable-next-line
const flushConnect = () => act(async () => {});

describe("useRuleLogs", () => {
  it("does not request a ticket or connect when disabled", async () => {
    const { result } = renderHook(() => useRuleLogs({ ruleId: "1", enabled: false }));
    await flushConnect();

    expect(authControllerStreamTicket).not.toHaveBeenCalled();
    expect(FakeEventSource.instances).toHaveLength(0);
    expect(result.current.error).toBeNull();
    expect(result.current.isConnected).toBe(false);
  });

  it("sets an auth error and does not connect when the stream ticket request fails", async () => {
    (authControllerStreamTicket as jest.Mock).mockResolvedValue({ status: 401, data: undefined });

    const { result } = renderHook(() => useRuleLogs({ ruleId: "1", enabled: true }));
    await flushConnect();

    expect(FakeEventSource.instances).toHaveLength(0);
    expect(result.current.error).toEqual(new Error("Authentication required"));
  });

  it("opens a connection with the stream ticket and marks connected on open", async () => {
    const { result } = renderHook(() => useRuleLogs({ ruleId: "42", enabled: true }));
    await flushConnect();

    expect(FakeEventSource.instances).toHaveLength(1);
    expect(latestSource().url).toBe("http://localhost:8080/stream/rules/42/logs?token=tok");

    act(() => {
      latestSource().onopen?.();
    });

    expect(result.current.isConnected).toBe(true);
    expect(result.current.isReconnecting).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("appends parsed log entries on message", async () => {
    const { result } = renderHook(() => useRuleLogs({ ruleId: "1", enabled: true }));
    await flushConnect();

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

  it("ignores malformed messages instead of throwing", async () => {
    const { result } = renderHook(() => useRuleLogs({ ruleId: "1", enabled: true }));
    await flushConnect();

    act(() => {
      latestSource().onmessage?.({ data: "{not valid json" });
    });

    expect(result.current.logs).toEqual([]);
  });

  it("marks disconnected and reconnecting on error, then reconnects after the delay", async () => {
    const { result } = renderHook(() => useRuleLogs({ ruleId: "1", enabled: true }));
    await flushConnect();
    expect(FakeEventSource.instances).toHaveLength(1);

    act(() => {
      latestSource().onerror?.(new Event("error"));
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.isReconnecting).toBe(true);
    expect(FakeEventSource.instances).toHaveLength(1);

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(FakeEventSource.instances).toHaveLength(2);
  });

  it("stops retrying and calls onError after reaching the max reconnect attempts", async () => {
    const onError = jest.fn();
    renderHook(() => useRuleLogs({ ruleId: "1", enabled: true, onError }));
    await flushConnect();

    for (let i = 0; i < 10; i++) {
      act(() => {
        latestSource().onerror?.(new Event("error"));
      });
      await act(async () => {
        jest.advanceTimersByTime(3000);
      });
    }

    act(() => {
      latestSource().onerror?.(new Event("error"));
    });

    expect(onError).toHaveBeenCalledWith(new Error("Max reconnection attempts reached"));
  });

  it("does not reconnect after the effect cleanup runs on unmount", async () => {
    const { unmount } = renderHook(() => useRuleLogs({ ruleId: "1", enabled: true }));
    await flushConnect();
    const source = latestSource();

    unmount();
    expect(source.closed).toBe(true);

    act(() => {
      source.onerror?.(new Event("error"));
    });
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(FakeEventSource.instances).toHaveLength(1);
  });

  it("reconnects with a new URL when ruleId changes", async () => {
    const { rerender } = renderHook(({ ruleId }) => useRuleLogs({ ruleId, enabled: true }), {
      initialProps: { ruleId: "1" },
    });
    await flushConnect();

    expect(latestSource().url).toContain("/stream/rules/1/logs");

    rerender({ ruleId: "2" });
    await flushConnect();

    expect(latestSource().url).toContain("/stream/rules/2/logs");
    expect(FakeEventSource.instances[0].closed).toBe(true);
  });

  it("resets the reconnect attempt counter after a successful open", async () => {
    const onError = jest.fn();
    renderHook(() => useRuleLogs({ ruleId: "1", enabled: true, onError }));
    await flushConnect();

    act(() => {
      latestSource().onerror?.(new Event("error"));
    });
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    act(() => {
      latestSource().onopen?.();
    });

    for (let i = 0; i < 10; i++) {
      act(() => {
        latestSource().onerror?.(new Event("error"));
      });
      await act(async () => {
        jest.advanceTimersByTime(3000);
      });
    }

    expect(FakeEventSource.instances).toHaveLength(12);
    expect(onError).not.toHaveBeenCalled();
  });
});