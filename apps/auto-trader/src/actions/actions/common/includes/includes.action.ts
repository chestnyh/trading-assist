import {getValue} from '../../../utils';

/**
 * Checks whether an array includes a value.
 *
 * Resolves both `arr` and `check` using `getValue`, then evaluates `arr.includes(check)`.
 *
 * @param args - Configuration object
 * @param args.arr - Key/expression that resolves to an array
 * @param args.check - Value/key/expression to check for
 * @param args.saveTo - Optional key to store boolean result in `sequenceContext`
 */
export default function includes(
    args: any,
    {
        sequenceContext,
        itemContext,
    }: {
        sequenceContext: any;
        itemContext?: any;
    },
): boolean {
    const { arr, check, saveTo } = args;

    const resolvedArr = getValue(String(arr), { heap: this.heap, sequenceContext, itemContext });
    const checkValue = getValue(check, { heap: this.heap, sequenceContext, itemContext });

    const result = Array.isArray(resolvedArr) ? resolvedArr.includes(checkValue) : false;

    if (saveTo) {
        sequenceContext.set(String(saveTo), result);
    }

    return result;
}
