export class TradingDataService {

    private data: any = {};

    set(key: string, data: any) {
        const keys = key.split(/\.|\[|\]/).filter(k => k !== '');
        let current = this.data;
      
        for (let i = 0; i < keys.length - 1; i++) {
          const k = keys[i];
          const nextKey = keys[i + 1];
          const isNextKeyNumeric = /^\d+$/.test(nextKey);
          const isNextKeyEmpty = nextKey === '';
      
          if (current[k] === undefined) {
            current[k] = isNextKeyNumeric || isNextKeyEmpty ? [] : {};
          }
          current = current[k];
        }
      
        const lastKey = keys[keys.length - 1];
        if (lastKey === '') {
          // Push to the end of the array
          if (!Array.isArray(current)) {
            throw new Error('Cannot push to a non-array');
          }
          current.push(data);
        } else if (/^\d+$/.test(lastKey)) {
          // Set at specific index
          const index = parseInt(lastKey, 10);
          if (!Array.isArray(current)) {
            current = [];
          }
          current[index] = data;
        } else {
          // Set object property
          current[lastKey] = data;
        }
      }

      get(key: string, defaultValue?: any): any {
        const keys = key.split(/\.|\[|\]/).filter(k => k !== '');
        let current = this.data;
      
        for (const k of keys) {
          if (current == null) {
            return defaultValue;
          }
      
          if (Array.isArray(current)) {
            if (k === '') {
              // Handle '[]' syntax to get the last element
              current = current[current.length - 1];
            } else {
              const index = parseInt(k, 10);
              if (isNaN(index)) {
                return defaultValue;
              }
              current = current[index];
            }
          } else if (typeof current === 'object') {
            current = current[k];
          } else {
            return defaultValue;
          }
        }
      
        return current !== undefined ? current : defaultValue;
      }
}    
