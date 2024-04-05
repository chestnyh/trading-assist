const codes = require('../../data/codes');
const bot = require('./bot');
const { UMFutures } = require("@binance/futures-connector");

const measureBlocks = 25; // should be odd number
const threshold = 5;
const interval = 5 * 60 * 1000;
const CHAT_ID = 230667485;

const database = {};

setInterval(() => {
    bot.sendMessage(CHAT_ID, `checking...`)
}, interval);

codes.forEach(async (code) => {
    const umFuturesClient = new UMFutures("", "", {});

    setInterval(async () => {

        const response = await umFuturesClient.getKlines(code, '5m', null, null, measureBlocks + 1);
        const candlesList = response.data;

        if (!database[code]) {
            database[code] = {};
        }
        database[code].candles = candlesList.map((candle) => {
            return {
                openTime: candle[0],
                closeTime: candle[6],
                openPrice: parseFloat(candle[1]),
                closePrice: parseFloat(candle[4]),
                highPrice: parseFloat(candle[2]),
                lowPrice: parseFloat(candle[3]),
            }
        });

        database[code].candles.pop();

        database[code].trends = database[code].candles.map((candle, idx) => {
            if (database[code].candles[idx + 1]) {
                return calculateTrendSlopePercentage([
                    (database[code].candles[0].highPrice + database[code].candles[0].lowPrice) / 2,
                    (database[code].candles[idx + 1].highPrice + database[code].candles[idx + 1].lowPrice) / 2,
                ]);
            }
        }).filter(Boolean)

        database[code].biHoursTrend = database[code].trends[database[code].trends.length - 1] - database[code].trends[0];
        database[code].hoursTrends = [
            database[code].trends[database[code].trends.length / 2 - 1] - database[code].trends[0],
            database[code].trends[database[code].trends.length - 1] - database[code].trends[database[code].trends.length / 2 - 1]
        ];

        let notify = false

        if (Math.abs(database[code].biHoursTrend) < 1 && Math.abs(database[code].hoursTrends[0]) > threshold && Math.abs(database[code].hoursTrends[1]) > threshold) {
            notify = true;
        } else if (Math.abs(database[code].hoursTrends[0]) < 1 && Math.abs(database[code].hoursTrends[1]) > threshold) {
            notify = true;
        }

        if (notify) {
            bot.sendMessage(CHAT_ID,
                `--------${code}-------
TRENDS: ${JSON.stringify(database[code].trends)}
BI-HOURS TREND: ${database[code].biHoursTrend}
HOURS TRENDS: ${JSON.stringify(database[code].hoursTrends)}`);
        }
    }, interval);
});

function calculateTrendSlopePercentage(prices) {
    if (prices.length < 2) {
        throw new Error('Array must contain at least 2 elements.');
    }

    const initialValue = prices[0];
    const finalValue = prices[prices.length - 1];

    const percentageChange = ((finalValue - initialValue) / initialValue) * 100;

    return Math.round(percentageChange * 100) / 100;
}