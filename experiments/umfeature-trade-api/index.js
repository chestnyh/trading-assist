require('dotenv').config({ path: __dirname+ '/./../../.env'});

const { UMFutures } = require("@binance/futures-connector");

const FEATURE_API_KEY = process.env.FEATURE_API_KEY || '';
const FEATURE_SECRET_KEY = process.env.FEATURE_SECRET_KEY || '';

// provide the testnet base url
const umFuturesClient = new UMFutures(FEATURE_API_KEY, FEATURE_SECRET_KEY, {
    baseURL: "https://testnet.binancefuture.com",
});

const main = async () => {

    /********************* BASE ACCOUNT API *********************/
    /** Change Position Mode
     *
     * POST /fapi/v1/positionSide/dual
     * POST /dapi/v1/positionSide/dual
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#change-position-mode-trade}
     * 
     * changePositionMode(dualSidePosition, options = {}) 
    */
    // TODO add example

    /**
     * Get Current Position Mode
     *
     * GET /fapi/v1/positionSide/dual
     * GET /dapi/v1/positionSide/dual
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#position-side-dual-user_data}
     * getPositionMode(options = {})
     */
    // TODO add example

    /**
     * New Order (TRADE)
     *
     * POST /fapi/v1/order
     * POST /dapi/v1/order
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#new-order-trade}
     * @param {string} symbol
     * @param {string} side
     * @param {string} type
     * @param {object} [options]
     * @param {number} [options.recvWindow] - The value cannot be greater than 60000
     * newOrder(symbol, side, type, options = {}) 
     */
    // TODO add example

    /**
     * Place Multiple Orders (TRADE)
     *
     * POST /fapi/v1/batchOrders
     * POST /dapi/v1/batchOrders
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#place-multiple-orders-trade}
     * @param {Array} batchOrders
     * @param {object} [options]
     * @param {number} [options.recvWindow] - The value cannot be greater than 60000
     * placeMultipleOrders(batchOrders, options = {})
     */
    // TODO add example

    /**
     * Get Order Modification History (USER_DATA)
     *
     * GET /fapi/v1/orderAmendment
     * GET /dapi/v1/orderAmendment
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#get-order-modify-history-user_data}
     *
     * @param {string} symbol - The symbol for which the order modification history is requested.
     * @param {Object} options - The additional options for the request. (optional)
     * getOrderModifyHistory(symbol, options = {})
     */
    // TODO add example

    /**
     * Query Order (USER_DATA)
     *
     * GET /fapi/v1/order
     * GET /dapi/v1/order
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#query-order-user_data}
     *
     * @param {string} symbol - The symbol for which the order is placed.
     * @param {string} side - The side of the order (BUY/SELL).
     * @param {string} type - The type of the order (LIMIT, MARKET, etc.).
     * @param {Object} options - The additional options for the order. (optional)
     * queryOrder(symbol, options = {})
     */
    // TODO add example

    /**
     * Cancel Order (USER_DATA)
     *
     * DELETE /fapi/v1/order
     * DELETE /dapi/v1/order
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#cancel-order-user_data}
     *
     * @param {string} symbol
     * @param {object} [options]
     * @param {number} [options.recvWindow] - The value cannot be greater than 60000
     * cancelOrder(symbol, options = {})
     */
    // TODO add example

    /**
     * Cancel All Open Orders (USER_DATA)
     *
     * DELETE /fapi/v1/allOpenOrders
     * DELETE /dapi/v1/allOpenOrders
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#cancel-all-open-orders-user_data}
     *
     * @param {string} symbol
     * @param {object} [options]
     * @param {number} [options.recvWindow] - The value cannot be greater than 60000
     *  cancelAllOpenOrders(symbol, options = {}) 
     */
    // TODO add example

    /**
     * Cancel Multiple Orders (USER_DATA)
     *
     * DELETE /fapi/v1/batchOrders
     * DELETE /dapi/v1/batchOrders
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#cancel-multiple-orders-user_data}
     *
     * @param {string} symbol
     * @param {object} [options]
     * @param {number} [options.recvWindow] - The value cannot be greater than 60000
     * cancelMultipleOrders(symbol, options = {})
     */
    // TODO add example

    /**
     * Cancel All Open Orders (USER_DATA)
     *
     * DELETE /fapi/v1/countdownCancelAll
     * DELETE /dapi/v1/countdownCancelAll
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#cancel-all-open-orders-user_data}
     *
     * @param {string} symbol
     * @param {number} countdownTime
     * @param {object} [options]
     * @param {number} [options.recvWindow] - The value cannot be greater than 60000
     * autoCancelAllOpenOrders(symbol, countdownTime, options = {})
     */
    // TODO add example

    /**
     * Query Current Open Order (USER_DATA)
     *
     * GET /fapi/v1/openOrder
     * GET /dapi/v1/openOrder
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#query-current-open-order-user_data}
     *
     * @param {string} symbol
     * @param {object} [options]
     * @param {number} [options.recvWindow] - The value cannot be greater than 60000
     *  queryCurrentOpenOrder(symbol, options = {})
     */
    // TODO add example

    /**
     * Current All Open Orders (USER_DATA)
     *
     * GET /fapi/v1/openOrders
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#current-all-open-orders-user_data}
     *
     * @param {object} [options]
     * @param {number} [options.recvWindow] - The value cannot be greater than 60000
     * getCurrentAllOpenOrders(options = {})
     */
    // TODO add example

    /**
     * Change Initial Leverage (TRADE)
     *
     * POST /fapi/v1/leverage
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#change-initial-leverage-trade}
     *
     * @param {string} symbol
     * @param {number} leverage
     * @param {object} [options]
     * @param {number} [options.recvWindow] - The value cannot be greater than 60000
     * changeInitialLeverage(symbol, leverage, options = {})
     */
    // TODO add example

    /**
     * Change Margin Type (TRADE)
     *
     * POST /fapi/v1/marginType
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#change-margin-type-trade}
     *
     * @param {string} symbol
     * @param {string} marginType
     * @param {object} [options]
     * @param {number} [options.recvWindow] - The value cannot be greater than 60000
     * changeMarginType(symbol, marginType, options = {})
     */
    // TODO add example

    /**
     * Modify Isolated Position Margin (TRADE)
     *
     * POST /fapi/v1/positionMargin
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#modify-isolated-position-margin-trade}
     *
     * @param {string} symbol
     * @param {number} amount
     * @param {number} type
     * @param {object} [options]
     * @param {number} [options.recvWindow] - The value cannot be greater than 60000
     * modifyIsolatedPositionMargin(symbol, amount, type, options = {})
     */
    // TODO add example

    /**
     * Get Position Margin Change History (TRADE)
     *
     * GET /fapi/v1/positionMargin/history
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#get-position-margin-change-history-trade}
     *
     * @param {string} symbol
     * @param {object} [options]
     * @param {number} [options.recvWindow] - The value cannot be greater than 60000
     * getPositionMarginChangeHistory(symbol, options = {})
     */
    // TODO add example

    /**
     * Get Income History (USER_DATA)
     *
     * GET /fapi/v1/income
     * GET /dapi/v1/income
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#get-income-history-user_data}
     * getIncomeHistory(options = {})
     */
    // TODO add example

    /**
     * User’s Force Orders (USER_DATA)
     *
     * GET /fapi/v1/forceOrders
     * GET /dapi/v1/forceOrders
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#user-s-force-orders-user_data}
     * getUsersForceOrders(options = {})
     */
    // TODO add example

    /**
     * Position ADL Quantile Estimation (USER_DATA)
     *
     * GET /fapi/v1/adlQuantile
     * GET /dapi/v1/adlQuantile
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#position-adl-quantile-estimation-user_data}
     * getPositionADLQuantileEstimation(options = {})
     */
    // TODO add example

    /**
     * User Commission Rate (USER_DATA)
     *
     * GET /fapi/v1/commissionRate
     * GET /dapi/v1/commissionRate
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#user-commission-rate-user_data}
     * getUserCommissionRate(symbol, options = {})
     */
    // TODO add example

    /**
     * Get Download Id For Futures Transaction History (USER_DATA)
     *
     * GET /fapi/v1/income/asyn
     * GET /dapi/v1/income/asyn
     *
     * @param {@number} startTime - The start timestamp.
     * @param {@number} endTime - The end timestamp.
     * @param {object} [options]
     * @param {number} [options.recvWindow] - The value cannot be greater than 60000
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#get-download-id-for-futures-transaction-history-user_data}
     * getDownloadIdForFuturesTransactionHistory( startTime, endTime, options = {})
     */
    // TODO add example

    /******************************** UM ACCOUNT API ************************************/

    /**
     * Change Multi-Assets Mode
     *
     * POST /fapi/v1/multiAssetsMargin
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#change-multi-assets-mode-trade}
     * 
     * changeMultiAssetsMode(multiAssetsMargin, options = {})
     */
    // TODO add example

    /**
     * Get Current Multi-Assets Mode
     *
     * GET /fapi/v1/multiAssetsMargin
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#multi-assets-margin-user_data}
     * 
     * getMultiAssetsMode(options = {})
     */
    // TODO add example

    /**
     * Modify Order (TRADE)
     *
     * PUT /fapi/v1/order
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#modify-order-trade}
     * 
     * modifyOrder(symbol, side, quantity, price, options = {})
     */
    // TODO add example

    /**
     * Modify Multiple Orders (TRADE)
     *
     * PUT /fapi/v1/batchOrders
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#modify-multiple-orders-trade}
     * 
     * modifyMultipleOrders(batchOrders, options = {})
     */
    // TODO add example

    /**
     * All Orders (USER_DATA)
     *
     * GET /fapi/v1/allOrders
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#all-orders-user_data}
     * 
     * getAllOrders(symbol, options = {})
     */
    // TODO add example

    /**
     * Futures Account Balance V2 (USER_DATA)
     *
     * GET /fapi/v2/balance
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#futures-account-balance-v2-user_data}
     * 
     * getFuturesAccountBalanceV2(options = {})
     */
    // TODO add example

    /**
     * Account Information V2 (USER_DATA)
     *
     * GET /fapi/v2/account
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#account-information-v2-user_data}
     * 
     * getAccountInformationV2(options = {})
     */
    // TODO add example

    /**
     * Position Information V2 (USER_DATA)
     *
     * GET /fapi/v2/positionRisk
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#position-information-v2-user_data}
     * 
     * getPositionInformationV2(options = {})
     */
    // TODO add example

    /**
     * Account Trade List (USER_DATA)
     *
     * GET /fapi/v1/userTrades
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#account-trade-list-user_data}
     * 
     * getAccountTradeList(symbol, options = {})
     */
    // TODO add example

    /**
     * Notional and Leverage Brackets (USER_DATA)
     *
     * GET /fapi/v1/leverageBracket
     *
     * {@link https://binance-docs.github.io/apidocs/futures/en/#notional-and-leverage-brackets-user_data}
     * 
     * getNotionalAndLeverageBrackets(options = {})
     */
    // TODO add example 
    
};