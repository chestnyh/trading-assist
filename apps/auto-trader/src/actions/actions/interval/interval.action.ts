/**
 * TODO add description
 * @param args 
 * @param heap 
 * @param dependencies 
 */
export default function interval (args: any, heap: any, dependencies: any) {
    const { 
        do: action, 
        interval 
    } = args;
    setInterval(() => {
        const actionType = action.type;
        this[actionType](action.arguments, heap, dependencies);
    }, interval);
}