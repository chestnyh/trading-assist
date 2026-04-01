export default {
    "name": "Candle price movement alert",
    "description": "Every 10 seconds, checks the current 1h BTCUSDT candle. If the price has moved more than 100 USDT from open, sends a Telegram alert.",
    "type": "interval",
    "arguments": {
        "interval": 10000,
        "do": {
            "type": "sequence",
            "arguments": {
                "do": [
                    {
                        "type": "binance_spot_get_klines",
                        "arguments": {
                            "symbol": "BTCUSDT",
                            "interval": "1h",
                            "resultKey": "btc_candle"
                        }
                    },
                    {
                        "type": "if_then",
                        "arguments": {
                            "if": {
                                "type": "resolve",
                                "arguments": {
                                    "expression": {
                                        "__gt": [
                                            {
                                                "__absolute": [
                                                    {
                                                        "__minus": [
                                                            { "__var": "__sequenceContext__.btc_candle.[0].close" },
                                                            { "__var": "__sequenceContext__.btc_candle.[0].open" }
                                                        ]
                                                    }
                                                ]
                                            },
                                            { "__const": 100 }
                                        ]
                                    }
                                }
                            },
                            "then": {
                                "type": "telegram_send_message",
                                "arguments": {
                                    "botId": "tg_bot_004",
                                    "message": "BTCUSDT 1h candle alert: open=${__sequenceContext__.btc_candle.[0].open}, current=${__sequenceContext__.btc_candle.[0].close}, movement exceeds 100 USDT"
                                }
                            }
                        }
                    }
                ]
            }
        }
    }
}
