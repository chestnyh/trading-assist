/**
 * This methods gets price of provided code pair
 * @param {*} umFuturesClient - 
 * @param {String} code - pair code
 * @return {number} - current price
 */
const getKlines = async (umFuturesClient, {code, period, amount}) => {
    const response = await umFuturesClient.getMarkPriceKlines(code, period, null, null, amount);
    return response.data.map(item => ({
        openTime: parseFloat(item[0]),
        open: parseFloat(item[1]),
        high: parseFloat(item[2]),
        low: parseFloat(item[3]),
        close: parseFloat(item[4]),
        closeTime: parseFloat(item[6]),
    }))
}

module.exports = getKlines;