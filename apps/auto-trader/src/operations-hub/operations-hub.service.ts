export class OperationHubService {

    operations: {} = {};
    
    constructor(operations: any){
        this.operations = operations;
    }

    public loadOperations(){
        // load all operations from codebase
    }

    public call(operation: string, args: any){
        if(!this.operations[operation]){
            throw new Error("Operation not found");
        }
        return this.operations[operation](args);
    }
}