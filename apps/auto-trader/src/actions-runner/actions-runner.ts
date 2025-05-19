import { Injectable } from '@nestjs/common';

import { ActionsHub } from '../actions/action-hub';

@Injectable()
export class ActionsRunner {

    private actionsHub = new ActionsHub()
    constructor(
        private ruleBody, 
        private settings
    ){}

    run(){

        const {
            type, 
            arguments: args
        } = this.ruleBody;
        
        this.actionsHub[type](
            args, 
            {
                settings: this.settings
            });

    }

}    
