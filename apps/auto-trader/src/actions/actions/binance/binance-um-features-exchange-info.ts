import { UMFutures } from "@binance/futures-connector";

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

    const client = new UMFutures();
    const { data } = await client.getExchangeInfo();
    sequenceContext.set(resultKey, data);
};