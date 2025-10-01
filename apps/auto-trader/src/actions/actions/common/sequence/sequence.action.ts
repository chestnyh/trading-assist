import ObjectNavigator from 'libs/object-navigator/src/lib/object-navigator';

/**
 * Executes multiple actions in sequence, passing data between them.
 * 
 * This action allows you to chain multiple actions together, executing them
 * one after another in the specified order. Each action can access data
 * from previous actions through the shared sequenceContext, enabling complex
 * workflows and data processing pipelines.
 * 
 * @param args - Configuration object containing the actions to execute
 * @param args.do - Array of action objects to execute in sequence
 * @param args.do[].type - The type/name of each action
 * @param args.do[].arguments - Arguments to pass to each action
 * @param heap - Shared data storage accessible across all actions
 * @param settings - Global settings object passed to all actions
 * 
 * @example
 * // Simple sequence: get price, log it, then check condition
 * {
 *   "type": "sequence",
 *   "arguments": {
 *     "do": [
 *       {
 *         "type": "binance_get_ticker",
 *         "arguments": {
 *           "symbol": "BTCUSDT"
 *         }
 *       },
 *       {
 *         "type": "log",
 *         "arguments": {
 *           "message": "Current BTC price: ${__sequenceContext__.BTCUSDT}"
 *         }
 *       }
 *     ]
 *   }
 * }
 * @returns {Promise<void>} Executes all actions in sequence
 */
export default async function sequence(
    args: any,
    {
        heap
    },
    settings: any
) {
    const sequenceContext = new ObjectNavigator();
    
    const { 
        do: actions,  
    } = args;

    for(const action of actions){
        const actionType = action.type;
        await this[actionType](
            action.arguments, 
            {
                sequenceContext,
                heap
            }
        );
    }
} 