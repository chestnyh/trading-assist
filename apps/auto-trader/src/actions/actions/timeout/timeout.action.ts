/**
 * TODO add description
 * @param args 
 * @param heap 
 * @param dependencies 
 */
export default function timeout (args: any, heap: any, dependencies: any) {
    
    const { 
        do: action, 
        timeout 
    } = args;

    setTimeout(() => {
        const actionType = action.type;
        this[actionType](action.arguments, heap, dependencies);
    }, timeout);

}