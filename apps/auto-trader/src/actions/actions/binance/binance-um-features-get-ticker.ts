import { UMFutures } from "@binance/futures-connector";
import type { ActionError } from '../../types/action-error';

export default async function binance_um_features_get_ticker (
    args: any, 
    {
        sequenceContext
    },
) {
    const {
        symbol,
    } = args;

    if (!symbol) {
        const resultKey = args?.resultKey || 'binance_um_features_get_ticker';
        sequenceContext.set(resultKey, {
            error: { message: 'binance_um_features_get_ticker: "symbol" is required' },
        } satisfies ActionError);
        return;
    }

    let { resultKey } = args;

    if(!resultKey) {
        resultKey = `binance_um_features_get_ticker.${symbol}`;
    }

    try {
        const client = new UMFutures();
        const { data } = await client.getPriceTicker(symbol);
        sequenceContext.set(resultKey, Number(data.price));
    } catch (e) {
        sequenceContext.set(resultKey, {
            error: {
                message: 'binance_um_features_get_ticker: failed to fetch futures ticker from Binance',
                details: e instanceof Error ? { name: e.name, message: e.message, stack: e.stack } : e,
            },
        } satisfies ActionError);
    }
};