import { Injectable } from '@nestjs/common';

import { ActionsHub } from '../actions/action-hub';

@Injectable()
export class ActionsRunner {

    private actionsHub = new ActionsHub()

    constructor(){}

    run(rule){

        const {
            type, 
            arguments: args
        } = rule;

        const dependencies = {};
        
        this.actionsHub[type](
            args, 
            {
                dependencies
            });

    }

}    
