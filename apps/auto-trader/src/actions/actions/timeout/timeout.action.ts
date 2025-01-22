/**
 * TODO add description
 * @param args 
 * @param heap 
 * @param dependencies 
 */
export default async function timeout (args: any, heap: any, dependencies: any) {
    
    const { 
        do: action, 
        timeout 
    } = args;

    await new Promise(resolve => setTimeout(resolve, timeout));

    const actionType = action.type;
    await this[actionType](action.arguments, heap, dependencies);
}