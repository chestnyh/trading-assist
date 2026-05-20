import renderMessage from '../../../utils/render-message.util'
import type { RuleLogEntry } from '../../../../auto-trader/rule-log-entry.interface';

type LogArgs = Pick<RuleLogEntry, 'level' | 'data'> & { message?: string; };

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
    {
        message = "",
        level = 'info',
        data,
    }: LogArgs,
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

    // Always output to console for visibility
    console.log(`[${level}] ${renderedMessage}`);
}