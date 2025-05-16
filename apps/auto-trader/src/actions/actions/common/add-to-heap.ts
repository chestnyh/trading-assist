import getValue from '../../utils/get-value.util';

/**
 * Action that adds items to the heap storage.
 * @param args 
 * @param param1 
 */
export default function add_to_heap(
    args: any,
    {
        sequenceContext
    }
) {
    const { items } = args;

    items.forEach(item => {
        const { key, value } = item;
        const res = getValue(value, { heap: this.heap, sequenceContext });
        this.heap.set(key, res);
    });
} 