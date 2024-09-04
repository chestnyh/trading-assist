import fabric from './_fabric.js';

/**
 * Returns client to get all market price information
 * Information will be returned as an array of all pair 
 * information is item format:
 * [{
 *  "e": "markPriceUpdate",     // Event type
 *  "E": 1562305380000,         // Event time
 *  "s": "BTCUSDT",             // Symbol
 *  "p": "11185.87786614",      // Mark price TODO add information what is mark price
 *  "i": "11784.62659091"       // Index price TODO add information what is index price
 *  "P": "11784.25641265",      // Estimated Settle Price, only useful in the last hour before the settlement starts TODO add information about this
 *  "r": "0.00030000",          // Funding rate TODO add information about this
 *  "T": 1562306400000          // Next funding time TODO add information about this
  * }]
 * @param {*} interval - interval to receive information 
 * @returns 
 */

const allMarketPriceTime = (interval = '') => {
    return fabric({informationDetails: `!markPrice@arr@${interval}`})
}

export default allMarketPriceTime;