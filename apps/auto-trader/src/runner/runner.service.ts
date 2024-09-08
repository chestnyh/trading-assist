import { Injectable } from '@nestjs/common';

@Injectable()
export class RunnerService {
    constructor(){
        console.log("runner-service");
    }
}    
