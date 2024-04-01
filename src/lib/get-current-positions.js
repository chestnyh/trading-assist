/**
 * This methods gets the current open positions
 * @param {*} symbol 
 * @param {*} type 
 * @param {*} quantity 
 */
const getCurrentPositions = async (umFuturesClient) => {
    const positoionsResults = await umFuturesClient.getPositionInformationV2({});
    const positions = positoionsResults.data;
    return positions.filter(position => {
        if (parseFloat(position.positionAmt) > 0) {
            console.log(position)
        }
    });
}

modile.exports = getCurrentPositions;