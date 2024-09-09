const { UMFutures } = require("@binance/futures-connector");

interface Price {
    price: number;
    symbol: string;
    time: number;
}

export class RestBinanceMarket {

    private client: typeof UMFutures;

    constructor(apiKey: string, apiSecret: string) {
        this.client = new UMFutures(apiKey, apiSecret);
    }

    /**
     * Get price of a pair
     * @param pair - pair of a currency
     * @returns price of a pair
     */
    public async getPrice(pair: string): Promise<Price> {
        const { data } = await this.client.getPriceTickerV2(pair);
        if(data.price){
            data.price = parseFloat(data.price);
        }
        return data;
    }

    /**
     * Get prices of all pairs
     * @returns 
     */
    public async getPrices(): Promise<Price[]> {
        const { data } = await this.client.getPriceTickerV2();
        return data.map((price: any): Price => {
            price.price = parseFloat(price.price);
            return price;
        });
    }

}