class CoinFollower {

    #client;
    #interval = null;
    #candlesArr = [];
    #getPriceInterval = 60 * 1000;

    get candlesArr() {
        return this.#candlesArr
    }

    constructor({
        client
    }){
        this.#client = client;
        this.#init()
    }

    #flow(){
        const {
            p: price
        } = this.#client.getCurrentPrice();
        this.#candlesArr.push(price);
    }

    #init(){
        this.#interval = setInterval(() => {
            this.#flow()
        }, this.#getPriceInterval)
    }
}

module.exports = CoinFollower;