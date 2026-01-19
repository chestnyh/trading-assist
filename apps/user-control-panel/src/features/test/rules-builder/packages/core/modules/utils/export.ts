

// @deprecated Use dedicated utils instead
export { mongoEmptyValue } from "./mongoUtils";
export { spelEscape, spelFixList, spelFormatConcat, spelImportConcat } from "./spelUtils";

export const sqlEmptyValue = (fieldDef: any): string => {
  let v = "''";
  const type = fieldDef?.type;
  if (type == "date") {
    //todo: support other SQL dialects?  0001-01-01 for oracle, 1970-01-01 for timestamp
    v = "'0000-00-00'";
  } else if (type == "datetime") {
    v = "'0000-00-00 00:00'";
  } else if (type == "time") {
    v = "'00:00'";
  } else if (type == "number") {
    v = "0";
  }
  return v;
};

export const stringifyForDisplay = (v: any): string => (v == null ? "NULL" : v.toString());

export const wrapWithBrackets = (v: any): any => {
  if (v == undefined)
    return v;
  if (v?.[0] === "(" && v?.[v?.length - 1] === ")") {
    // already wrapped
    return v;
  }
  return "(" + v + ")";
};
