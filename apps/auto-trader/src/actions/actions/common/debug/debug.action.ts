import {renderMessage} from '../../../utils'
import { LoggerService } from '@trading-bot/logger'; 
/**
 * Action that logs messages to the terminal for debugging purposes.
 *
 * This function renders the message using template variables from the heap and sequence context,
 * then outputs it to the console. Useful for debugging sequences, monitoring execution flow,
 * and tracking variable values during development and testing.
 *
 * Note: These logs are temporary and will be cleared when the terminal is cleared.
 * Method has access to the heap and sequenceContext.
 *
 * @param args - Object containing the logging configuration
 * @param args.message - The message to log. Can include template variables like ${__heap__.path}
 * @param context - Object containing execution context
 * @param context.sequenceContext - Context object for the current sequence execution
 *
 * @example
 * // Basic logging with static message
 * {
 *     "type": "debug",
 *     "arguments": {
 *         "message": "Starting trading sequence"
 *     }
 * }
 * @example
 * // Log with heap variables
 * {
 *     "type": "debug",
 *     "arguments": {
 *         "message": "Log some information from heap: ${__heap__.some.value.from.heap}"
 *     }
 * }
 *
 * @example
 * // Log data from sequence context
 * {
 *     "type": "debug",
 *     "arguments": {
 *         "message": "Log some information from the sequence context: ${__sequenceContext__.some.value.from.sequenceContext}"
 *     }
 * }
 */


export default function debug(
    {
        message = ""
    }: {
        message?: string;
    },
    {
        sequenceContext = {},
    }: {
        sequenceContext?: Record<string, any>;
    },
    logger: LoggerService,
): void {
    const renderedMessage = renderMessage(message, { heap: this.heap, sequenceContext });
    logger.log(`[debug] ${renderedMessage}`);
}
