import { CollectorService } from '../collector/collector.service';

export class AutoTraderService {
    constructor(private runnerService: CollectorService){
        this.startApiConsuming();
    }

    startApiConsuming(){
        console.log(this.runnerService);
        console.log("auto-trader-service");
    }
}    
