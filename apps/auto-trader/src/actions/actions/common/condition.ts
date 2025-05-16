import ConditionResolver from '../../condition-resolver/condition-resolver';

/**
 * Action that evaluates a condition and returns its result.
 * @param args 
 * @param param1 
 * @returns boolean
 */
export default function condition(
    args: any,
    {
        sequenceContext
    }
): boolean {
    const {
        condition
    } = args;

    const conditionResolver = new ConditionResolver(condition, this.heap, sequenceContext);

    return conditionResolver.resolve();
} 