const WebSocketClient = require('websocket').client;
const logger = require('../logger/index');

class BinanceWebsocketClient {

    #url;
    #wsClient;
    #currentMessage = '';

    constructor({
        url,
    }) {
        this.#url = url,

            this.#wsClient = new WebSocketClient();

        this.#init();
    }

    #init() {

        const _this = this;

        this.#wsClient.on('connectFailed', function (error) {
            logger.log('Connect Error: ' + error.toString());
        });

        this.#wsClient.on('connect', function (connection) {
            logger.log('WebSocket Client Connected');

            connection.on('error', function (error) {
                logger.log("Connection Error: " + error.toString());
            });
            connection.on('close', function () {
                logger.log('Connection Closed');
            });
            connection.on('message', (message) => {
                _this.#currentMessage = message.utf8Data;
            });
        });

        this.#wsClient.on('error', (error) => {
            logger.log(error.toString())
        })


        this.#wsClient.connect(this.#url);

    }

    async getCurrentPrice() {
        const {
            p: price,
            T: timestamp
        } = JSON.parse(this.#currentMessage);
        return {
            price: parseFloat(price),
            timestamp,   
        }
    }

}

module.exports = BinanceWebsocketClient;