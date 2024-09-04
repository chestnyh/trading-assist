const { UMFutures } = require("@binance/futures-connector");

const umFuturesClient = new UMFutures("", "", { });

const main = async () => {
    
    // Check connectivity
    // const response = await umFuturesClient.ping();
    // console.log(response.data);

    // Get server time
    // const response = await umFuturesClient.getTime();
    // console.log(response.data); // { serverTime: 1710445183804 }

    // Get exchange info
    // const response = await umFuturesClient.getExchangeInfo();
    // console.log(response.data);

    // Some information about trading volume order book
    // const response = await umFuturesClient.getDepth('BTCUSDT', 1000);
    // console.log(response.data);

    // Get last trdes up to 500
    // const response = await umFuturesClient.getTrades('BTCUSDT');
    // console.log(response.data);

    // Does not work getHistoricalTrades
    // get older trades
    // const response = await umFuturesClient.getHistoricalTrades('HOTUSDT', 10);
    // console.log(response.data);

    // Does not work getHistoricalTrades
    // get older trades
    // const response = await umFuturesClient.getHistoricalTrades('HOTUSDT', 10);
    // console.log(response.data);

    // Get compressed, aggregate trades. Trades that fill at the time, from the same order, with the same price will have the quantity aggregated.
    // getAggTrades(getsymbol, fromId, startTime, endTime, limit)
    // const response = await umFuturesClient.getAggTrades('HOTUSDT', 1, null, null, 1000);
    // console.log(response.data);

    // Kline/candlestick bars for a symbol. Klines are uniquely identified by their open time.
    // getKlines(symbol, interval, startTime, endTime, limit)
    // const response = await umFuturesClient.getKlines('HOTUSDT', '1m');
    // console.log(response.data);

    // console.log(response.data);

    // getPriceTicker
    // const response = await umFuturesClient.getPriceTicker('HOTUSDT');
    // console.log(response.data);


    // Get present open interest of a specific symbol.
    // getOpenInterest(symbol);
    // const response = await umFuturesClient.getOpenInterest('HOTUSDT');
    // console.log(response.data);

    // Kline/candlestick bars for the mark price of a symbol.
    // Klines are uniquely identified by their open time.
    // getMarkPriceKlines(symbol, interval, startTime, endTime, limit)
    // const response = await umFuturesClient.getMarkPriceKlines('HOTUSDT', '1m', null, null, 1000);
    // console.log(response.data);

}

main();


// 'use strict'

// const { validateRequiredParameters } = require('../../../helpers/validation')

// /**
//  * API market endpoints
//  * @module Market
//  * @param {*} superclass
//  */
// const Market = (superclass) =>
//     class extends superclass {


//         /**
//          * Kline/candlestick bars for a symbol. Klines are uniquely identified by their open time.
//          *
//          * UM: GET /fapi/v1/klines<br>
//          * CM: GET /dapi/v1/klines<br>
//          *
//          * {@link https://binance-docs.github.io/apidocs/futures/en/#kline-candlestick-data}
//          */
//         getKlines(symbol, interval, startTime, endTime, limit) {
//             validateRequiredParameters({ symbol, interval })
//             return this.publicRequest(
//                 'GET',
//                 `${this.baseURL}/${this.product}/v1/klines`,
//                 { symbol, interval, startTime, endTime, limit }
//             )
//         }

//         /**
//          * Get the premium index and funding rate for a symbol.
//          *
//          * UM: GET /fapi/v1/premiumIndex<br>
//          * CM: GET /dapi/v1/premiumIndex<br>
//          *
//          * {@link https://binance-docs.github.io/apidocs/futures/en/#get-premium-index-funding-rate}
//          */
//         getPremiumIndex(symbol) {
//             return this.publicRequest(
//                 'GET',
//                 `${this.baseURL}/${this.product}/v1/premiumIndex`,
//                 { symbol }
//             )
//         }

//         /**
//          * Get funding rate history.
//          *
//          * UM: GET /fapi/v1/fundingRate<br>
//          * CM: GET /dapi/v1/fundingRate<br>
//          *
//          * {@link https://binance-docs.github.io/apidocs/futures/en/#get-funding-rate-history}
//          */
//         getFundingRate(symbol, startTime, endTime, limit) {
//             return this.publicRequest(
//                 'GET',
//                 `${this.baseURL}/${this.product}/v1/fundingRate`,
//                 { symbol, startTime, endTime, limit }
//             )
//         }

//         /**
//          * Get premium index klines.
//          *
//          * UM: GET /fapi/v1/premiumIndexKlines<br>
//          * CM: GET /dapi/v1/premiumIndexKlines<br>
//          *
//          * {@link https://binance-docs.github.io/apidocs/futures/en/#get-premium-index-klines}
//          */
//         getPremiumIndexKlines(symbol, interval, startTime, endTime, limit) {
//             validateRequiredParameters({ symbol, interval })
//             return this.publicRequest(
//                 'GET',
//                 `${this.baseURL}/${this.product}/v1/premiumIndexKlines`,
//                 { symbol, interval, startTime, endTime, limit }
//             )
//         }

//         /**
//          * Get klines for a specific pair and contract type.
//          *
//          * UM: GET /fapi/v1/continuousKlines<br>
//          * CM: GET /dapi/v1/continuousKlines<br>
//          *
//          * {@link https://binance-docs.github.io/apidocs/futures/en/#continuous-contract-kline-candlestick-data}
//          */
//         getContinuousKlines(
//             pair,
//             contractType,
//             interval,
//             startTime,
//             endTime,
//             limit
//         ) {
//             validateRequiredParameters({ pair, contractType, interval })
//             return this.publicRequest(
//                 'GET',
//                 `${this.baseURL}/${this.product}/v1/continuousKlines`,
//                 { pair, contractType, interval, startTime, endTime, limit }
//             )
//         }

//         /**
//          * Get index price klines.
//          *
//          * UM: GET /fapi/v1/indexPriceKlines<br>
//          * CM: GET /dapi/v1/indexPriceKlines<br>
//          *
//          * {@link https://binance-docs.github.io/apidocs/futures/en/#index-price-kline-candlestick-data}
//          */
//         getIndexPriceKlines(pair, interval, startTime, endTime, limit) {
//             validateRequiredParameters({ pair, interval })
//             return this.publicRequest(
//                 'GET',
//                 `${this.baseURL}/${this.product}/v1/indexPriceKlines`,
//                 { pair, interval, startTime, endTime, limit }
//             )
//         }

//         /**
//          * 24 hour rolling window price change statistics.
//          *
//          * UM: GET /fapi/v1/ticker/24hr<br>
//          * CM: GET /dapi/v1/ticker/24hr<br>
//          *
//          * {@link https://binance-docs.github.io/apidocs/futures/en/#24hr-ticker-price-change-statistics}
//          */
//         get24hrTicker(symbol, pair) {
//             if (symbol && pair) {
//                 throw new Error(
//                     'Invalid parameters. You can only use "pair" OR "symbol", not both.'
//                 )
//             }
//             return this.publicRequest(
//                 'GET',
//                 `${this.baseURL}/${this.product}/v1/ticker/24hr`,
//                 { symbol, pair }
//             )
//         }

//         /**
//          * Latest price for a symbol or symbols.
//          *
//          * UM: GET /fapi/v1/ticker/price<br>
//          * CM: GET /dapi/v1/ticker/price<br>
//          *
//          * {@link https://binance-docs.github.io/apidocs/futures/en/#symbol-price-ticker}
//          */
//         getPriceTicker(symbol, pair) {
//             if (symbol && pair) {
//                 throw new Error(
//                     'Invalid parameters. You can only use "pair" OR "symbol", not both.'
//                 )
//             }
//             return this.publicRequest(
//                 'GET',
//                 `${this.baseURL}/${this.product}/v1/ticker/price`,
//                 { symbol, pair }
//             )
//         }

//         /**
//          * Best price/qty on the order book for a symbol or symbols.
//          *
//          * UM: GET /fapi/v1/ticker/bookTicker<br>
//          * CM: GET /dapi/v1/ticker/bookTicker<br>
//          *
//          * {@link https://binance-docs.github.io/apidocs/futures/en/#symbol-order-book-ticker}
//          */
//         getBookTicker(symbol, pair) {
//             if (symbol && pair) {
//                 throw new Error(
//                     'Invalid parameters. You can only use "pair" OR "symbol", not both.'
//                 )
//             }
//             return this.publicRequest(
//                 'GET',
//                 `${this.baseURL}/${this.product}/v1/ticker/bookTicker`,
//                 { symbol, pair }
//             )
//         }

//         /**
//          * Get present open interest of a specific symbol.
//          *
//          * UM: GET /fapi/v1/openInterest<br>
//          * CM: GET /dapi/v1/openInterest<br>
//          *
//          * {@link https://binance-docs.github.io/apidocs/futures/en/#open-interest}
//          */
//         getOpenInterest(symbol) {
//             validateRequiredParameters({ symbol })
//             return this.publicRequest(
//                 'GET',
//                 `${this.baseURL}/${this.product}/v1/openInterest`,
//                 { symbol }
//             )
//         }

//         /**
//          * Kline/candlestick bars for the mark price of a symbol.
//          * Klines are uniquely identified by their open time.
//          *
//          * UM: GET /fapi/v1/markPriceKlines<br>
//          * CM: GET /dapi/v1/markPriceKlines<br>
//          *
//          * {@link https://binance-docs.github.io/apidocs/futures/en/#mark-price-kline-candlestick-data}
//          */
//         getMarkPriceKlines(symbol, interval, startTime, endTime, limit) {
//             validateRequiredParameters({ symbol, interval })
//             return this.publicRequest(
//                 'GET',
//                 `${this.baseURL}/${this.product}/v1/markPriceKlines`,
//                 { symbol, interval, startTime, endTime, limit }
//             )
//         }
//     }