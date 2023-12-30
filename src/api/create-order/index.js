const axios = require('axios');
const createSignature = require('../../authorization/create-signature');
const config = require("../../../config");

const SECRET_KEY = config.SECRET_KEY;
const API_KEY = config.API_KEY;


async function createOrder(queryArray){

    const queryString = queryArray.reduce((acc, {name, value}) => acc + `&${name}=${value}`, '').substring(1)

    let testEndpoint = 'https://testnet.binancefuture.com/fapi/v1/order'
    testEndpoint += '?';
    testEndpoint += queryString 
    testEndpoint += `&signature= ${createSignature(queryString, SECRET_KEY)}`


    const params = {
        headers: {
            "X-MBX-APIKEY": API_KEY
        }
    };

    return axios.post(testEndpoint, '', params)

}

module.exports = createOrder

// const main = async () => {

//     const positionOrder = await createOrder(queryArray);

//     console.log(positionOrder.status, positionOrder.data);

//     queryArray = setValue("side", 'BUY');
//     queryArray = setValue("type", 'TAKE_PROFIT_MARKET');
//     addValue("stopPrice", 37000)

//     const takeProfit = await createOrder(queryArray);

//     console.log(takeProfit.status, takeProfit.data);

//     queryArray = setValue("type", 'STOP_MARKET');
//     queryArray = setValue("stopPrice", 38000);

//     const stopMarket = await createOrder(queryArray)

//     console.log(stopMarket.status, stopMarket.data);

// }

// main();
