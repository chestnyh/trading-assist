import { Injectable } from '@nestjs/common';
import { ActionsRunnerService } from "../actions-runner/actions-runner.service";
import { ModelsService } from "@trading-bot/models";

@Injectable()
export class AutoTraderService {
    constructor(
        private actionsRunnerService: ActionsRunnerService,
        private modelsService: ModelsService
    ){
        this.init();
    }
    async init(){
        let {ruleBody}= await this.modelsService.userRules.findUnique({
            where: {
                id: 1
            }
        });
        console.log(ruleBody);

        this.actionsRunnerService.run(ruleBody);
    }
}    
