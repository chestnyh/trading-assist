import { Injectable } from '@nestjs/common';

import { ActionsService } from '../actions/actions.service';
// import { HeapService } from '../heap/heap.service';

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

        const dependencies = {};
        
        this.actionsService[type](
            args, 
            {
                dependencies
            });

    }

}    
