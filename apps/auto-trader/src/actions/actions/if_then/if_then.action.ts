/**
 * TODO add description
 * @param args 
 * @param heap 
 * @param dependencies 
 */

export default function if_then(
    args: any, 
    {
        heap, 
        dependencies,
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
            heap, 
            dependencies, 
            sequenceContext 
        })){ 
        this[thenType](
            thenArguments, 
            {
                heap, 
                dependencies, 
                sequenceContext});
    }

}