import { UMFutures } from "@binance/futures-connector";

export default async function binance_um_features_get_ticker (
    args: any, 
    {
        sequenceContext
    },
) {
    const {
        symbol,
    } = args;

    let { resultKey } = args;

    if(!resultKey) {
        resultKey = `binance_um_features_get_ticker.${symbol}`;
    }

    const client = new UMFutures();
    const { data } = await client.getPriceTicker(symbol);
    sequenceContext.set(resultKey, data.price);
};