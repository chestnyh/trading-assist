import comparisonOperators from "./comparison-operators";
import fetchOperators from "./fetch-operators";
import arithmeticOperators from "./arithmetic-operators";
import logicalOperators from "./logical-operators";

class Resolver {
    
    constructor(
        private operators,
        private heap,
        private sequenceContext
    ){}

    resolve( operators? ): boolean { // TODO add type to the argument

        if (!operators){
            return this.resolve(this.operators); 
        }

        const [operator] = Object.keys(operators);

        if (this[operator]){
            return this[operator](operators[operator]);
        }
    
        throw new Error(`Unknown operator: ${operator}`);
    }

}

// Operator mixins to the ConditionResolver class.
Object.assign(Resolver.prototype, comparisonOperators);
Object.assign(Resolver.prototype, fetchOperators);
Object.assign(Resolver.prototype, arithmeticOperators);
Object.assign(Resolver.prototype, logicalOperators);

export default Resolver;