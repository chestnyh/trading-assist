import { Injectable } from '@nestjs/common';

import { RunnerService } from '../runner/runner.service';

@Injectable()
export class AutoTraderService {
    constructor(private runnerService: RunnerService){
        this.startApiConsuming();
    }

    startApiConsuming(){
        console.log(this.runnerService);
        console.log("auto-trader-service");
    }
}    
