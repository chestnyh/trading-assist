/**
 * TODO add description
 * @param args 
 * @param heap 
 * @param dependencies 
 */

export default function if_then(
    args: any, 
    {
        sequenceContext
    }): void {
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