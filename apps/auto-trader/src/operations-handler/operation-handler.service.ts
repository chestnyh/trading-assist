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
    
    constructor(){

    }

    run(operation: any){
        const { version, flow } = operation;
        if(!getVersions().includes(version)){
            throw new Error("Unsupported version");
        }
        this.executeItem(flow);
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
        console.log(operation, args);
        
    }

    private executeCondition(condition: any){
        // const { condition, then, else } = condition;
    }

    private executeSequence(sequence: any){
        
        if(!isSequenceItem(sequence)){
            throw new Error("Invalid sequence item");
        }

        sequence.items.forEach(item => {
            this.executeItem(item);
        });

    }

    private executeParallel(parallel: any){
        // const { items } = parallel;
    }

    
    

}