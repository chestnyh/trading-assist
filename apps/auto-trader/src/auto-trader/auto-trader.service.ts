import { Injectable } from '@nestjs/common';
import { ActionsRunnerService } from "../actions-runner/actions-runner.service";

const config = {
    "name": "Test simple config",
    "description": "TODO add description",
    "type": "timeout",
    "arguments": {
        "do": {
            "type": "log",
            "arguments": {
                "message": "Timeout"
            }
        },
        "timeout": 1000
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
