import getValue from '../../../utils/get-value.util';

export default function includes(
    args: any,
    {
        sequenceContext,
        itemContext,
    }: {
        sequenceContext: any;
        itemContext?: any;
    },
): boolean {
    const { arr, check, compareKey, saveTo } = args;

    const resolvedArr = getValue(String(arr), { heap: this.heap, sequenceContext, itemContext });

    let result = false;

    if (!Array.isArray(resolvedArr)) {
        result = false;
    } else if (compareKey) {
        const key = String(compareKey);
        const checkValue = getValue(check, { heap: this.heap, sequenceContext, itemContext });
        const checkStr = checkValue === undefined || checkValue === null ? undefined : String(checkValue);

        result = resolvedArr.some((v) => {
            if (!v || typeof v !== 'object') return false;
            const k = (v as any)[key];
            if (k === undefined || k === null) return false;
            if (checkStr === undefined) return false;
            return String(k) === checkStr;
        });
    } else {
        const checkValue = getValue(check, { heap: this.heap, sequenceContext, itemContext });
        result = resolvedArr.includes(checkValue);
    }

    if (saveTo) {
        sequenceContext.set(String(saveTo), result);
    }

    return result;
}
