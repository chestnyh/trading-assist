/**
 * Action that executes multiple actions in parallel.
 * @param args 
 * @param param1 
 */
export default async function parallel(
    args: any,
    {
        sequenceContext,
    }
) {
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