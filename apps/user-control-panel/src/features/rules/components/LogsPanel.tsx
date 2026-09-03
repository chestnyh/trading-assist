import { useEffect, useRef, useState, useCallback } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, Pause, Play, WifiOff, Loader2 } from 'lucide-react';
import { RuleLogEntry } from '../hooks/useRuleLogs';

interface LogsPanelProps {
  logs: RuleLogEntry[];
  isConnected: boolean;
  isReconnecting: boolean;
  error: Error | null;
}

const LOG_COLORS: Record<RuleLogEntry['level'], string> = {
  info: 'text-blue-400',
  warn: 'text-yellow-400',
  error: 'text-red-400',
  debug: 'text-gray-400',
};

const LOG_BG_COLORS: Record<RuleLogEntry['level'], string> = {
  info: 'bg-blue-400/10',
  warn: 'bg-yellow-400/10',
  error: 'bg-red-400/10',
  debug: 'bg-gray-400/10',
};

export function LogsPanel({ logs, isConnected, isReconnecting, error }: LogsPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current && isAutoScroll) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isAutoScroll]);

  useEffect(() => {
    scrollToBottom();
  }, [logs, scrollToBottom]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

    setIsAutoScroll(isAtBottom);
  }, []);

  const formatTimestamp = (ts: string): string => {
    const date = new Date(ts);
    const timeStr = date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    return `${timeStr}.${ms}`;
  };

  const getLogId = (log: RuleLogEntry, index: number): string => {
    return `${log.runId}-${log.timestamp}-${index}`;
  };

  const toggleExpand = (id: string) => {
    setExpandedLogId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-bg-secondary/30 border-2 border-border rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-body-md font-medium text-text-secondary">Logs</h3>
          <span className="text-sm text-text-tertiary">({logs.length} entries)</span>
        </div>

        <div className="flex items-center gap-2">
          {!isConnected && !isReconnecting && (
            <span className="flex items-center gap-1 text-sm text-red-400">
              <WifiOff size={16} />
              Disconnected
            </span>
          )}

          {isReconnecting && (
            <span className="flex items-center gap-1 text-sm text-yellow-400">
              <Loader2 size={16} className="animate-spin" />
              Reconnecting...
            </span>
          )}

          {isConnected && (
            <span className="flex items-center gap-1 text-sm text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
          )}

          <button
            onClick={() => setIsAutoScroll(!isAutoScroll)}
            className="p-1.5 rounded-md hover:bg-bg-tertiary/50 transition-colors"
            title={isAutoScroll ? 'Pause auto-scroll' : 'Resume auto-scroll'}
          >
            {isAutoScroll ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-3 rounded-lg bg-red-400/10 text-red-400 text-sm">
          <AlertCircle size={16} />
          {error.message}
        </div>
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-80 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-bg-secondary"
      >
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-tertiary text-sm">
            No logs yet. Waiting for rule execution...
          </div>
        ) : (
          logs.map((log, index) => {
            const id = getLogId(log, index);
            const isExpanded = expandedLogId === id;

            return (
              <div
                key={id}
                className={`p-2 rounded-lg ${LOG_BG_COLORS[log.level]} border border-border/50`}
              >
                <div className="flex items-start gap-2">
                  <span className={`text-xs font-mono ${LOG_COLORS[log.level]} shrink-0`}>
                    [{log.level.toUpperCase()}]
                  </span>
                  <span className="text-xs text-text-tertiary shrink-0">
                    {formatTimestamp(log.timestamp)}
                  </span>
                  <span className="text-xs text-text-tertiary shrink-0">run:{log.runId.slice(0, 8)}</span>

                  <span className="text-sm text-primary flex-1 break-all">
                    {log.message || (log.data ? JSON.stringify(log.data).slice(0, 100) : 'No message')}
                  </span>

                  {log.data && (
                    <button
                      onClick={() => toggleExpand(id)}
                      className="shrink-0 p-0.5 rounded hover:bg-bg-tertiary/50 transition-colors"
                      aria-label={isExpanded ? 'Collapse log details' : 'Expand log details'}
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  )}
                </div>

                {isExpanded && log.data && (
                  <div className="mt-2 p-2 rounded bg-bg-tertiary/50">
                    <pre className="text-xs text-text-secondary overflow-x-auto">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {!isAutoScroll && logs.length > 0 && (
        <button
          onClick={() => {
            setIsAutoScroll(true);
            scrollToBottom();
          }}
          className="mt-2 w-full py-1.5 text-sm text-accent hover:text-primary transition-colors"
        >
          Resume auto-scroll
        </button>
      )}
    </div>
  );
}
