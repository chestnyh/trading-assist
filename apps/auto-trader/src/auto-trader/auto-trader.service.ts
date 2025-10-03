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
        const users = await this.modelsService.user.findMany({
            select: {
              rules: true,
              telegramSettings: true
            },
        });

        users.forEach(user => {
            const {rules, telegramSettings} = user;
            rules.forEach(rule => {
                const {ruleBody} = rule;
                const actionsRunner = new ActionsRunner(ruleBody, {telegramSettings});
                actionsRunner.run();
                this.actionsRunners.push(actionsRunner);
            });
        });
    }
}    
