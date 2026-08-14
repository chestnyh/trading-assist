import { renderHook, act, waitFor } from '@testing-library/react';
import { useRuleLogs, RuleLogEntry } from './useRuleLogs';

// FakeEventSource is installed in setupTests and records instances.
const getFakeInstances = () =>
  (globalThis.EventSource as unknown as {
    instances: Array<{
      onopen: (() => void) | null;
      onmessage: ((event: { data: string }) => void) | null;
      onerror: ((event: unknown) => void) | null;
      close: () => void;
      url: string;
    }>;
  }).instances;

describe('useRuleLogs', () => {
  beforeEach(() => {
    getFakeInstances().length = 0;
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not connect without a token', () => {
    const { result } = renderHook(() =>
      useRuleLogs({ ruleId: '1', token: null })
    );
    expect(result.current.error).toBeNull();
    expect(getFakeInstances()).toHaveLength(0);
  });

  it('connects and receives log entries', async () => {
    const { result } = renderHook(() =>
      useRuleLogs({ ruleId: '7', token: 'tok' })
    );

    await waitFor(() => {
      expect(getFakeInstances()).toHaveLength(1);
    });

    const es = getFakeInstances()[0];
    act(() => {
      es.onopen?.();
    });

    const entry: RuleLogEntry = {
      ruleId: 7,
      userId: 1,
      runId: 'run-1',
      timestamp: '2026-01-01T00:00:00.000Z',
      level: 'info',
      type: 'text',
      message: 'hello',
    };
    act(() => {
      es.onmessage?.({ data: JSON.stringify(entry) });
    });

    expect(result.current.logs).toEqual([entry]);
    expect(result.current.isConnected).toBe(true);
    expect(es.url).toContain('/stream/rules/7/logs');
    expect(es.url).toContain('token=tok');
  });

  it('ignores malformed messages', async () => {
    const { result } = renderHook(() =>
      useRuleLogs({ ruleId: '1', token: 'tok' })
    );

    await waitFor(() => {
      expect(getFakeInstances()).toHaveLength(1);
    });

    act(() => {
      getFakeInstances()[0].onmessage?.({ data: 'not-json' });
    });

    expect(result.current.logs).toEqual([]);
  });

  it('reconnects on error and stops after max attempts', async () => {
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useRuleLogs({ ruleId: '1', token: 'tok', onError })
    );

    await waitFor(() => {
      expect(getFakeInstances()).toHaveLength(1);
    });

    // Each error schedules a reconnect; MAX_RECONNECT_ATTEMPTS = 10.
    // Failing the initial connection + 10 reconnects exceeds the limit.
    for (let i = 0; i < 11; i++) {
      const es = getFakeInstances()[getFakeInstances().length - 1];
      act(() => {
        es.onerror?.({});
      });
      act(() => {
        jest.advanceTimersByTime(3000);
      });
    }

    expect(result.current.isReconnecting).toBe(false);
    expect(result.current.error).toEqual(new Error('Max reconnection attempts reached'));
    expect(onError).toHaveBeenCalledWith(new Error('Max reconnection attempts reached'));
  });

  it('reconnects and recovers after a transient error', async () => {
    const { result } = renderHook(() =>
      useRuleLogs({ ruleId: '1', token: 'tok' })
    );

    await waitFor(() => {
      expect(getFakeInstances()).toHaveLength(1);
    });

    act(() => {
      getFakeInstances()[0].onerror?.({});
    });
    expect(result.current.isReconnecting).toBe(true);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(getFakeInstances()).toHaveLength(2);
    });

    act(() => {
      getFakeInstances()[1].onopen?.();
    });

    expect(result.current.isConnected).toBe(true);
    expect(result.current.isReconnecting).toBe(false);
  });

  it('cleans up the connection on unmount', async () => {
    const { unmount } = renderHook(() =>
      useRuleLogs({ ruleId: '1', token: 'tok' })
    );

    await waitFor(() => {
      expect(getFakeInstances()).toHaveLength(1);
    });

    const closeSpy = jest.spyOn(getFakeInstances()[0], 'close');
    unmount();

    expect(closeSpy).toHaveBeenCalled();
  });
});
