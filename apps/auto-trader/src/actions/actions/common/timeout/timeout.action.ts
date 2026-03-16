/**
 * Action that executes another action after a specified timeout.
 * 
 * This function creates a delay using setTimeout and then executes the specified action.
 * Useful for implementing delays, such as waiting before retrying
 * operations or implementing rate limiting between API calls.
 * 
 * @param args - Object containing the timeout configuration
 * @param args.timeout - Time to wait in milliseconds before executing the action
 * @param args.do - The action to execute after the timeout period
 * @param args.do.type - The type/name of the action to execute
 * @param args.do.arguments - Arguments to pass to the action
 * @param param1 - Object containing execution context
 * @param param1.sequenceContext - Context object for the current sequence execution
 * @param settings - Global settings object (not used in this function)
 * 
 * @example
 * // Wait 5 seconds before do something
 * {
 *     "type": "timeout",
 *     "arguments": {
 *         "timeout": 5000,
 *         "do": {
 *             // ... do something here
 *         }
 *     }
 * }
 * 
 * @example
 * // Wait 1 minute before log something
 * {
 *     "type": "timeout",
 *     "arguments": {
 *         "timeout": 60000,
 *         "do": {
 *             "type": "log",
 *             "arguments": {
 *                 "message": "1 minute has passed"
 *             }
 *         }
 *     }
 * }
 */
export default async function timeout(
    args: any,
    {
        sequenceContext
    }
) {
    const { 
        do: action, 
        timeout 
    } = args;

    let isCanceled = false;
    let isSettled = false;
    let timeoutId: NodeJS.Timeout | null = null;

    await new Promise<void>((resolve) => {
        const settle = () => {
            if (isSettled) return;
            isSettled = true;
            resolve();
        };

        timeoutId = setTimeout(() => settle(), timeout);

        this.addDisposer(() => {
            isCanceled = true;
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            settle();
        });
    });

    if (isCanceled) {
        return;
    }

    const actionType = action.type;
    await this[actionType](action.arguments, {
        sequenceContext
    });
} 