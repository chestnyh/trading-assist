/**
 * TODO add description
 * @param args 
 * @param heap 
 * @param dependencies 
 */
export default function interval (
    args: any, 
    {
        heap, 
        dependencies, 
        sequenceContext
    }) {
    const { 
        do: action, 
        interval 
    } = args;
    setInterval(() => {
        const actionType = action.type;
        this[actionType](action.arguments, {
            sequenceContext,
            heap,
            dependencies
        });
    }, interval);
}