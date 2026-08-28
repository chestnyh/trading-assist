import { Spot } from '@binance/connector';
import type { ActionError } from '../../types/action-error';

/**
 * Fetches the current ticker price for a specified trading symbol from Binance.
 * 
 * This action retrieves real-time price information for a given cryptocurrency pair
 * from Binance's public API and stores the result in the sequence context for
 * use by subsequent actions in the trading sequence.
 * 
 * @param args - Configuration object containing the trading symbol
 * @param args.symbol - The trading symbol/pair to get ticker data for (e.g., "BTCUSDT", "ETHUSDT")
 * @param args.resultKey - Optional key under which the result will be stored in `sequenceContext`.
 * Defaults to `binance_spot_get_ticker.<symbol>`.
 * @param sequenceContext - Context object for storing and retrieving data between actions
 * 
 * @example
 * // Get current price for Bitcoin/USDT pair
 * {
 *   "type": "binance_spot_get_ticker",
 *   "arguments": {
 *     "symbol": "BTCUSDT"
 *   }
 * }
 *
 * @example
 * // Store under explicit resultKey
 * {
 *   "type": "binance_spot_get_ticker",
 *   "arguments": {
 *     "symbol": "BTCUSDT",
 *     "resultKey": "spotPrice"
 *   }
 * }
 * 
 * @returns {Promise<void>} Stores the price (number) in sequenceContext under resultKey. On error stores { error: { message, details? } }.
 */
export default async function binance_spot_get_ticker (
    args: any, 
    {
        sequenceContext
    }
) {
    const {
        symbol
    } = args;

    if (!symbol) {
        const resultKey = args?.resultKey || 'binance_spot_get_ticker';
        sequenceContext.set(resultKey, {
            error: { message: 'binance_spot_get_ticker: "symbol" is required' },
        } satisfies ActionError);
        return;
    }

    let { resultKey } = args;
    if (!resultKey) {
        resultKey = `binance_spot_get_ticker.${symbol}`;
    }

    try {
        const client = new Spot();
        const { data } = await client.tickerPrice(symbol);
        sequenceContext.set(resultKey, Number(data.price));
    } catch (e) {
        sequenceContext.set(resultKey, {
            error: {
                message: 'binance_spot_get_ticker: failed to fetch ticker from Binance',
                details: e instanceof Error ? { name: e.name, message: e.message, stack: e.stack } : e,
            },
        } satisfies ActionError);
    }
}