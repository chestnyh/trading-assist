import { CryptocurrencyExchanges } from "../../enums";

interface TradingPairParams {
    code: string;
    currentPrices: CurrentPrices;
}

interface TradingPairPrice {
    value: number;
    lastUpdateTimestamp: number;
}

interface SetCurrentPriceParams {
    cryptocurrencyExchange: CryptocurrencyExchanges;
    currentPrice: TradingPairPrice;
}

interface CurrentPrices {
    [exchange: string]: TradingPairPrice;
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

    constructor(params: TradingPairParams){
        this._code = params.code;
        this._currentPrices = params.currentPrices;
    }

    get code(): string {
        return this._code;
    }

    get currentPrices(): CurrentPrices {
        return this._currentPrices;
    }

    set currentPrices(currentPrices: CurrentPrices) {
        this._currentPrices = currentPrices;
    }

    set currentPrice(params: SetCurrentPriceParams) {
        const { cryptocurrencyExchange, currentPrice } = params;
        this._currentPrices[cryptocurrencyExchange] = currentPrice;
    }

}
