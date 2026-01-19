// @ts-ignore
import JL from "json-logic-js";
import moment from "moment";

export function applyJsonLogic(logic: any, data: any): any {
  return JL.apply(logic, data);
}

export function addJsonLogicOperation(name: any, op: any, jl: any = JL): any {
  return jl.add_operation(name, op);
}

export const customJsonLogicOperations: Record<string, any> = {
  CALL: (fn: any, ctx: any, ...args: any[]) => (fn.call(ctx, ...args)),
  JSX: (type: any, props: any) => ({type, props}),
  mergeObjects: (obj1: any, obj2: any) => ({...obj1, ...obj2}),
  fromEntries: (entries: any) => Object.fromEntries(entries),
  //
  // string
  //
  toLowerCase: (str: any) => str.toLowerCase(),
  toUpperCase: (str: any) => str.toUpperCase(),
  strlen: (str: any) => (str?.length || 0),
  regexTest: (str: any, pattern: any, flags: any) => str?.match(new RegExp(pattern, flags)) != null,
  //
  // date / datetime
  //
  "date==": (a: any, b: any) => {
    if (a == null || b == null) {
      return false;
    }
    const dateA = moment(a).startOf("day");
    const dateB = moment(b).startOf("day");
    return dateA.isSame(dateB); 
  },
  "date!=": (a: any, b: any) => { return !customJsonLogicOperations["date=="](a, b); },
  "datetime==": (a: any, b: any) => {
    if (a == null || b == null) {
      return false;
    }
    const dateA = moment(a);
    const dateB = moment(b);
    return dateA.isSame(dateB); 
  },
  "datetime!=": (a: any, b: any) => { return !customJsonLogicOperations["datetime=="](a, b); },
  now: () => new Date(),
  today: () => {
    const start = moment().startOf("day");
    const y = start.year();
    const m = start.month();
    const d = start.date();
    // tip: we use UTC to return same result as eg. new Date("2025-05-16")
    const startUtc = moment.utc([y, m, d]);
    return startUtc.toDate();
  },
  start_of_today: () => { return moment().startOf("day").toDate(); },
  date_add: (date: any, val: any, dim: any) => { return moment(date).add(val, dim).toDate(); },
  datetime_add: (datetime: any, val: any, dim: any) => { return moment(datetime).add(val, dim).toDate(); },
  datetime_truncate: (datetime: any, dim: any) => { return moment(datetime).startOf(dim).toDate(); },
};

export function addRequiredJsonLogicOperations(jl: any = JL): void {
  for (let k in customJsonLogicOperations) {
    addJsonLogicOperation(k, customJsonLogicOperations[k], jl);
  }
}

/**
 * @deprecated
 */
export const jsonLogicFormatConcat = (parts: any): any => {
  if (parts && Array.isArray(parts) && parts.length) {
    return parts
      .map((part: any) => part?.value ?? part)
      .filter((r: any) => r != undefined);
  } else {
    return undefined;
  }
};

/**
 * @deprecated
 */
export const jsonLogicImportConcat = (val: any): any => {
  if (val == undefined)
    return undefined;
  const errors: string[] = [];
  const parts = Array.isArray(val) ? val : [val];
  const res = parts.filter((v: any) => v != undefined).map((v: any) => {
    return {
      type: "property", 
      value: val
    };
  });
  if (errors.length) {
    throw new Error(errors.join("\n"));
  }
  return res;
};