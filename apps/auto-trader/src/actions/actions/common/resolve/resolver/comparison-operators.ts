const comparisonOperators = {
    __strict_eq (operands): boolean {
        const [left, right] = operands;
        return this.resolve(left) === this.resolve(right);
    },
    __eq (operands): boolean {   
        const [left, right] = operands;
        return this.resolve(left) == this.resolve(right);
    },
    __neq (operands): boolean {
        const [left, right] = operands;
        console.log(left, right);
        return this.resolve(left) !== this.resolve(right);
    },
    __gt (operands): boolean {
        const [left, right] = operands;    
        return this.resolve(left) > this.resolve(right);
    },
    __gte (operands): boolean {
        const [left, right] = operands;    
        return this.resolve(left) >= this.resolve(right);
    },
    __lt (operands): boolean {
        const [left, right] = operands;
        return this.resolve(left) < this.resolve(right);
    },
    __lte (operands): boolean {
        const [left, right] = operands;    
        return this.resolve(left) <= this.resolve(right);
    },
};

export default comparisonOperators;