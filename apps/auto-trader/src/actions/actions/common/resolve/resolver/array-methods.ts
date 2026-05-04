const arrayMethods = {
    __length (arr): number {
        return this.resolve(arr).length;
    }
};

export default arrayMethods;