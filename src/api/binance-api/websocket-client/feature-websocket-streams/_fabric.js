import BinanceWsClient from './binance-ws-client.js';

function fabric ({code = '', informationDetails = ''}){

    let streamName = (code) ? `${code.toLowerCase()}@` : '';

    streamName = `${streamName}${informationDetails}` 

    return new BinanceWsClient({
        wsURL: "wss://fstream.binance.com",
        streamName
    });
}

export default fabric;