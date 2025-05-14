module.exports = {
    user: [
        {
            where: {
                email: 'admin@tb.com',
            },
            create: {
                email: 'admin1@tb.com',
                nickname: 'admin1',
                password: 'password',
                rules: {
                    create: [
                        {
                            name: "Initial Config",
                            description: "Initial config ",
                            ruleBody: {
                                "type": "interval",
                                "arguments": {
                                    "do": {
                                        "name": "Test simple config",
                                        "description": "TODO add description",
                                        "type": "sequence",
                                        "arguments": {
                                            "do": [
                                                {
                                                    "type": "binance_get_ticker",
                                                    "arguments": {
                                                        "symbol": "TRUMPUSDT"
                                                    }
                                                },
                                                {
                                                    "type": "add_to_heap",
                                                    "arguments": {
                                                        "items": [
                                                            {
                                                                "key": "binance.TRUMPUSDT.[]",
                                                                "value": "__sequenceContext__.TRUMPUSDT"
                                                            },
                                                        ]
                                                    }
                                                },
                                                {
                                                    "type": "if_then",
                                                    "arguments": {
                                                        "if": {
                                                            "type": "condition",
                                                            "arguments": {
                                                                "condition":
                                                                {
                                                                    "__gt": {
                                                                        "left": {
                                                                            "__var": "__heap__.binance.TRUMPUSDT.[3]"
                                                                        },
                                                                        "right": {
                                                                            "__const": 0
                                                                        },
                                                                    }
                                                                },
                                                            }
                                                        },
                                                        "then": {
                                                            "type": "delete_from_heap",
                                                            "arguments": {
                                                                "keys": [
                                                                    "binance.TRUMPUSDT.[0]"
                                                                ]
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    "type": "if_then",
                                                    "arguments": {
                                                        "if": {
                                                            "type": "condition",
                                                            "arguments": {
                                                                "condition":
                                                                {   
                                                                    "__and": [
                                                                        {
                                                                            "__gt": {
                                                                                "left": {
                                                                                    "__var": "__heap__.binance.TRUMPUSDT.[2]"
                                                                                },
                                                                                "right": {
                                                                                    "__const": 0
                                                                                },
                                                                            }
                                                                        },
                                                                        {
                                                                            "__gt": {
                                                                                "left": {
                                                                                    "__absolute": {
                                                                                        "value": {
                                                                                            "__divide": {
                                                                                                "left": {
                                                                                                    "__minus": {
                                                                                                        "left": {
                                                                                                            "__var": "__heap__.binance.TRUMPUSDT.[2]"
                                                                                                        },
                                                                                                        "right": {
                                                                                                            "__var": "__heap__.binance.TRUMPUSDT.[1]"
                                                                                                        }
                                                                                                    }
                                                                                                },
                                                                                                "right": {
                                                                                                    "__var": "__heap__.binance.TRUMPUSDT.[2]"
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                },
                                                                                "right": {
                                                                                    "__const": 0.05
                                                                                },
                                                                            }
                                                                        },
                                                                        {
                                                                            "__gt": {
                                                                                "left": {
                                                                                    "__absolute": {
                                                                                        "value": {
                                                                                            "__divide": {
                                                                                                "left": {
                                                                                                    "__minus": {
                                                                                                        "left": {
                                                                                                            "__var": "__heap__.binance.TRUMPUSDT.[1]"
                                                                                                        },
                                                                                                        "right": {
                                                                                                            "__var": "__heap__.binance.TRUMPUSDT.[0]"
                                                                                                        }
                                                                                                    }
                                                                                                },
                                                                                                "right": {
                                                                                                    "__var": "__heap__.binance.TRUMPUSDT.[2]"
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                },
                                                                                "right": {
                                                                                    "__const": 0.05
                                                                                },
                                                                            }
                                                                        }
                                                                    ]
                                                                },
                                                            }
                                                        },
                                                        "then": {
                                                            "type": "telegram_send_message",
                                                            "arguments": {
                                                                "message": "TRUMPUSDT is greater than 12"
                                                            }
                                                        }
                                                    }
                                                },
                                                {
                                                    "type": "log",
                                                    "arguments": {
                                                        "message": "SOME LOG"
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    "interval": 5000
                                }
                            }
                        }
                    ]
                }
            },
            update: {}
        }
    ]
}