import { Injectable } from '@nestjs/common';
import { ActionsRunnerService } from "../actions-runner/actions-runner.service";
import { ModelsService } from "@trading-bot/models";
import { prependListener } from 'process';

const config = {
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
                                                        "__const": 0.05 // 5%
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
                                                        "__const": 0.05 // 5%
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
};


@Injectable()
export class AutoTraderService {
    constructor(
        private actionsRunnerService: ActionsRunnerService,
        private modelsService: ModelsService
    ){
        this.init();
    }
    init(){
        this.actionsRunnerService.run(config);
    }
}    
