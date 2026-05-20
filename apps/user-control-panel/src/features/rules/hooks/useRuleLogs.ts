import { useEffect, useRef, useState, useCallback } from 'react';

export interface RuleLogEntry {
  ruleId: number;
  userId: number;
  runId: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  type: 'text' | 'json';
  message?: string;
  data?: Record<string, unknown>;
}

interface UseRuleLogsOptions {
  ruleId: string;
  token: string | null;
  onError?: (error: Error) => void;
}

interface UseRuleLogsReturn {
  logs: RuleLogEntry[];
  isConnected: boolean;
  isReconnecting: boolean;
  error: Error | null;
}

const RECONNECT_DELAY_MS = 3000;
const MAX_RECONNECT_ATTEMPTS = 10;

export function useRuleLogs({ ruleId, token, onError }: UseRuleLogsOptions): UseRuleLogsReturn {
  const [logs, setLogs] = useState<RuleLogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isManualCloseRef = useRef(false);

  const connect = useCallback(() => {
    if (!token) {
      setError(new Error('Authentication required'));
      return;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    isManualCloseRef.current = false;

    const url = `http://localhost:3002/stream/rules/${ruleId}/logs?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);

    es.onopen = () => {
      setIsConnected(true);
      setIsReconnecting(false);
      setError(null);
      reconnectAttemptsRef.current = 0;
    };

    es.onmessage = (event) => {
      try {
        const entry: RuleLogEntry = JSON.parse(event.data);
        setLogs((prev) => [...prev, entry]);
      } catch (err) {
        console.error('Failed to parse log entry:', err);
      }
    };

    es.onerror = (err) => {
      setIsConnected(false);

      if (isManualCloseRef.current) {
        return;
      }

      if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
        setError(new Error('Max reconnection attempts reached'));
        setIsReconnecting(false);
        es.close();
        onError?.(new Error('Max reconnection attempts reached'));
        return;
      }

      setIsReconnecting(true);
      reconnectAttemptsRef.current += 1;

      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, RECONNECT_DELAY_MS);
    };

    eventSourceRef.current = es;
  }, [ruleId, token, onError]);

  useEffect(() => {
    if (ruleId && token) {
      connect();
    }

    return () => {
      isManualCloseRef.current = true;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [ruleId, token, connect]);

  return { logs, isConnected, isReconnecting, error };
}
