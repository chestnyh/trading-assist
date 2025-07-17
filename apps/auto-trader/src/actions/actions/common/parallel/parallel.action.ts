/**
 * Action that executes multiple actions in parallel.
 * 
 * This function allows you to run multiple actions simultaneously instead of sequentially,
 * which can significantly improve performance when actions are independent of each other.
 * All actions will start executing at the same time and the function waits for all of them
 * to complete before proceeding.
 * 
 * @param args - Object containing the parallel execution configuration
 * @param args.do - Array of actions to execute in parallel
 * @param args.do[].type - The type/name of the action to execute
 * @param args.do[].arguments - Arguments to pass to the action
 * @param param1 - Object containing execution context
 * @param param1.sequenceContext - Context object for the current sequence execution
 * @param settings - Global settings object (not used in this function)
 * 
 * @example
 * // Execute multiple API calls in parallel
 * {
 *     "type": "parallel",
 *     "arguments": {
 *         "do": [
 *             {
 *                 // ...do something here in parallel
 *             },
 *             {
 *                 // ...do something here in parallel
 *             },
 *             {
 *                 // ...do something here in parallel
 *             }
 *         ]
 *     }
 * }
 * 
 * @example
 * // Execute logging and notification in parallel
 * {
 *     "type": "parallel",
 *     "arguments": {
 *         "do": [
 *             {
 *                 "type": "log",
 *                 "arguments": {
 *                     "message": "Some log here 1"
 *                 }
 *             },
 *             {
 *                 "type": "telegram_send_message",
 *                 "arguments": {
 *                     "message": "Some log here 2"
 *                 }
 *             }
 *         ]
 *     }
 * }
 */
export default async function parallel(
    args: any,
    {
        sequenceContext,
    }
) {
    const { 
        do: actions,  
    } = args;

    const promises = actions.map(action => {
        const actionType = action.type;
        this[actionType](action.arguments, {
            sequenceContext,
        });
    });

    await Promise.all(promises)
} 