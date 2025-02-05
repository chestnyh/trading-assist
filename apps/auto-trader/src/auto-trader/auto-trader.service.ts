import { Injectable } from '@nestjs/common';
import { ActionsRunnerService } from "../actions-runner/actions-runner.service";

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
                            "symbol": "ETHUSDT"
                        }
                    },
                    {
                        "type": "add_to_heap",
                        "arguments": {
                            "items": [
                                {
                                    "key": "binance.ETHUSDT.[]",
                                    "value": "__sequenceContext__.ETHUSDT"
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
                                                "__var": "__heap__.binance.ETHUSDT"
                                            },
                                            "right": {
                                                "__const": 1000
                                            },
                                        }
                                    },
                                }
                            },
                            "then": {
                                "type": "telegram_send_message",
                                "arguments": {
                                    "message": "ETHUSDT is greater than 1000"
                                }
                            }
                        }
                    }
                ]
            }
        },
        "interval": 1000
    }
};


@Injectable()
export class AutoTraderService {
    constructor(
        private actionsRunnerService: ActionsRunnerService
    ){
        this.init();
    }
    init(){
        this.actionsRunnerService.run(config);
    }
}    
