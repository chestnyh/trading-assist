import { UMFutures } from "@binance/futures-connector";
import type { ActionError } from '../../types/action-error';

/**
 * Fetches Binance UM futures exchange info and stores it in `sequenceContext`.
 *
 * @param args - Configuration object
 * @param args.resultKey - Optional key under which the result will be stored in `sequenceContext`.
 * Defaults to `binance_um_features_exchange_info`.
 * @param sequenceContext - Context object for storing and retrieving data between actions
 */
export default async function binance_um_features_exchange_info (
    args: any, 
    {
        sequenceContext
    },
) {

    let { resultKey } = args;

    if(!resultKey) {
        resultKey = `binance_um_features_exchange_info`;
    }

    try {
        const client = new UMFutures();
        const { data } = await client.getExchangeInfo();
        sequenceContext.set(resultKey, data);
    } catch (e) {
        sequenceContext.set(resultKey, {
            error: {
                message: 'binance_um_features_exchange_info: failed to fetch exchange info from Binance',
                details: e instanceof Error ? { name: e.name, message: e.message, stack: e.stack } : e,
            },
        } satisfies ActionError);
    }
};