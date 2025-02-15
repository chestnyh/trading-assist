class ObjectNavigator {
  
  private data: any = {};
  
  constructor(data?: any) {
    this.data = data ?? {};
  }

  static setValue (key: string, value: any, current: { [key: string]: any } | any[] & { [key: string]: any }){ // TODO check this type

    const isArrayKey = /^\[\d*\]$/.test(key);

    if(!isArrayKey){

      if(Array.isArray(current)){
        throw new Error("Can't set property to an array");  
      }

      current[key] = value;
      return;
    }

    if(!Array.isArray(current)){
      throw new Error("Can't set array to not array");
    }

    if(key === '[]'){
      current.push(value);
      return;
    }

    const match = key.match(/\d+/);
    if (match === null) {
      throw new Error("Invalid array index");
    }

    const index = parseInt(match[0], 10);
    current[index] = value;

  }

  static switchCreateCurrent(currentKey: string, nextKey: string, current: { [key: string]: any } | any[] & { [key: string]: any }){

    const isCurrentKeyArrayElement = /^\[\d*\]$/.test(currentKey);
    const isNextKeyArrayElement = /^\[\d*\]$/.test(nextKey);

    console.log("currentKey =", currentKey);
    console.log("nextKey =", nextKey);
    console.log("current =", current);

    if(!isCurrentKeyArrayElement){

      if(Array.isArray(current)){
        throw new Error("Can't set property to an array")
      }
      
      if(current.hasOwnProperty(currentKey)){
        return current[currentKey];
      }

      current[currentKey] = isNextKeyArrayElement ? [] : {};
      return current[currentKey];

    }
    // Work with current Array
    if(!Array.isArray(current)){
      throw new Error("Can't set array to not array");
    } 

    if(currentKey === '[]'){
      const next = isNextKeyArrayElement ? [] : {};
      current.push(next);
      return current[current.length -1];
    }

    const match = currentKey.match(/\d+/);
    if (match === null) {
      throw new Error("Invalid array syntax");
    }

    const index = parseInt(match[0], 10);
    if(current[index] === undefined){
      throw new Error("Index does not exist");
    };
    return current[index];
  }

  set(key: string, data: any) {

    const keys: string[] = key.split('.');
    let current = this.data;
    
    for (let i = 0; i < keys.length; i++) {

      const isLastIteration = i === keys.length - 1;
      const currentKey: string = keys[i];

      if(isLastIteration){
        ObjectNavigator.setValue(currentKey, data, current);
        return;
      }

      const nextKey = keys[i + 1];

      current = ObjectNavigator.switchCreateCurrent(currentKey, nextKey, current);

    }
  }

  get(key: string, defaultValue?: any): any {
    const keys = key.split('.');
    let current = this.data;

    for (const k of keys) {
      // TODO probably we want to return null. Think about this
      if (current == null) { // null or undefined
        return defaultValue;
      }

      if(Array.isArray(current) && k === '[]'){
        current = current[current.length - 1];
        continue;
      }

      if(Array.isArray(current) && /^\[\d+\]$/.test(k)){
        const stringIndex = k.replace(/\[|\]/g, "");
        const index = parseInt( stringIndex, 10 );
        current = current[index];
        continue;
      }

      if (typeof current === 'object') {
        current = current[k];
        continue;
      }
        
      return defaultValue;
      
    }

    return current !== undefined ? current : defaultValue;
  }

}

export default ObjectNavigator
