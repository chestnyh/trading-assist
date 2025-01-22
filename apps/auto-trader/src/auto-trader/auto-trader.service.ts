import { Injectable } from '@nestjs/common';
import { ActionsRunnerService } from "../actions-runner/actions-runner.service";

const config = {
    name: "Test simple config",
    type: "interval",
    arguments: {
        do: {
            type: "log",
            arguments: {
                message: "Some message"
            }
        },
        interval: 10000
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
