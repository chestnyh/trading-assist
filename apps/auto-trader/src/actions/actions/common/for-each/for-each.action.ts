import ObjectNavigator from '@trading-bot/object-navigator';

import {getValue} from '../../../utils';


/**
 * Iterates over an array and executes a list of actions for each item.
 *
 * For every element, provides `itemContext` so nested actions can reference values via `__item__.*`.
 *
 * @param args - Configuration object
 * @param args.arr - Key/expression that resolves to an array
 * @param args.do - Array of actions to execute for each item
 */
export default async function for_each(
    args: any,
    {
        sequenceContext,
        heap,
    }
): Promise<void> {

    const arrKey = args?.arr ?? args?.array;
    const actions = args?.do;

    const heapNavigator = heap ?? this.heap;

    const arr = getValue(String(arrKey), { heap: heapNavigator, sequenceContext });
    if (!Array.isArray(arr)) {
        return;
    }

    if (!Array.isArray(actions)) {
        return;
    }

    for (const item of arr) {
        const itemContext = new ObjectNavigator(item);
        for (const action of actions) {
            const actionType = action.type;
            await this[actionType](
                action.arguments,
                {
                    sequenceContext,
                    heap: heapNavigator,
                    itemContext,
                }
            );
        }
    }
}