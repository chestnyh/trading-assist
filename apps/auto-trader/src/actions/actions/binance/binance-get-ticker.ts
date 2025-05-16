import { Spot } from '@binance/connector';

/**
 * TODO add description
 * @param args 
 * @param param1 
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

    const client = new Spot();
    const { data } = await client.tickerPrice(symbol);
    sequenceContext.set(symbol, data.price);
};