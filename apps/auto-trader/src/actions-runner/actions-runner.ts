import { Injectable } from '@nestjs/common';

import { ActionsHub } from '../actions/action-hub';
import { RuleLogsService } from '../auto-trader/rule-logs.service';

@Injectable()
export class ActionsRunner {

    private actionsHub: ActionsHub;
    constructor(
        private ruleId: number,
        private userId: number,
        private ruleBody: any,
        private settings: any,
        private runId: string,
        private ruleLogsService: RuleLogsService,
    ){
        this.actionsHub = new ActionsHub(this.ruleId, this.userId, this.ruleBody, this.settings, this.runId, this.ruleLogsService);
    };

    run(){
        this.actionsHub.run();
    }

    stop(): void {
        this.actionsHub.dispose();
    }

}    
