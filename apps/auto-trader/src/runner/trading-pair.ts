// import { Injectable } from '@nestjs/common';
import { RestBinanceMarket } from "binance-api";

interface TradingPairParams {
    code: string; // TODO add description;
    price: number; // TODO add description;
    restBinanceMarketClient: RestBinanceMarket // TODO add description 
}

/**
 * This class is used to represent a trading pair.
 * It is used to manage a trading pair information.
 */
export class TradingPair {

    private code;
    private price: number;
    private isInformationFetched: boolean;
    private currentPrice; // Shows a current price of a pair
    private restBinanceMarketClient: RestBinanceMarket;

    constructor(params: TradingPairParams){
        this.code = params.code;
        this.price = 0;
        this.restBinanceMarketClient = params.restBinanceMarketClient || new RestBinanceMarket("key", "secret");
    }

    static async create(code: string): Promise<TradingPair>{
        const restBinanceMarketClient = new RestBinanceMarket("key", "secret");
        const result = await restBinanceMarketClient.getPrice(code);
        console.log(result);
        return new TradingPair({code, restBinanceMarketClient, price: result.price});
    }

    private async fetchInformation(){
        const result = await this.restBinanceMarketClient.getPrice(this.code);
        console.log(result);
    }
}
