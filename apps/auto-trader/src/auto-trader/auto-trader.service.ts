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
                            "symbol": "BTCUSDT"
                        }
                    },
                    {
                        "type": "add_to_heap",
                        "arguments": {
                            "items": [
                                {
                                    "key": "test1",
                                    "value": "test2"
                                },
                                {
                                    "key": "test1",
                                    "value": "test2"
                                }
                            ]
                        }
                    },
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
