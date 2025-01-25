/**
 * TODO add description
 * @param args 
 * @param heap 
 * @param dependencies 
 */
export default function interval (
    args: any, 
    { 
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
        });
    }, interval);
}