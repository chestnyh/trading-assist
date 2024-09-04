/**
 * This methods gets price of provided code pair
 * @param {*} umFuturesClient - 
 * @param {String} code - pair code
 * @return {number} - current price
 */
const getCurrentPrice = async (umFuturesClient, code) => {
    const { price } = (await umFuturesClient.getPriceTicker(code)).data;
    return price
}

export default getCurrentPrice;