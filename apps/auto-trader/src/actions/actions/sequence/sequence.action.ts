/**
 * TODO add description
 * @param args 
 * @param heap 
 * @param dependencies 
 */
export default async function sequence (
    args: any) {

    const sequenceContext = {};
    
    const { 
        do: actions,  
    } = args;

    for(let action of actions){
        const actionType = action.type;
        await this[actionType](
            action.arguments, 
            {
                sequenceContext
            });
    }

}