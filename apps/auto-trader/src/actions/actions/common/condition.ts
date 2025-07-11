import ConditionResolver from '../../condition-resolver/condition-resolver';

/**
 * Evaluates a conditional expression and returns a boolean result.
 * 
 * This action uses a ConditionResolver to evaluate mathematical and logical
 * expressions, comparing values from the sequence context, heap, or literal values.
 * It supports various operators and can reference data stored by previous actions.
 * 
 * @param args - Configuration object containing the condition to evaluate
 * @param args.condition - The conditional expression to evaluate (e.g., "BTCUSDT > 50000")
 * @param sequenceContext - Context object containing data from previous actions
 * @param settings - Global settings object (not used in this action)
 * 
 * @example
 * // Simple price comparison
 * {
 *   "type": "condition",
 *   "arguments": {
 *     "condition": {
 *       // ... some condition here
 *     }
 *   }
 * }
 * 
 * @returns {boolean} True if the condition evaluates to true, false otherwise
 */
export default function condition(
    args: any,
    {
        sequenceContext
    },
    settings: any
): boolean {
    const {
        condition
    } = args;
    const conditionResolver = new ConditionResolver(condition, this.heap, sequenceContext);
    return conditionResolver.resolve();
} 