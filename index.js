const WebSocketClient = require('./src/coin-follower/clients/websocket-client');
const WebFollowerSocketClient = require('./src/coin-follower/index');
const SimpleStrategy = require('./src/stratedies/simple.strategy');

const websocket = new WebSocketClient({
    url: 'wss://fstream.binance.com/ws/btcusdt@aggTrade'
})

const wfsk = new WebFollowerSocketClient({
    client: websocket
})

const sS = new SimpleStrategy({
    coinFollower: wfsk
});

sS.run()