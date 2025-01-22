import { Injectable } from '@nestjs/common';
import { ActionsRunnerService } from "../actions-runner/actions-runner.service";

const config = {
    "name": "Test simple config",
    "description": "TODO add description",
    "type": "parallel",
    "arguments": {
        "do": [
            {
                "type": "log",
                "arguments": {
                    "message": "Timeout message 1"
                },
            },
            {
                "type": "log",
                "arguments": {
                    "message": "Timeout message 2"
                },
            },
            {
                "type": "log",
                "arguments": {
                    "message": "Timeout message 3"
                },
            }
        ]
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
