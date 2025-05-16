import ObjectNavigator from 'libs/object-navigator/src/lib/object-navigator';

/**
 * Action that executes multiple actions in sequence.
 * @param args 
 * @param param1 
 */
export default async function sequence(
    args: any,
    {
        heap
    }
) {
    const sequenceContext = new ObjectNavigator();
    
    const { 
        do: actions,  
    } = args;

    for(let action of actions){
        const actionType = action.type;
        await this[actionType](
            action.arguments, 
            {
                sequenceContext,
                heap
            });
    }
} 