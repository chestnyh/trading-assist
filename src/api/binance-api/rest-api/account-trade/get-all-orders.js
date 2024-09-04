async function getAllOrders(client, symbol, options) {
    const {data} = await client.getAllOrders(symbol, options);
    console.log(data)
}

export default getAllOrders;