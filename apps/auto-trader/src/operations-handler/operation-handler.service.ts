import { OperationHubService } from "../operations-hub/operations-hub.service";

function getVersions(){
    return ["1.0.0"];
}

function isOperationItem(item: any): boolean {
    const { type, operation } = item;
    return type === "operation" && operation !== undefined;
}

function isConditionItem(item: any): boolean {
    const { type, condition } = item;
    return type === "condition" && condition !== undefined;
}

function isSequenceItem(item: any): boolean {
    const { type, items } = item;
    return type === "sequence" && items !== undefined;
}

function isParallelItem(item: any): boolean {
    const { type, items } = item;
    return type === "parallel" && items !== undefined;
}


export class OperationHandlerService {
    
    constructor(private readonly operationHubService: OperationHubService){}

    async run(operation: any){
        const { version, flow } = operation;
        if(!getVersions().includes(version)){
            throw new Error("Unsupported version");
        }
        await this.executeItem(flow);
    }

    private executeItem(item: any){
        switch(item.type){
            case "condition":
                this.executeCondition(item);
                break;
            case "operation":
                this.executeOperation(item);
                break;
            case "sequence":
                this.executeSequence(item);
                break;
            case "parallel":
                this.executeParallel(item);
                break;
            default:
                throw new Error("Unsupported item type")        
        }
    }

    private executeOperation(item: any){
        if(!isOperationItem(item)){
            throw new Error("Invalid operation item");
        }
        const { operation, args } = item;
        this.operationHubService.call(operation, args);
    }

    private executeCondition(condition: any){
        if(!isConditionItem(condition)){
            throw new Error("Invalid condition item");
        }
        const { __if, __then } = condition;
    }

    private async executeSequence(sequence: any){
        
        if(!isSequenceItem(sequence)){
            throw new Error("Invalid sequence item");
        }

        for (const item of sequence.items) {
            await this.executeItem(item);
        }
    }

    private async executeParallel(parallel: any){

        // TODO review how to execute in parallel correctly
        // What should be returned? and should we return anything?
        // Should we wait for all the operations to finish?
        // What happens if one fails, should we continue?
        // Should we have a limit of concurrent operations?
        // etc

        if(!isParallelItem(parallel)){
            throw new Error("Invalid parallel item");
        }

        const promises = [];
        for (const item of parallel.items) {
            promises.push(this.executeItem(item));
        }
        await Promise.all(promises);
        return;
    }
}