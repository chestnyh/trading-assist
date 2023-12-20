module.exports = {
    "symbol": {
        type: "string",
        required: true,
        description: "???"
    },
    "side": {
        type: "enum",
        values: ["BUY", "SELL"],
        required: true,
        description: "BUY - for LONG, SELL - for SHORT"
    },
    "positionSide": {
        type: "enum",
        required: false,
        description: "Default `BOTH` for One-way Mode ; `LONG` or `SHORT` for Hedge Mode. It must be sent in Hedge Mode."
    },
    "type": {
        type: "enum",
        required: true,
        description: "???"
    },
    "timeInForce": {
        type: "enum",
        required: false,
        description: "???"
    },
    "quantity": {
        type: "decimal",
        required: false,
        description: "Cannot be sent with closePosition=true(Close-All)"
    },
    "reduceOnly": {
        type: "string",
        required: false,
        description: "\"true\" or \"false\". default \"false\". Cannot be sent in Hedge Mode; cannot be sent with closePosition=true"
    },
    "price": {
        type: "decimal",
        required: false,
        description: "???"
    },
    "newClientOrderId": {
        type: "string",
        required: false,
        description: "A unique id among open orders. Automatically generated if not sent. Can only be string following the rule: ^[\.A-Z\:/a-z0-9_-]{1,36}$"
    },
    "stopPrice": {
        type: "decimal", 
        required: false,
        description: "Used with STOP/STOP_MARKET or TAKE_PROFIT/TAKE_PROFIT_MARKET orders"
    },
    "closePosition": {
        type: "string", 
        required: false,
        description: "true, false；Close-All，used with STOP_MARKET or TAKE_PROFIT_MARKET"
    },
    "activationPrice": {
        type: "decimal", 
        required: false,
        description: "Used with TRAILING_STOP_MARKET orders, default as the latest price(supporting different workingType)"
    },
    "callbackRate": {
        type: "decimal", 
        required: false,
        description: "Used with TRAILING_STOP_MARKET orders, min 0.1, max 5 where 1 for 1%"
    },
    "workingType": {
        type: "enum", 
        required: false,
        description: "stopPrice triggered by:\"MARK_PRICE\", \"CONTRACT_PRICE\". Default \"CONTRACT_PRICE\""
    },
    "priceProtect": {
        type: "string", 
        required: false,
        description: "\"TRUE\" or \"FALSE\", default \"FALSE\". Used with STOP/STOP_MARKET or TAKE_PROFIT/TAKE_PROFIT_MARKET orders"
    },
    "newOrderRespType": {
        type: "enum", 
        required: false,
        description: "\"ACK\", \"RESULT\", default \"ACK\""
    },
    "priceMatch": {
        type: "enum", 
        required: false,
        description: "only avaliable for LIMIT/STOP/TAKE_PROFIT order; can be set to OPPONENT/ OPPONENT_5/ OPPONENT_10/ OPPONENT_20: /QUEUE/ QUEUE_5/ QUEUE_10/ QUEUE_20; Can't be passed together with price"
    },
    "selfTradePreventionMode": {
        type: "enum", 
        required: false,
        description: "NONE:No STP / EXPIRE_TAKER:expire taker order when STP triggers/ EXPIRE_MAKER:expire taker order when STP triggers/ EXPIRE_BOTH:expire both orders when STP triggers; default NONE"
    },
    "goodTillDate": {
        type: "long", 
        required: false,
        description: "order cancel time for timeInForce GTD, mandatory when timeInforce set to GTD; order the timestamp only retains second-level precision, ms part will be ignored; The goodTillDate timestamp must be greater than the current time plus 600 seconds and smaller than 253402300799000"
    },
    "recvWindow": {
        type: "long", 
        required: false,
        description: "???"
    },
    "timestamp": {
        type: "long", 
        required: true,
        description: ""
    }
}