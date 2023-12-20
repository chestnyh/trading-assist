const WebSocketClient = require('websocket').client;

class WebFollowerSocketClient {

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
            console.log('Connect Error: ' + error.toString());
        });

        this.#wsClient.on('connect', function (connection) {
            console.log('WebSocket Client Connected');
            connection.on('error', function (error) {
                console.log("Connection Error: " + error.toString());
            });
            connection.on('close', function () {
                console.log('echo-protocol Connection Closed');
            });
            connection.on('message', (message) => {
                _this.#currentMessage = message.utf8Data;
            });
        });

        this.#wsClient.on('error', (error) => {
            console.error(error)
        })


        this.#wsClient.connect(this.#url);

    }

    getCurrentPrice(){
        return JSON.parse(this.#currentMessage)
    }

}

module.exports = WebFollowerSocketClient;