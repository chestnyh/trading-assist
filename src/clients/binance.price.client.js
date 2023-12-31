const WebSocketClient = require('websocket').client;
const logger = require('../logger/index');

class BinanceWebsocketClient {

    #url;
    #wsClient;
    #currentMessage = '';
    #connection = null;

    constructor({
        url,
    }) {
        this.#url = url,

        this.#init();
    }

    set connection(connection){
        this.#connection = connection;
    }

    #connect(){

        this.#wsClient = new WebSocketClient();

        const _this = this;

        this.#wsClient.on('connectFailed', function (error) {
            logger.log('Connect Error: ' + error.toString());
        });

        this.#wsClient.on('connect', (connection) => {
            logger.log('WebSocket Client Connected');

            _this.connection = connection;

            connection.on('error', function (error) {
                logger.log("Connection Error: " + error.toString());
            });
            connection.on('close', function () {
                logger.log('Connection Closed');
            });
            connection.on('newListener', (...params) => {
                logger.log('New Listener' + params.toString());
            });
            connection.on('removeListener', (...params) => {
                logger.log('Remove Listener' + params.toString());
            });
            connection.on('message', function (message) {
                _this.#currentMessage = message.utf8Data;
            });
        });

        this.#wsClient.on('error', (error) => {
            logger.log(error.toString())
        })

        this.#wsClient.connect(this.#url);
        
    }

    #init() {

        this.#connect();

        setInterval(() => {
            this.#connect()
        }, 10 * 60 * 60 * 2000);
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