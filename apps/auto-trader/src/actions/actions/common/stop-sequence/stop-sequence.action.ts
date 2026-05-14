/**
 * Stops the execution of the enclosing `sequence` (or `if_then` then-block) immediately.
 *
 * Sets a `__stop_sequence__` flag on the shared `sequenceContext`. The `sequence` and
 * `if_then` actions check this flag before each step and break out of their loop when
 * it is set, so no further actions in that sequence will run.
 *
 * This action takes no meaningful arguments.
 *
 * @param sequenceContext - The shared context object for the current sequence run.
 *
 * @example
 * // Stop a sequence early when a condition is met
 * {
 *   "type": "sequence",
 *   "arguments": {
 *     "do": [
 *       {
 *         "type": "if_then",
 *         "arguments": {
 *           "if": {
 *             "type": "condition",
 *             "arguments": {
 *               "condition": { "__var": "__heap__.shouldStop" }
 *             }
 *           },
 *           "then": { "type": "stop_sequence", "arguments": {} }
 *         }
 *       },
 *       {
 *         "type": "log",
 *         "arguments": { "message": "This will not run if shouldStop is true" }
 *       }
 *     ]
 *   }
 * }
 */
export default function stop_sequence(
    _args: any,
    {
        sequenceContext,
    }: {
        sequenceContext?: { set: (key: string, data: any) => void };
    } = {}
): void {
    if (sequenceContext && typeof sequenceContext.set === 'function') {
        sequenceContext.set('__stop_sequence__', true);
    }
}
