import { Injectable } from '@nestjs/common';
import { ActionsRunnerService } from "../actions-runner/actions-runner.service";

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
