type ElementType = 'array' | 'object';

/**
 * 
 * @param value 
 * @returns 
 */
function isArrayIndex(value: string) {
  return typeof value === 'string' && value.match(/^\[\d+\]$/);
}

function isAddLastElementToArray(value: string) {
  return value === '[]';
}

function isPropertyKey(value: string) {
  return typeof value === 'string' 
    && !isArrayIndex(value) 
    && !isAddLastElementToArray(value);
}

function normalizeKey(key: string) {
  if(isArrayIndex(key)) {
    const stringIndex = key.replace('[', '').replace(']', '');
    return parseInt(stringIndex);
  }else if(isAddLastElementToArray(key)) {
    return key;
  }
  else if(isPropertyKey(key)) {
    return key;
  }
  else {
    throw new Error(`Invalid key: ${key}`);
  }
}

function getElementType(key: string): ElementType {
  if(isArrayIndex(key) || isAddLastElementToArray(key)) {
    return 'array';
  }else if(isPropertyKey(key)) {
    return 'object';
  }
  else {
    throw new Error(`Invalid key: ${key}`);
  }
}

export class TradingDataService {
  
  private data: any = {};

  private setContext(key: string, nextKey: string, context: any) {

    const index = normalizeKey(key);

    // If the element exists, return it!
    if(context[index] !== undefined) {
      return context[index];
    }

    // If the element doesn't exists, we should create it!
    // Next element type depends on the next key!
    const nextElementType = getElementType(nextKey);
    const newElement = nextElementType === 'array' ? [] : {};

    if(key === '[]') {
      context.push(newElement);
    }else{
      context[index] = newElement;
    }

    return newElement;
  }

  private setValue(key: string, context: any, value: any) {
    const index = normalizeKey(key);
    if(key === '[]') {
      if(!Array.isArray(context)) {
        throw new Error('Cannot push to a non-array');
      }
      context.push(value);
      return;
    }
    context[index] = value;
    return;
  }

  /**
   * 
   * @param key 
   * @param data 
   */
  public set(key: string, value: any) {
    
    const keys = key.split('.');
    let context = this.data;

    // Possible keys:
    // '<any string>' - set object property
    // '[<number>]' - set array element
    // '[]' - set last array element
    keys.forEach((currentKey, index) => {
      const nextKey = keys[index + 1];
      // If there is no next key, we assume that we should install value to the current context!
      if(nextKey === undefined) {
        return this.setValue(currentKey, context, value);
      }
      context = this.setContext(currentKey, nextKey, context);
    });
  }

  public get(key: string, defaultValue?: any): any {
    const keys = key.split('.');
    let context = this.data;

    for (const key of keys) {
      const index = normalizeKey(key);

      if(index === '[]') {
        context = context[context.length - 1];
      }
      else{
        context = context[index];
      }
      if(context === undefined) {
        return defaultValue;
      }
    }
    return context;
  }
}    
