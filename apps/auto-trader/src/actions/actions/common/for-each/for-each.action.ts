import ObjectNavigator from '@trading-bot/object-navigator';

import getValue from '../../../utils/get-value.util';


export default async function for_each(
    args: any,
    {
        sequenceContext,
        heap,
    }
): Promise<void> {

    const arrKey = args?.arr ?? args?.array;
    const actions = args?.do;

    const arr = getValue(String(arrKey), { heap, sequenceContext });
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
                    heap,
                    itemContext,
                }
            );
        }
    }
}