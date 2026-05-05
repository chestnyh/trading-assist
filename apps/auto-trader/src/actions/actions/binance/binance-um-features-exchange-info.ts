import { UMFutures } from "@binance/futures-connector";
import type { ActionError } from '../../types/action-error';

export default async function binance_um_features_list_of_coins (
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