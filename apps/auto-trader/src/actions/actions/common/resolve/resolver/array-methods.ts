const arrayMethods = {
    __length (arr): number {
        const resolved = this.resolve(arr);

        if (resolved == null) {
            return 0;
        }

        if (typeof resolved === 'string' || Array.isArray(resolved)) {
            return resolved.length;
        }

        const maybeLength = (resolved as any)?.length;
        if (typeof maybeLength === 'number') {
            return maybeLength;
        }

        if (typeof resolved === 'object') {
            return Object.keys(resolved).length;
        }

        return 0;
    }
};

export default arrayMethods;