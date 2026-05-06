import getValue from '../../../utils/get-value.util';

/**
 * Action that adds items to the heap storage.
 * 
 * This action takes an array of items and adds them to the heap storage.
 * The heap storage is a key-value store that persists data during the execution of sequences.
 * Each item must have a key and value property, where the value can reference sequence context
 * or existing heap values.
 * 
 * @param args - Configuration object containing items to add
 * @param args.items - Array of objects with key and value properties
 * @param param1 - Context object containing sequence information
 * @param param1.sequenceContext - Context containing data from previous actions
 * @param settings - Additional settings for the action
 * 
 * @example
 * // Add a single value from sequence context
 * {
 *   "type": "add_to_heap",
 *   "arguments": {
 *     "items": [
 *       {
 *         "key": "key.to.add",
 *         "value": "__sequenceContext__.value.to.add"
 *       }
 *     ]
 *   }
 * }
 */
export default function add_to_heap(
    args: any,
    {
        sequenceContext,
        itemContext,
    },
) {
    const { items } = args;

    items.forEach(item => {
        const { key, value } = item;
        const res = getValue(value, { heap: this.heap, sequenceContext, itemContext });

        if (typeof key === 'string' && key.endsWith('.[]')) {
            const baseKey = key.slice(0, -3);
            const prev = this.heap.get(baseKey);
            const next = Array.isArray(prev) ? [...prev, res] : [res];
            this.heap.set(baseKey, next);
            return;
        }

        this.heap.set(key, res);
    });
} 