async function getActivePositions(client) {
    const {data} = await client.getPositionInformationV2();

    return data.filter(item => {
        const positionAmount = parseFloat(item.positionAmt);

        return positionAmount > 0 || positionAmount < 0;
    } );
}

export default getActivePositions;