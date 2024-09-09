import { TradingPair } from "./trading-pair";
import codes from "../../data/codes";

export class RunnerService {

    private tradingPairs: TradingPair[] = [];

    constructor(){
        this.init()
        
    }

    private async init (){
        for(let code of codes){
            this.tradingPairs.push(await TradingPair.create(code))    
        }
        console.log(this.tradingPairs);
    }
}    
