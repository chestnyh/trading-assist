const arithmeticOperators = {
    __minus(operands): number {
        let [left, right] = operands;
        left = this.resolve(left);
        right = this.resolve(right);
        return left - right;
    },
    __divide(operands): number {
        let [left, right] = operands;
        left = this.resolve(left);
        right = this.resolve(right);
        return left / right;
    },
    __multiply(operands): number {
        const [left, right] = operands;
        return this.resolve(left) * this.resolve(right);
    },
    __plus(operands): number {
        const [left, right] = operands;
        return this.resolve(left) + this.resolve(right);
    },
    __absolute(operands): number {    
        const [value] = operands;
        return Math.abs(this.resolve(value));
    }

};

export default arithmeticOperators;