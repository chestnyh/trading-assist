import { LinearSetPositionModeRequest } from "bybit-api";
import { CryptocurrencyExchanges } from "../../enums";

interface TradingPairParams {
    code: string;
    currentPrices?: CurrentPrices;
    lastPrices?: LastPrices;
}

interface TradingPairPrice {
    value: number;
    lastUpdateTimestamp: number;
}

interface SetCurrentPriceParams {
    exchange: CryptocurrencyExchanges;
    currentPrice: TradingPairPrice;
}

interface CurrentPrices {
    [exchange: string]: TradingPairPrice;
}

interface LastPrices {
    [exchange: string]: TradingPairPrice[];
}

/**
 * This class is used to represent a trading pair.
 * It is used to manage a trading pair information.
 */
export class TradingPair {

    /**
     * The code of a trading pair. initialized during creation and never changed.
     */
    private readonly _code: string;
    /**
     * The map of current prices on different exchanges.
     */
    private _currentPrices: CurrentPrices;

    /**
     * The map of last prices on different exchanges. 
     * We keep limited history of prices.
     */
    private _lastPrices: LastPrices;

    /**
     * The limit of the last prices items in array.
     */
    private _lastPriceItemsLimit: number = 30;

    constructor(params: TradingPairParams){
        this._code = params.code;
        this._currentPrices = params.currentPrices || {};
        this._lastPrices = params.lastPrices || {};
    }

    get code(): string {
        return this._code;
    }

    get currentPrices(): CurrentPrices {
        return this._currentPrices;
    }

    setCurrentPrices(currentPrices: CurrentPrices) {
        this._currentPrices = currentPrices;
    }

    setCurrentPrice(params: SetCurrentPriceParams) {
        
        const { exchange, currentPrice } = params;
        this._currentPrices[exchange] = currentPrice;
        
        if(!this._lastPrices[exchange]){
            this._lastPrices[exchange] = [currentPrice];
            return;
        }

        const lastPrice = this._lastPrices[exchange][this._lastPrices[exchange].length - 1];
        if(lastPrice.lastUpdateTimestamp !== currentPrice.lastUpdateTimestamp){
            this._lastPrices[exchange].push(currentPrice);
        }

        if(this._lastPrices[exchange].length > this._lastPriceItemsLimit){
            const amountOfItemsToRemove = this._lastPrices[exchange].length - this._lastPriceItemsLimit;
            this._lastPrices[exchange].splice(0, amountOfItemsToRemove);
        }

        

        // if(this._code === "BTCUSDT"){
        //     console.log(this._lastPrices[exchange]);
        // }

    }

}
