// TODO move this to a shared library
const getValueByPath = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => (current ? current[key] : undefined), obj);
};

const conditionHandlers = {
    '__eq': (params: { value: string; equalTo: any }, checkObj: any): boolean => {
      const { value, equalTo } = params;
      const objValue = getValueByPath(checkObj, value);
      return objValue === equalTo;
    },
    '__neq': (params: { value: string; notEqualTo: any }, checkObj: any): boolean => {
      const { value, notEqualTo } = params;
      const objValue = getValueByPath(checkObj, value);
      return objValue !== notEqualTo;
    },
    '__gt': (params: { value: string; greaterThan: number }, checkObj: any): boolean => {
      const { value, greaterThan } = params;
      const objValue = getValueByPath(checkObj, value);
      return objValue > greaterThan;
    },
    '__gte': (params: { value: string; greaterThanOrEqualTo: number }, checkObj: any): boolean => {
        const { value, greaterThanOrEqualTo } = params;
        const objValue = getValueByPath(checkObj, value);
        return objValue >= greaterThanOrEqualTo;
    },
    '__lt': (params: { value: string; lessThan: number }, checkObj: any): boolean => {
        const { value, lessThan } = params;
        const objValue = getValueByPath(checkObj, value);
        return objValue < lessThan;
    },
    '__lte': (params: { value: string; lessThanOrEqualTo: number }, checkObj: any): boolean => {
        const { value, lessThanOrEqualTo } = params;
        const objValue = getValueByPath(checkObj, value);
        return objValue <= lessThanOrEqualTo;
    },
};

export const logicalConnectors = {
    '__and': (params: any[], checkObj: any, evaluateCondition: Function): boolean => {
      return params.every((cond) => evaluateCondition(cond, checkObj));
    },
  
    '__or': (params: any[], checkObj: any, evaluateCondition: Function): boolean => {
      return params.some((cond) => evaluateCondition(cond, checkObj));
    },
}

const allHandlers = {
    ...conditionHandlers, 
    ...logicalConnectors
};

export class ConditionsHubService {

    private logicalConnectorsNames: string[] = Object.keys(logicalConnectors);

    public evaluate(conditions: any, checkObj: any): boolean {
      return this.evaluateCondition(conditions, checkObj);
    }
  
    private evaluateCondition(condition: any, checkObj: any): boolean {
      const operatorKeys = Object.keys(condition);
  
      if (operatorKeys.length !== 1) {
        throw new Error('Each condition must contain exactly one operator.');
      }
  
      const operatorKey = operatorKeys[0];
      const operatorFunc = allHandlers[operatorKey];
  
      if (!operatorFunc) {
        throw new Error(`Operator ${operatorKey} is not defined.`);
      }
  
      const params = condition[operatorKey];
  
      if (this.logicalConnectorsNames.includes(operatorKey)) {
        // TODO check why we are doing bind here
        return operatorFunc(params, checkObj, this.evaluateCondition.bind(this));
      } else {
        // For comparison operators
        return operatorFunc(params, checkObj);
      }
    }
  }