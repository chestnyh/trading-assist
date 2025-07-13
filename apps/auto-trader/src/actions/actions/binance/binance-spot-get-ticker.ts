import { Spot } from '@binance/connector';

/**
 * Fetches the current ticker price for a specified trading symbol from Binance.
 * 
 * This action retrieves real-time price information for a given cryptocurrency pair
 * from Binance's public API and stores the result in the sequence context for
 * use by subsequent actions in the trading sequence.
 * 
 * @param args - Configuration object containing the trading symbol
 * @param args.symbol - The trading symbol/pair to get ticker data for (e.g., "BTCUSDT", "ETHUSDT")
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
 * @returns {Promise<void>} Stores the price data in sequenceContext under the symbol key
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

    const client = new Spot();
    const { data } = await client.tickerPrice(symbol);
    sequenceContext.set(symbol, data.price);
};