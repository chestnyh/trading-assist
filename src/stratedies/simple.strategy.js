const { createLongPosition, createShortPosition } = require('../api/create-order/index');
const logger = require('../logger');

const isAllAscending = (arr) => {
    for(let item of arr){
        if (item !== 'ascending'){
            return false; 
        }
    }

    return true;
}

const isAllDescending = (arr) => {
    for (let item of arr) {
        if (item !== 'descending') {
            return false;
        }
    }
}

class SimpleStrategy {

    #checkInterval = 5 * 60 * 1000;
    #priceClient;

    #state = {
        initialRound: true,
        trend: [],
        priceHistory: [],
        startTrackingTime: Date.now(),
    }

    constructor({ priceClient }) {
        this.#priceClient = priceClient;
    }

    run() {
        setInterval(async () => {

            const {
                price,
                timestamp
            } = await this.#priceClient.getCurrentPrice();

            console.log({
                price,
                timestamp
            });

            /*
             If initial round then we just set up currentPrice
             and return
            */ 
            if(this.#state.initialRound){
                this.#state.currentPrice = price;
                this.#state.initialRound = false;
                return;
            }

            if(price > this.#state.currentPrice){
                this.#state.trend.push('ascending');
            }
            else if (price < this.#state.currentPrice){
                this.#state.trend.push('descending');
            }
            else{
                this.#state.trend.push('no-changes');
            }

            if (this.#state.trend.length > 13){
                this.#state.trend.shift();
            }

            this.#state.priceHistory.push({
                price,
                timestamp
            });

            logger.log(`CURRENT PRICE = ${JSON.stringify({ price, timestamp })}`);
            logger.log(`CURRENT TREND = ${JSON.stringify(this.#state.trend)}`);

            if (this.#state.trend.length === 13){
                if (isAllAscending(this.#state.trend.slice(0, 9)) && isAllDescending(this.#state.trend.slice(10, 12))){
                    const result = await createShortPosition({ symbol: 'BTCUSDT', quantity: 0.005 });
                    logger.log(`SHORT POSITION CREATED = ${JSON.stringify(result)}`); 
                }
                if (isAllDescending(this.#state.trend.slice(0, 9)) && isAllAscending(this.#state.trend.slice(10, 12))) {
                    const result = await createLongPosition({ symbol: 'BTCUSDT', quantity: 0.005 });
                    logger.log(`LONG POSITION CREATED = ${JSON.stringify(result)}`);
                }
            }

            this.#state.currentPrice = price;

        }, this.#checkInterval);
    }

}

module.exports = SimpleStrategy;