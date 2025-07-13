/**
 * TODO add description that this is a part of the mixins
 */

const logicalOperators = {
    __and (operands): boolean {
        let result = true;
        for (const operand of operands) {
            const operandResult = this.resolve(operand);
            if (!operandResult) {
                result = false;
                break;
            }
        }
        return result;
    },

    __or (operands): boolean {
        let result = false;
        for (const operand of operands) {
            const operandResult = this.resolve(operand);
            if (operandResult) {
                result = true;
                break;
            }
        }
        return result;
    }
}

export default logicalOperators;