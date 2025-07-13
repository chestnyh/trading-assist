const comparisonOperators = {
    __strict_eq (operands): boolean {
        let [left, right] = operands;
        return this.resolve(left) === this.resolve(right);
    },
    __eq (operands): boolean {   
        let [left, right] = operands;
        return this.resolve(left) == this.resolve(right);
    },
    __gt (operands): boolean {
        let [left, right] = operands;    
        return this.resolve(left) > this.resolve(right);
    },
    __gte (operands): boolean {
        let [left, right] = operands;    
        return this.resolve(left) >= this.resolve(right);
    },
    __lt (operands): boolean {
        let [left, right] = operands;
        return this.resolve(left) < this.resolve(right);
    },
    __lte (operands): boolean {
        let [left, right] = operands;    
        return this.resolve(left) <= this.resolve(right);
    },
};

export default comparisonOperators;