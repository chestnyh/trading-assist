import { Injectable } from '@nestjs/common';
import { ActionsRunner } from "../actions-runner/actions-runner";
import { ModelsService } from "@trading-bot/models";

@Injectable()
export class AutoTraderService {

    private actionsRunners: ActionsRunner[] = [];

    constructor(
        private modelsService: ModelsService
    ){
        this.init();
    }
    async init(){
        let rules = await this.modelsService.userRules.findMany();

        // Here we should get all users information and should pass it to action runner
        // This information is like user telegram settings, user binance settings, logger, etc...

        rules.forEach(rule => {
            const {ruleBody} = rule;
            const actionsRunner = new ActionsRunner(/* Should pass all things we depends on, like user settings etc. */);
            actionsRunner.run(ruleBody);
            this.actionsRunners.push(actionsRunner);
        });
    }
}    
