const { WebsocketStream:UMStream } = require("@binance/futures-connector");

console.log(UMStream.prototype)

// Define callbacks for different events
let timeDiff = 0;
let previousTime = 0;

const callbacks = {
    open: () => console.log("Connected with Websocket server"),
    close: () => console.log("Disconnected with Websocket server"),
    message: (data) => console.log(data),
};

// Create a new WebSocket client with the wsURL (Websocket URL) defined
const umWebsocketStreamClient = new UMStream({
    // logger,
    callbacks,
    wsURL: "wss://fstream.binance.com",
});

/** 
 * Stream names is key option here to get informatoin about market
 * pattern is: <symbol>@<informafion details>    
 */

// The Aggregate Trade Streams push trade information that is aggregated for a single taker order.
// const streamName = "bnbusdt@aggTrade";

/** TODO add description here */
// const streamName = "bnbusdt@depth";

/** TODO add description here */
// const streamName = "bnbusdt@kline_1d";

/** TODO add description here */
const streamName = "bnbusdt@markPrice"

// Subscribe to the allMarketMiniTickersStream stream
umWebsocketStreamClient.subscribe(streamName);