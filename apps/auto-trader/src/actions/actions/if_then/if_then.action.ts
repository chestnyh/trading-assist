/**
 * TODO add description
 * @param args 
 * @param heap 
 * @param dependencies 
 */

export default function if_then(args, heap, dependencies): void {
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

    if(this[conditionType](conditionArguments, heap, dependencies)) {
        this[thenType](thenArguments, heap, dependencies);
    }

}