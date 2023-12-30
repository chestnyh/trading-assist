const fs = require('node:fs');
const { createLongPosition, createShortPosition } = require('../../api/create-order/index');
const logger = require('../../logger');

const fileToLog = `logs`

class SimpleStrategy {

    #checkInterval = 60 * 1000;
    #coinFollower;

    #state = {
        startTrackingTime: Date.now(),
        topPointPrice: 0,
        lowPointPrice: 0,
        currentPrice: 0,
    }

    constructor({ coinFollower }) {
        this.#coinFollower = coinFollower;
    }

    #isRising(prices) {
        let raisingAmount = 0;
        let previous = 0;
        prices.forEach(price => {

            price = parseFloat(price);

            if (previous === 0) {
                previous = price;
                return;
            }

            if (price > previous) {
                raisingAmount++;
            }
        });

        if (raisingAmount >= 10) {
            return true;
        }
    }

    #isDowning(prices) {

        let downingAmount = 0;
        let previous = 0;
        prices.forEach(price => {

            price = parseFloat(price);

            if (previous === 0) {
                previous = price;
                return;
            }

            if (price < previous) {
                downingAmount++;
            }
        });

        if (downingAmount >= 10) {
            return true;
        }

    }

    run() {
        setInterval(async () => {

            const candles = this.#coinFollower.candlesArr;

            this.#state.currentPrice = parseFloat(candles[candles.length - 1]);

            if (this.#state.topPointPrice === 0) {
                this.#state.topPointPrice = this.#state.currentPrice;
            }

            if (this.#state.lowPointPrice === 0) {
                this.#state.lowPointPrice = this.#state.currentPrice;
            }

            if (this.#state.currentPrice > this.#state.topPointPrice) {
                this.#state.topPointPrice = this.#state.currentPrice
            }

            if (this.#state.currentPrice < this.#state.lowPointPrice) {
                this.#state.lowPointPrice = this.#state.currentPrice
            }

            logger.log(`STATE = ${JSON.stringify(this.#state)}`);

            if (this.#state.currentPrice - this.#state.lowPointPrice > 3000) {
                const result = await createShortPosition({ symbol: 'BTCUSDT', quantity: 0.005 });
                this.#state.topPointPrice = 0
                this.#state.lowPointPrice = 0
                this.#state.currentPrice = 0
                logger.log(`SHORT POSITION CREATED = ${JSON.stringify(result)}`);
            }
            if (this.#state.currentPrice - this.#state.topPointPrice < -3000) {
                const result = await createLongPosition({ symbol: 'BTCUSDT', quantity: 0.005 });
                this.#state.topPointPrice = 0
                this.#state.lowPointPrice = 0
                this.#state.currentPrice = 0
                logger.log(`LONG POSITION CREATED = ${JSON.stringify(result)}`);
            }

            // If last 10 rising doing short
            // If last 10 doening doing long
        }, this.#checkInterval);
    }

}

module.exports = SimpleStrategy;