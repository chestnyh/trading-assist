/**
 * This is trading advice bot.
 * It just keep an eye on current positions and gives advice to create next order
 * It doesn't make any trade actions.
 *  */  

import { UMFutures } from "@binance/futures-connector";
import configs from '../../configs/index.js';
import bot from "./bot.js";
import codes from '../../data/codes.js';
import getCurrentPrice from '../lib/get-current-price.js';
import getActivePositions from "../api/binance-api/rest-api/account-trade/get-active-positions.js";
import getAllOrders from "../api/binance-api/rest-api/account-trade/get-all-orders.js";

const CHAT_ID = 230667485;
const threshold = 0.5;

const {BINANCE_API_KEY, BINANCE_API_SECRET} = configs

const umFuturesClient = new UMFutures(BINANCE_API_KEY, BINANCE_API_SECRET, {});


const main = async() => {

    // const positionData = await getActivePositions(umFuturesClient);
    // console.log(positionData);

    const positionData = await getAllOrders(umFuturesClient, 'NKNUSDT', {limit: 1000});
    console.log(positionData);

    // const result = await umFuturesClient.getOpenOrders('TWTUSDT');
    // console.log(result.data);


    // Get orders for each position

    // Calculate total pnl based on executed orders.

    // Track price changes 

    // Notify user that:
     // - price changed quickly user can create some order
     // - user can close some previous order in plus

}

main();