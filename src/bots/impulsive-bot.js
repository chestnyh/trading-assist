const { UMFutures } = require("@binance/futures-connector");
const bot = require("./bot");
const codes = require('../../data/codes.js');
const getCurrentPrice = require('../lib/get-current-price.js')

const CHAT_ID = 230667485;
const threshold = 0.5;

const umFuturesClient = new UMFutures("", "", {});

bot.sendMessage(CHAT_ID, `impulsive bot is running`);

setInterval(() => {
    bot.sendMessage(CHAT_ID, `running...`)
}, 1000 * 60 * 60);

codes.forEach((code) => {

    const arrayPrices = [];

    setInterval(async () => {
        const price = await getCurrentPrice(umFuturesClient, code);
        arrayPrices.push(price);

        if (arrayPrices.length > 4) {
            arrayPrices.shift();
        }

        const diff1 = Math.round((arrayPrices[1] - arrayPrices[0]) / arrayPrices[0] * 100 * 100) / 100;
        const diff2 = Math.round((arrayPrices[2] - arrayPrices[1]) / arrayPrices[1] * 100 * 100) / 100;
        const diff3 = Math.round((arrayPrices[3] - arrayPrices[2]) / arrayPrices[2] * 100 * 100) / 100;


        if (!(Math.abs(diff1) > threshold && Math.abs(diff2) > threshold && Math.abs(diff3) > threshold)) {
            return;
        }

        if (diff1 > 0 && diff2 > 0 && diff3 > 0) {
            return bot.sendMessage(CHAT_ID, `${code} is impulsive: ${diff1}% ${diff2}% ${diff3}% 
BTC price - ${await getCurrentPrice(umFuturesClient, 'BTCUSDT')}`);
        }

        if (diff1 < 0 && diff2 < 0 && diff3 < 0) {
            return bot.sendMessage(CHAT_ID, `${code} is impulsive: ${diff1}% ${diff2}% ${diff3}%
BTC price - ${await getCurrentPrice(umFuturesClient, 'BTCUSDT')}`);
        }

    }, 20000);

});