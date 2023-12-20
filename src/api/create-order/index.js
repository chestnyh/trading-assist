const axios = require('axios');
const createSignature = require('../../authorization/create-signature');

let queryArray = [
    {
        name: "symbol",
        value: "BTCUSDT"
    },
    // {
    //     name: "stopPrice",
    //     value: "38000"
    // },
    {
        name: "side", 
        value: "SELL"
    },
    {
        name: "type",
        value: "MARKET"
    },
    {
        name: "quantity",
        value: 0.01
    },
    {
        name: "timestamp",
        value: Date.now()
    }
];

function setValue (key, newValue) {

    return queryArray.map(({name, value}) => ({name, value: name === key ? newValue : value})) 

}

function addValue(name, value){
    queryArray.push({name, value})
}


async function createOrder(queryArray){

    const queryString = queryArray.reduce((acc, {name, value}) => acc + `&${name}=${value}`, '').substring(1)

    let testEndpoint = 'https://testnet.binancefuture.com/fapi/v1/order'
    testEndpoint += '?';
    testEndpoint += queryString 
    testEndpoint += `&signature= ${createSignature(queryString, secretKey)}`


    const params = {
        headers: {
            "X-MBX-APIKEY": apiKey
        }
    };

    return axios.post(testEndpoint, '', params)

}

const main = async () => {

    const positionOrder = await createOrder(queryArray);

    console.log(positionOrder.status, positionOrder.data);

    queryArray = setValue("side", 'BUY');
    queryArray = setValue("type", 'TAKE_PROFIT_MARKET');
    addValue("stopPrice", 37000)

    const takeProfit = await createOrder(queryArray);

    console.log(takeProfit.status, takeProfit.data);

    queryArray = setValue("type", 'STOP_MARKET');
    queryArray = setValue("stopPrice", 38000);

    const stopMarket = await createOrder(queryArray)

    console.log(stopMarket.status, stopMarket.data);

}

main();
