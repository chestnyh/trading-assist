import comparisonOperators from "./comparison-operators";
import fetchOperators from "./fetch-operators";
import arithmeticOperators from "./arithmetic-operators";
import logicalOperators from "./logical-operators";

class ConditionResolver {
    
    constructor(
        private conditions,
        private heap,
        private sequenceContext
    ){}

    resolve( conditions? ): boolean { // TODO add type to the argument

        if (!conditions){
            return this.resolve(this.conditions); 
        }

        const [operator] = Object.keys(conditions);

        if (this[operator]){
            return this[operator](conditions[operator]);
        }
    
        throw new Error(`Unknown operator: ${operator}`);
    }

}

// Operator mixins to the ConditionResolver class.
Object.assign(ConditionResolver.prototype, comparisonOperators);
Object.assign(ConditionResolver.prototype, fetchOperators);
Object.assign(ConditionResolver.prototype, arithmeticOperators);
Object.assign(ConditionResolver.prototype, logicalOperators);

export default ConditionResolver;