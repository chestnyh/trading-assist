import { Injectable } from '@nestjs/common';

import { ActionsHub } from '../actions/action-hub';

@Injectable()
export class ActionsRunner {
    
    private actionsHub: ActionsHub;
    constructor(
        private ruleBody, 
        private settings,
    ){
        this.actionsHub = new ActionsHub(this.ruleBody, this.settings);
    };

    run(){
        this.actionsHub.run();
    }

    stop(): void {
        this.actionsHub.dispose();
    }

}    
