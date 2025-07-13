import { Injectable } from '@nestjs/common';

import { ActionsHub } from '../actions/action-hub';

@Injectable()
export class ActionsRunner {
    
    private actionsHub: ActionsHub;
    constructor(
        private ruleBody, 
        private settings
    ){
        this.actionsHub = new ActionsHub();
    };

    run(){

        const {
            type, 
            arguments: args
        } = this.ruleBody;
        
        this.actionsHub[type](
            args, 
            {},
            this.settings
        );

    }

}    
