/**
 * TODO add description that this is a part of the mixins
 */

const logicalOperators = {
    __and (operations, { sequenceContext}): boolean {

        let result = true;
        const heap = this.heap;
    
        for (const operation of operations) {
            const operationResult = this.resolve(operation, { heap, sequenceContext });
            if (!operationResult) {
                result = false;
                break;
            }
        }
        
        return result;
    },

    __or (operations, {sequenceContext}): boolean {

        let result = true;
        const heap = this.heap;
    
        for (const operation of operations) {
            const operationResult = this.resolve(operation, { heap, sequenceContext });
            if (!operationResult) {
                result = false;
                break;
            }
        }
        
        return result;
    
    }
}

export default logicalOperators;