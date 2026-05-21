/**
 * TODO add description
 * @param valueKey 
 * @param param1 
 * @returns 
 */
export default function getValue(valueKey, { heap, sequenceContext, itemContext }: { heap: any; sequenceContext: any; itemContext?: any }) {
    if (valueKey === undefined || valueKey === null) {
        return valueKey;
    }

    if (typeof valueKey !== 'string') {
        return valueKey;
    }

    if (valueKey.startsWith('__heap__.')) {
        return heap.get(valueKey.replace('__heap__.', ''));
    }

    if (valueKey.startsWith('__sequenceContext__.')) {
        return sequenceContext.get(valueKey.replace('__sequenceContext__.', ''));
    }

    if (valueKey.startsWith('__item__.')) {
        if (!itemContext) return undefined;
        return itemContext.get(valueKey.replace('__item__.', ''));
    }

    return undefined;
}