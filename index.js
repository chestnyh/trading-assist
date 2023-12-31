const BinancePriceClient = require('./src/clients/binance.price.client');
const SimpleStrategy = require('./src/stratedies/simple.strategy');

const priceClient = new BinancePriceClient({
    url: 'wss://fstream.binance.com/ws/btcusdt@aggTrade'
});

const sS = new SimpleStrategy({
    priceClient
});

sS.run()