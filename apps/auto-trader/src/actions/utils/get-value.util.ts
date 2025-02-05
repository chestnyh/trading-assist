/**
 * TODO add description
 * @param valueKey 
 * @param param1 
 * @returns 
 */
export default function getValue (valueKey, {heap, sequenceContext}) {
    if (valueKey.startsWith('__heap__.')) {
        return heap.get(valueKey.replace('__heap__.', ''));
    } else if (valueKey.startsWith('__sequenceContext__.')) {
        return sequenceContext[valueKey.replace('__sequenceContext__.', '')];
    }
    return undefined;
}