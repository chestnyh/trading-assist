const axios = require('axios');
const createSignature = require('../../authorization/create-signature');

function getQueryString(queryParams) {
    return Object.entries(queryParams).reduce((acc, [name, value]) => acc + `&${name}=${value}`, '').substring(1)
}

/**
 * Method to create order in features
 */
function createOrder ({
    symbol,
    side,
    type,
    quantity,
    timestamp
}, {
    endpoint,
    secretKey,
    apiKey
}) {
    // TODO validation of required params
    const queryString = getQueryString({
        symbol,
        side,
        type,
        quantity,
        timestamp
    });

    endpoint += '?'
    endpoint += queryString;
    endpoint += `&signature= ${createSignature(queryString, secretKey)}`;

    const params = {
        headers: {
            "X-MBX-APIKEY": apiKey
        }
    };

    return axios.post(endpoint, '', params)
}

createOrder({
    symbol: 'BTCUSDT',
    side: 'SELL',
    type: 'MARKET',
    quantity: 0.01,
    timestamp: Date.now()
}, {
    endpoint: 'https://testnet.binancefuture.com/fapi/v1/order',
}).then(res => {
    console.log(res.data);
});

module.exports = createOrder