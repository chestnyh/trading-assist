import { Injectable } from '@nestjs/common';

import { ActionsService } from '../actions/actions.service';

@Injectable()
export class ActionsRunnerService {

    constructor(
        private actionsService: ActionsService,
    ){}

    run(config){

        const {
            type, 
            arguments: args
        } = config;

        // console.log("Storage Service: ", this.heapService);
        // const heap = {};
        const dependencies = {};
        
        this.actionsService[type](
            args, 
            {
                // heap,
                dependencies
            });

    }

}    
