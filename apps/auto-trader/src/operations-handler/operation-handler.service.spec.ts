import { OperationHandlerService } from './operation-handler.service';
import { OperationHubService } from '../operations-hub/operations-hub.service';

describe('OperationHandlerService', () => {
  let service: OperationHandlerService;
  let mockOperationHubService: OperationHubService;
  let mockOperations: any;

  beforeEach(() => {
    
  });

  it('should be defined', () => {
    service = new OperationHandlerService(mockOperationHubService);
    expect(service).toBeDefined();
  });

  describe('executeOperation', () => {
    describe('sequence', () => {
      it('should execute some operation', async() => {

        const someOperation = jest.fn();
  
        mockOperations = {
          someOperation
        }
  
        const args = {
          someArgumentHere: "someArgumentValue",
          someOtherArgument: "someOtherArgumentValue"
        }
  
        mockOperationHubService = new OperationHubService(mockOperations);
        service = new OperationHandlerService(mockOperationHubService);
  
        const operation = {
          "version": "1.0.0",
          "flow": {
            "type": "sequence",
            "items":[
              {
                "type": "operation",
                "operation": "someOperation",
                "args": args
              },
            ]
          }
        }
  
        await service.run(operation);
  
        expect(someOperation).toHaveBeenCalled();
        expect(someOperation).toHaveBeenCalledWith(args);
  
      });

      it('should call several operations', async () => {
  
        const operation1 = jest.fn();
        const operation2 = jest.fn();
  
        mockOperations = {
          operation1,
          operation2
        }
  
        const operation1Args = {
          operation1Arg1: "operation1Arg1Value",
          operation1Arg2: "operation1Arg2Value"
        }
  
        const operation2Args = {
          operation2Arg1: "operation2Arg1Value",
          operation2Arg2: "operation2Arg2Value"
        }
  
        mockOperationHubService = new OperationHubService(mockOperations);
        service = new OperationHandlerService(mockOperationHubService);
  
        const operation = {
          "version": "1.0.0",
          "flow": {
            "type": "sequence",
            "items":[
              {
                "type": "operation",
                "operation": "operation1",
                "args": operation1Args
              },
              {
                "type": "operation",
                "operation": "operation2",
                "args": operation2Args
              },
            ]
          }
        }
  
        await service.run(operation);
  
        expect(operation1).toHaveBeenCalled();
        expect(operation1).toHaveBeenCalledWith(operation1Args);
        expect(operation2).toHaveBeenCalled();
        expect(operation2).toHaveBeenCalledWith(operation2Args);
  
      });

      it('should call sequence operations one by one after each finishes', async () => {
        jest.useFakeTimers();
      
        const operation1 = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('result1'), 1000)));
        const operation2 = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('result2'), 1000)));
        const operation3 = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('result3'), 1000)));
      
        mockOperations = { operation1, operation2, operation3 };
      
        mockOperationHubService = new OperationHubService(mockOperations);
        service = new OperationHandlerService(mockOperationHubService);
      
        const operation = {
          "version": "1.0.0",
          "flow": {
            "type": "sequence",
            "items": [
              { "type": "operation", "operation": "operation1" },
              { "type": "operation", "operation": "operation2" },
              { "type": "operation", "operation": "operation3" }
            ]
          }
        };
      
        const runPromise = service.run(operation);
      
        expect(operation1).toHaveBeenCalled();
        expect(operation2).not.toHaveBeenCalled();
        expect(operation3).not.toHaveBeenCalled();
      
        jest.advanceTimersByTime(1000);
        await Promise.resolve();
      
        expect(operation2).toHaveBeenCalled();
        expect(operation3).not.toHaveBeenCalled();
      
        jest.advanceTimersByTime(1000);
        await Promise.resolve();
      
        expect(operation3).toHaveBeenCalled();
      
        jest.advanceTimersByTime(1000);
        await runPromise;
      
        jest.useRealTimers();
      });
    });

    describe('parallel', () => {
      it('should execute some operation', async() => {

        const someOperation = jest.fn();
  
        mockOperations = {
          someOperation
        }

        const args = {
          someArgumentHere: "someArgumentValue",
          someOtherArgument: "someOtherArgumentValue"
        }
        
        mockOperationHubService = new OperationHubService(mockOperations);
        service = new OperationHandlerService(mockOperationHubService);

        const operation = {
          "version": "1.0.0",
          "flow": {
            "type": "parallel",
            "items": [
              { 
                "type": "operation", 
                "operation": "someOperation", 
                "args": args }
            ]
          }
        };

        await service.run(operation);

        expect(someOperation).toHaveBeenCalled();
        expect(someOperation).toHaveBeenCalledWith(args);
        
      });

      it('should execute several operations', async () => { 

        const operation1 = jest.fn();
        const operation2 = jest.fn();
  
        mockOperations = {
          operation1,
          operation2
        }
  
        const operation1Args = {
          operation1Arg1: "operation1Arg1Value",
          operation1Arg2: "operation1Arg2Value"
        }
  
        const operation2Args = {
          operation2Arg1: "operation2Arg1Value",
          operation2Arg2: "operation2Arg2Value"
        }
  
        mockOperationHubService = new OperationHubService(mockOperations);
        service = new OperationHandlerService(mockOperationHubService);
  
        const operation = {
          "version": "1.0.0",
          "flow": {
            "type": "parallel",
            "items":[
              {
                "type": "operation",
                "operation": "operation1",
                "args": operation1Args
              },
              {
                "type": "operation",
                "operation": "operation2",
                "args": operation2Args
              },
            ]
          }
        }
  
        await service.run(operation);
  
        expect(operation1).toHaveBeenCalled();
        expect(operation1).toHaveBeenCalledWith(operation1Args);
        expect(operation2).toHaveBeenCalled();
        expect(operation2).toHaveBeenCalledWith(operation2Args);

      });

      it('should call parallel operations in parallel', async () => {
        jest.useFakeTimers();

        const operation1 = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('result1'), 1000)));
        const operation2 = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('result2'), 1000)));
        const operation3 = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('result3'), 1000)));

        mockOperations = { operation1, operation2, operation3 };

        mockOperationHubService = new OperationHubService(mockOperations);
        service = new OperationHandlerService(mockOperationHubService);

        const operation = {
          "version": "1.0.0",
          "flow": {
            "type": "parallel",
            "items": [
              { "type": "operation", "operation": "operation1" },
              { "type": "operation", "operation": "operation2" },
              { "type": "operation", "operation": "operation3" }
            ]
          }
        };

        const runPromise = service.run(operation);

        expect(operation1).toHaveBeenCalled();
        expect(operation2).toHaveBeenCalled();
        expect(operation3).toHaveBeenCalled();

        jest.advanceTimersByTime(1000);
        await Promise.resolve();

        await runPromise;

        expect(operation1).toHaveBeenCalled();
        expect(operation2).toHaveBeenCalled();
        expect(operation3).toHaveBeenCalled();

        jest.useRealTimers();
      });
    });

    describe('condition', () => {
      it('should execute some operation', async() => {
        // TODO add tests of conditions
      });
    });    



  });
});