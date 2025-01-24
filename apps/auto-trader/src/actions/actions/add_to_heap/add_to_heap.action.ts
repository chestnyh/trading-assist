/**
 * TODO add description
 * @param args 
 * @param heap 
 * @param dependencies 
 * @returns 
 */
export default function add_to_heap (
    args: any, 
    {
        heap, 
        dependencies, 
        sequenceContext
    }
) {
    console.log(sequenceContext);
    console.log(heap);
    const {
        items
    } = args;

    items.forEach(item => {
        const { key, value } = item;
        heap[key] = value;
    });

};
