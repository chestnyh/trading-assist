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
        sequenceContext
    }
) {

    const {
        items
    } = args;

    items.forEach(item => {
        const { key, value } = item;
        this.heapService[key] = value;
    });

};
