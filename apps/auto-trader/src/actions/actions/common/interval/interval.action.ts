/**
 * Executes an action at specified intervals using setInterval.
 * 
 * This action allows you to schedule recurring execution of other actions
 * at regular time intervals. The action will continue running until the
 * sequence context is destroyed or the interval is cleared.
 * 
 * @param args - Configuration object containing the action to execute and interval timing
 * @param args.do - The action object to execute on each interval
 * @param args.do.type - The type/name of the action to execute
 * @param args.do.arguments - Arguments to pass to the action
 * @param args.interval - Time interval in milliseconds between executions
 * @param heap - Shared data storage accessible across actions
 * @param sequenceContext - Context object containing action execution methods
 * 
 * @example
 * // Execute a "log" action every 5 seconds
 * {
 *   "type": "interval",
 *   "arguments": {
 *     "do": {
 *          // ...do something here in interval
 *       }
 *     },
 *     "interval": 5000
 *   }
 * }
 *  
 * @example
 * // Execute a "log" action every 5 seconds
 * {
 *   "type": "interval",
 *   "arguments": {
 *     "do": {
 *         "type": "log",
 *         "arguments": {
 *             "message": "Some log here"
 *         }
 *     },
 *     "interval": 5000
 */
export default function interval(
    args: any,
    {
        sequenceContext,
        heap,
    },
) {
    const {
        do: action,
        interval
    } = args;

    const id = setInterval(() => {
        const actionType = action.type;
        this[actionType](action.arguments, {
            sequenceContext,
            heap
        });
    }, interval);

    this.addDisposer(() => clearInterval(id));
}