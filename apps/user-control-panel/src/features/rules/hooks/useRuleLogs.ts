import { useEffect, useRef, useState, useCallback } from 'react';
import { authControllerStreamTicket } from '@trading-bot/api-client';

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
  enabled: boolean;
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

export function useRuleLogs({ ruleId, enabled, onError }: UseRuleLogsOptions): UseRuleLogsReturn {
  const [logs, setLogs] = useState<RuleLogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isManualCloseRef = useRef(false);

  const connect = useCallback(async () => {
    if (!enabled) {
      return;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    isManualCloseRef.current = false;

    // The session credential is HttpOnly, so exchange it for a short-lived stream ticket.
    let ticket: string;
    try {
      const response = await authControllerStreamTicket();
      if (response.status !== 200 || !response.data?.ticket) {
        setError(new Error('Authentication required'));
        return;
      }
      ticket = response.data.ticket;
    } catch {
      setError(new Error('Authentication required'));
      return;
    }

    if (isManualCloseRef.current) {
      return;
    }

    const url = `${process.env.LOG_STREAM_BASE_URL}/stream/rules/${ruleId}/logs?token=${encodeURIComponent(ticket)}`;
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
        // 
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
        void connect();
      }, RECONNECT_DELAY_MS);
    };

    eventSourceRef.current = es;
  }, [ruleId, enabled, onError]);

  useEffect(() => {
    if (ruleId && enabled) {
      void connect();
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
  }, [ruleId, enabled, connect]);

  return { logs, isConnected, isReconnecting, error };
}
