import { Dependencies, Injectable } from '@nestjs/common';

import { ActionsService } from '../actions/actions.service';

@Injectable()
export class ActionsRunnerService {

    constructor(
        private actionsService: ActionsService
    ){}

    run(config){

        const {
            type, 
            arguments: args
        } = config;

        const heap = {};
        const dependencies = {};
        
        this.actionsService[type](
            args, 
            {
                heap,
                dependencies
            });

    }

}    
