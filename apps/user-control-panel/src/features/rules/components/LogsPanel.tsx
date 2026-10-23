import { useEffect, useRef, useState, useCallback } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, Pause, Play, WifiOff, Loader2 } from 'lucide-react';
import { RuleLogEntry } from '../hooks/useRuleLogs';
import { CARD, ICON_BUTTON, FOCUS_RING } from '../../../shared/ui/styles';

interface LogsPanelProps {
  logs: RuleLogEntry[];
  isConnected: boolean;
  isReconnecting: boolean;
  error: Error | null;
}

const LOG_COLORS: Record<RuleLogEntry['level'], string> = {
  info: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300',
  warn: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  error: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  debug: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
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
    <div className={`${CARD} p-4 md:p-5`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-neutral-950 dark:text-white">Logs</h3>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">({logs.length} entries)</span>
        </div>

        <div className="flex items-center gap-2">
          {!isConnected && !isReconnecting && (
            <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-500/15 dark:text-red-300">
              <WifiOff size={14} />
              Disconnected
            </span>
          )}

          {isReconnecting && (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
              <Loader2 size={14} className="animate-spin" />
              Reconnecting...
            </span>
          )}

          {isConnected && (
            <span className="flex items-center gap-1.5 rounded-full bg-brand-0 px-3 py-1 text-xs font-medium text-forest-200 dark:bg-forest-300 dark:text-brand-200">
              <span className="w-2 h-2 rounded-full bg-forest-200 dark:bg-brand-300 animate-pulse" />
              Live
            </span>
          )}

          <button
            onClick={() => setIsAutoScroll(!isAutoScroll)}
            className={`${ICON_BUTTON} !h-8 !w-8`}
            title={isAutoScroll ? 'Pause auto-scroll' : 'Resume auto-scroll'}
          >
            {isAutoScroll ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-3 rounded-xl border border-error/30 bg-error/10 text-error text-sm">
          <AlertCircle size={16} />
          {error.message}
        </div>
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-80 overflow-y-auto space-y-2 pr-1 rounded-xl"
      >
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
            No logs yet. Waiting for rule execution...
          </div>
        ) : (
          logs.map((log, index) => {
            const id = getLogId(log, index);
            const isExpanded = expandedLogId === id;

            return (
              <div
                key={id}
                className="px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950"
              >
                <div className="flex items-start gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider ${LOG_COLORS[log.level]} shrink-0`}>
                    {log.level.toUpperCase()}
                  </span>
                  <span className="mt-0.5 text-xs font-mono text-neutral-500 dark:text-neutral-400 shrink-0">
                    {formatTimestamp(log.timestamp)}
                  </span>
                  <span className="mt-0.5 text-xs font-mono text-neutral-400 dark:text-neutral-500 shrink-0">run:{log.runId.slice(0, 8)}</span>

                  <span className="text-sm text-neutral-900 dark:text-neutral-100 flex-1 break-all">
                    {log.message || (log.data ? JSON.stringify(log.data).slice(0, 100) : 'No message')}
                  </span>

                  {log.data && (
                    <button
                      onClick={() => toggleExpand(id)}
                      className={`shrink-0 p-0.5 rounded-full text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors ${FOCUS_RING}`}
                      aria-label={isExpanded ? 'Collapse log details' : 'Expand log details'}
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  )}
                </div>

                {isExpanded && log.data && (
                  <div className="mt-2 p-3 rounded-lg bg-white border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800">
                    <pre className="text-xs text-neutral-700 dark:text-neutral-300 overflow-x-auto">
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
          className={`mt-3 w-full py-1.5 rounded-full text-sm font-medium text-forest-200 hover:text-forest-300 dark:text-brand-300 dark:hover:text-brand-200 transition-colors ${FOCUS_RING}`}
        >
          Resume auto-scroll
        </button>
      )}
    </div>
  );
}
