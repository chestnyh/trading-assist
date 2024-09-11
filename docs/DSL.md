# DSL

Presenting DSL that allows to program bot behavior.
Bot DSL should have json based format that has it's own rules described bellow.
DLS has nested structure that makes it flexible in programming bot behavior.

1) What do we have at the top level?

So each json DSL should start with this structure:

```json
{
    "version": "1.0.0",
    "flow": [
        // Here we describe how bot should react on market changes
    ]
}

```
`version` - describes version of a DSL
`flow` - consist bot behavior description

2) `flow` is an object to run:
```
TODO add description
```

So full version of DSL can look like this:

```json
{
    "version": "1.0.0",
    "flow": {
        "type": "sequence",
        "items": [
            {
                "comment": "Title",
                "description": "Some description here",
                "id": "1",
                "type": "condition",
                "condition": {
                    "__if": {
                        "__and": [
                            {
                                "__or": [
                                // List of conditions here
                                ]
                            },
                            {
                                "__or": [
                                    // List of conditions here
                                ]
                            }
                        ]    
                    },
                    "__then": {
                        "type": "condition",
                        "condition": {
                            "__if": {
                                "__or": [
                                    {
                                        "MARKET.trend": {
                                            "__eq": "GROWING"
                                        },
                                    }
                                ]
                            },
                            "__then": {
                                "type": "sequence",
                                "items": [
                                    {
                                        "type": "operation",
                                        "operation": "BINANCE_USDM_API.createOrder",
                                        "args": {
                                            "orderType": "SELL",
                                            "orderPrice": "DEPOSIT.10%"  
                                        }
                                    },
                                    {
                                        "type": "operation",
                                        "args": "TELEGRAM_BOT.sendMessage",
                                        "arguments": {
                                            "message": "Sell order was created"
                                        }
                                    },
                                    {
                                        "type": "operation",
                                        "operation": "COMMON.wait",
                                        "args": {
                                            "time": 10000,
                                        }
                                    },
                                    {
                                        "type": "operation",
                                        "operation": "BINANCE_USDM_API.createOrder",
                                        "args": {
                                            "orderType": "BUY",
                                            "orderPrice": "DEPOSIT.10%"  
                                        }
                                    },
                                ]
                            }
                        }
                    }
                }
            }
        ]
    }
}
```