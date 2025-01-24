/**
 * TODO add description
 * @param args 
 * @param heap 
 * @param dependencies 
 */
export default async function sequence (
    args: any, 
    {
        heap, 
        dependencies
    }) {

    const sequenceContext = {};

    console.log(heap);
    
    const { 
        do: actions,  
    } = args;

    for(let action of actions){
        const actionType = action.type;
        await this[actionType](
            action.arguments, 
            {
                heap, 
                dependencies, 
                sequenceContext
            });
    }

}