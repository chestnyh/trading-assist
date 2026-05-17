/**
 * Executes a conditional action based on the result of another action.
 * 
 * This action implements if-then logic by first executing a condition action,
 * and if that action returns a truthy value, it executes the then action.
 * This enables conditional workflows and decision-making in trading strategies.
 * 
 * @param args - Configuration object containing the condition and action to execute
 * @param args.if - The condition action object to evaluate
 * @param args.if.type - The type/name of the condition action
 * @param args.if.arguments - Arguments to pass to the condition action
 * @param args.then - The action object to execute if condition is true
 * @param args.then.type - The type/name of the action to execute
 * @param args.then.arguments - Arguments to pass to the then action
 * @param sequenceContext - Context object for storing and retrieving data between actions
 * @param settings - Global settings object passed to actions
 * 
 * @example
 * // Simple condition: check if price is above threshold, then log
 * {
 *   "type": "if_then",
 *   "arguments": {
 *     "if": {
 *       // ...some action that returns some value, usually a condition
 *     },
 *     "then": {
 *       // ...some action to execute if condition in `if` argument returns true
 *     }
 *   }
 * }
 * 
 * @example
 * // Example checking a value from heap and logging if condition is true
 * {
 *   "type": "if_then",
 *   "arguments": {
 *     "if": {
 *       "type": "condition",
 *       "arguments": {
 *         "condition": {
 *           "__var": "__heap__.some.value.from.heap"
 *         }
 *       }
 *     },
 *     "then": {
 *       "type": "log",
 *       "arguments": {
 *         "message": "Value from heap: ${__heap__.some.value.from.heap}"
 *       }
 *     }
 *   }
 * }
 * 
 * @returns {void} Executes the then action if condition in `if` argument returns true
 */
export default async function if_then(
    args: any,
    {
        sequenceContext
    }
): Promise<void> {

    const { 
        if: operations, 
        then 
    } = args;

    const {
        type: operationType,
        arguments: operationArguments,
    } = operations;

    const operationResult = await this[operationType](
        operationArguments,
        {
            sequenceContext,
        }
    );

    if (!operationResult) {
        return;
    }

    const thenActions = Array.isArray(then) ? then : [then];
    for (const thenAction of thenActions) {
        if (sequenceContext?.get('__stop_sequence__')) {
            break;
        }

        const thenType = thenAction?.type;
        await this[thenType](thenAction?.arguments, {
            sequenceContext,
        });

        if (sequenceContext?.get('__stop_sequence__')) {
            break;
        }
    }
}