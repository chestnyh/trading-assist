/**
 * This bot creates orders at some fixed time interval and fixed amount of money
 * the decision to make order depends on current price and previous order price
 * if long position:
 *     current price higher then previous price - sell order
 *     current price lower then previous price - buy order
 * if short position:
 *     current price higher then previous price - sell order
 *     current price lower then previous price - buy order
 */

import { UMFutures } from "@binance/futures-connector";
const cron = require('node-cron');
const bot = require("./bot");

const CHAT_ID = 230667485;
const COIN_CODE = "COINUSDT"; // TODO add coin code
const TIME_INTERVAL = 60 * 60 * 1000; // One hour
const INITIAL_ORDER_AMOUNT = 100; // USDT
const INTERVAL_ORDER_AMOUNT = 10; // USDT

const umFuturesClient = new UMFutures("", "", {});

const EACH_HOUR_AT_00_CRON_RULE = '0 * * * *';

let orders = {};

const initialization = () => {
    // Get previously created orders form 
}

cron.schedule(EACH_HOUR_AT_00_CRON_RULE, () => {
    console.log('running a task every hour');
});

/** Add crone to make ordering by time available by schedule */
/** 
 * For initial run: 
 *      1) We pull already created orders (check possibility to do it from api, otherwise create mechanism to read it from database)
 * For each cron event we do:
 *      1) Get previous inserted order price
 *      2) Make new order according conditions (save if we create records in database)
 */