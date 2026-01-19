import { isObject } from "./stuff";

export const toListValue = (v: any, title?: any): any => {
  if (v == null || v == "") {
    return undefined;
  } else if (isObject(v)) {
    return {
      ...v,
      title: v.title || v.value, // fallback to value
    };
  } else {
    return {
      value: v,
      title: (title !== undefined ? title : ""+v)
    };
  }
};

export const makeCustomListValue = (v: any): any => {
  const lv = toListValue(v);
  if (isObject(lv)) {
    return {
      ...toListValue(v),
      isCustom: true,
    };
  } else { // only if undefined
    return lv;
  }
};

// convert {<value>: <title>, ..} or [value, ..] to normal [{value, title}, ..]
export const listValuesToArray = (listValuesObj: any): any => {
  if (Array.isArray(listValuesObj))
    return listValuesObj.map((v: any) => toListValue(v));
  if (!isObject(listValuesObj))
    return listValuesObj;
  
  let listValuesArr: any[] = [];
  for (let v in listValuesObj) {
    const title = listValuesObj[v];
    listValuesArr.push(toListValue(v, title));
  }
  return listValuesArr;
};

// listValues can be {<value>: <title>, ..} or [{value, title}, ..] or [value, ..]
// todo: same as getListValue() (but args are switched)
export const getItemInListValues = (listValues: any, value: any): any => {
  if (Array.isArray(listValues)) {
    const values = listValues.map((v: any) => toListValue(v));
    return values.find((v: any) => (""+v.value === ""+value));
  } else {
    return listValues[value] !== undefined ? toListValue(value, listValues[value]) : undefined;
  }
};

export const getTitleInListValues = (listValues: any, value: any): any => {
  if (listValues == undefined)
    return value;
  const it = getItemInListValues(listValues, value);
  return it !== undefined ? it.title : value;
};

export const getValueInListValues = (listValues: any, value: any): any => {
  if (listValues == undefined)
    return value;
  const it = getItemInListValues(listValues, value);
  return it !== undefined ? it.value : value;
};

export const mapListValues = (listValues: any, mapFn: any): any[] => {
  let ret: any[] = [];
  if (Array.isArray(listValues)) {
    for (let v of listValues) {
      const lv = mapFn(toListValue(v));
      if (lv != null)
        ret.push(lv);
    }
  } else {
    for (let value in listValues) {
      const lv = mapFn(toListValue(value, listValues[value]));
      if (lv != null)
        ret.push(lv);
    }
  }
  return ret;
};

export const searchListValue = (search: any, listValues: any): any => 
  mapListValues(listValues, (lv: any) => (
    `${lv.value}`.indexOf(search) != -1 || lv.title.indexOf(search) != -1
      ? lv : null
  ))
    .filter((v: any) => v !== null)
    .shift();

export const getListValue = (selectedValue: any, listValues: any): any => 
  mapListValues(listValues, 
    (lv: any) => (""+lv.value === ""+selectedValue ? lv : null)
  )
    .filter((v: any) => v !== null)
    .shift();
