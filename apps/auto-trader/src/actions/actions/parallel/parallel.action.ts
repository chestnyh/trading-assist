/**
 * TODO add description
 * @param args 
 * @param heap 
 * @param dependencies 
 */
export default async function parallel (
    args: any, 
    {
        sequenceContext,
    }) {
    
    const { 
        do: actions,  
    } = args;

    const promises = actions.map(action => {
        const actionType = action.type;
        this[actionType](action.arguments, {
            sequenceContext,
        });
    });

    await Promise.all(promises)
}