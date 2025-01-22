/**
 * TODO add description
 * @param args 
 * @param heap 
 * @param dependencies 
 */
export default async function sequence (args: any, heap: any, dependencies: any) {
    
    const { 
        do: actions,  
    } = args;

    for(let action of actions){
        const actionType = action.type;
        await this[actionType](action.arguments, heap, dependencies);
    }

}