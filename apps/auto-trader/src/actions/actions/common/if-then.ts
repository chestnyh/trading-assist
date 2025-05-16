/**
 * Action that executes a 'then' action if a condition is met.
 * @param args 
 * @param param1 
 */
export default function if_then(
    args: any,
    {
        sequenceContext
    }
): void {
    const { 
        if: condition, 
        then 
    } = args;

    const {
        type: conditionType,
        arguments: conditionArguments,
    } = condition;

    const {
        type: thenType,
        arguments: thenArguments,
    } = then;

    if(this[conditionType](
        conditionArguments, 
        { 
            sequenceContext 
        })){   
        this[thenType](
            thenArguments, 
            {
                sequenceContext
            });
    }
} 