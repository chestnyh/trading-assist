/**
 * TODO add description
 * @param args 
 * @param heap 
 * @param dependencies 
 * @returns 
 */
export default async function binance_get_ticker (
    args: any, 
    {
        sequenceContext
    }
) {
    const {
        symbol
    } = args;

    // TODO add function logic.

    sequenceContext[symbol] = 100000;

};
