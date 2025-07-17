/**
 * Action that removes items from the heap storage.
 * 
 * This action takes an array of keys and removes the corresponding items from the heap storage.
 * The heap storage is a key-value store that persists data during the execution of sequences.
 * @param args - Object containing array of keys to delete
 * @param args.keys - Array of string keys to remove from heap
 * @param param1 - Context object containing sequence information
 * @param settings - Additional settings for the action
 * @example
 * // Delete a single key
 * {
 *   "type": "delete_from_heap",
 *   "arguments": {
 *     "keys": [
 *       "some.value.key.to.delete"
 *     ]
 *   }
 * }
 */
export default function delete_from_heap(
    args: any,
) {
    const { keys } = args;
    keys.forEach(key => {
        this.heap.delete(key);
    });
} 