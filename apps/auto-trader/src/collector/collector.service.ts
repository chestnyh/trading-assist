import { RestBinanceMarket } from "binance-api";
import { TradingPair } from "./trading-pair";
import { CryptocurrencyExchanges } from "../../enums";

interface TradingPairs {
    [code: string]: TradingPair;
}

export class CollectorService {

    private tradingPairs: TradingPairs = {};
    private restBinanceMarketClient: RestBinanceMarket;
    private tickTime: number = 1000; // TODO make this configurable

    constructor(){
        this.init()
    }

    private updatePrices(exchange: CryptocurrencyExchanges, prices: any){
        prices.forEach((price: any) => {
            if(!this.tradingPairs[price.symbol]){
                this.tradingPairs[price.symbol] = new TradingPair({
                    code: price.symbol,
                    currentPrices: {
                        [exchange]: {
                            value: price.price,
                            lastUpdateTimestamp: price.time
                        }
                    }
                });
                return;
            }
            this.tradingPairs[price.symbol].setCurrentPrice({
                exchange, 
                currentPrice: {
                    value: price.price,
                    lastUpdateTimestamp: price.time
                }})    
        });
    }

    private async init (){
        this.restBinanceMarketClient = new RestBinanceMarket("key", "secret");
        const prices = await this.restBinanceMarketClient.getPrices();
        this.updatePrices(CryptocurrencyExchanges.BINANCE, prices);
        await new Promise(resolve => setTimeout(resolve, this.tickTime));
        while(true){
            await this.tick();
            await new Promise(resolve => setTimeout(resolve, this.tickTime));
        }
    }

    private async tick(){
        const prices = await this.restBinanceMarketClient.getPrices();
        this.updatePrices(CryptocurrencyExchanges.BINANCE, prices);
    }
    
}    
