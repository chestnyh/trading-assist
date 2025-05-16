/**
 * Action that removes items from the heap storage.
 * @param args 
 * @param param1 
 */
export default function delete_from_heap(
    args: any,
    {
        sequenceContext
    }
) {
    const { keys } = args;
    keys.forEach(key => {
        this.heap.delete(key);
    });
} 