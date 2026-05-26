

export const mongoEmptyValue = (fieldDef: any): string | number => {
  let v: string | number = "";
  const type = fieldDef?.type;
  if (type == "number") {
    v = 0;
  }
  return v;
};

// helpers for mongo format
export const mongoFormatOp1 = (mop: any, mc: any, opNot: any, field: any, _op: any, value: any, not: any, useExpr: any, valueSrc: any, valueType: any, opDef: any, operatorOptions: any, fieldDef: any): any => {
  const $field = typeof field == "string" && !field.startsWith("$") ? "$"+field : field;
  const mv = mc(value, fieldDef);
  if (mv === undefined)
    return undefined;
  let neg: boolean = !!(not ^ opNot);

  if (useExpr && mop == "$nin") {
    // There is only `$in` aggregation operator but not `$nin` (`$nin` is only a query operator)
    // https://www.mongodb.com/docs/manual/reference/operator/aggregation/in/
    neg = !neg;
    mop = "$in";
  }

  if (useExpr && mop == "$regex") {
    // https://stackoverflow.com/questions/35750920/regex-as-filter-in-projection
    let e: any = {
      "$regexFind": {
        input: $field,
        regex: mv
      }
    };
    if (neg) {
      e = { "$not": e };
    }
    return e;
  }

  if (neg) {
    // if (!useExpr && (!mop || mop == "$eq"))
    //   return { [field]: { "$ne": mv } }; // short form
    return !useExpr
      ? { [field]: { "$not": { [mop]: mv } } } 
      : { "$not": { [mop]: [$field, mv] } };
  } else {
    if (!useExpr && (!mop || mop == "$eq"))
      return { [field]: mv }; // short form
    return !useExpr
      ? { [field]: { [mop]: mv } } 
      : { [mop]: [$field, mv] };
  }
};

export const mongoFormatOp2 = (mops: any, opNot: any, field: any, _op: any, values: any, not: any, useExpr: any, valueSrcs: any, valueTypes: any, opDef: any, operatorOptions: any, fieldDef: any): any => {
  const $field = typeof field == "string" && !field.startsWith("$") ? "$"+field : field;
  if (not ^ opNot) {
    return !useExpr
      ? { [field]: { "$not": { [mops[0]]: values[0], [mops[1]]: values[1] } } } 
      : {"$not":
                {"$and": [
                  { [mops[0]]: [ $field, values[0] ] },
                  { [mops[1]]: [ $field, values[1] ] },
                ]}
      };
  } else {
    return !useExpr
      ? { [field]: { [mops[0]]: values[0], [mops[1]]: values[1] } } 
      : {"$and": [
        { [mops[0]]: [ $field, values[0] ] },
        { [mops[1]]: [ $field, values[1] ] },
      ]};
  }
};


export const mongoFieldEscape = (input: string): string => {
  return input.replace(/\$/g, "\uFF04");
};

export const mongoFieldUnescape = (input: string): string => {
  return input.replace(/\uFF04/g, "$");
};
