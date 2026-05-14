import renderMessage from '../../../utils/render-message.util'

interface RuleLogEntry {
  ruleId: number;
  userId: number;
  runId: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  type: 'text' | 'json';
  message?: string;
  data?: Record<string, unknown>;
}

/**
 * Action that publishes log entries to Redis Stream for UI visibility.
 *
 * This function publishes log entries to a Redis Stream keyed by ruleId,
 * allowing real-time log streaming to the UI. Log entries include user info,
 * rule info, message content, and timestamp.
 *
 * The action gracefully handles Redis unavailability - rule execution continues
 * even if log publication fails.
 *
 * @param args - Object containing the logging configuration
 * @param args.message - The message to log. Can include template variables like ${__heap__.path}
 * @param args.level - Log level: 'info' | 'warn' | 'error' | 'debug' (default: 'info')
 * @param args.data - Optional structured data object (for type: 'json' logs)
 * @param context - Object containing execution context
 * @param context.sequenceContext - Context object for the current sequence execution
 *
 * @example
 * // Basic text log
 * {
 *     "type": "log",
 *     "arguments": {
 *         "message": "Starting trading sequence",
 *         "level": "info"
 *     }
 * }
 * @example
 * // Log with heap variables
 * {
 *     "type": "log",
 *     "arguments": {
 *         "message": "Price from heap: ${__heap__.price}",
 *         "level": "info"
 *     }
 * }
 * @example
 * // Structured log with data
 * {
 *     "type": "log",
 *     "arguments": {
 *         "message": "Order executed",
 *         "level": "info",
 *         "data": {
 *             "symbol": "BTCUSDT",
 *             "side": "buy",
 *             "quantity": 0.1
 *         }
 *     }
 * }
 */
export default async function log(
    this: {
        ruleId: number;
        userId: number;
        runId: string;
        ruleLogsService: { publishLog(entry: RuleLogEntry): Promise<void> } | null;
        heap: { get(path: string): any };
    },
    {
        message = "",
        level = 'info',
        data,
    }: {
        message?: string;
        level?: 'info' | 'warn' | 'error' | 'debug';
        data?: Record<string, unknown>;
    },
    {
        sequenceContext = {},
    }: {
        sequenceContext?: Record<string, any>;
    }
): Promise<void> {
    const renderedMessage = renderMessage(message, { heap: this.heap, sequenceContext });

    const entry: RuleLogEntry = {
        ruleId: this.ruleId,
        userId: this.userId,
        runId: this.runId,
        timestamp: new Date().toISOString(),
        level,
        type: data ? 'json' : 'text',
        message: renderedMessage,
        data,
    };

    if (this.ruleLogsService) {
        await this.ruleLogsService.publishLog(entry);
    }
}