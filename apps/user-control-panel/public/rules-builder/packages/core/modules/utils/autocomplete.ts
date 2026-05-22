import {sleep} from "./stuff";
import {listValuesToArray, getListValue, makeCustomListValue} from "./listValues";

// simple polyfill for Next
const findLastIndex = (arr: any, fn: any) => {
  if (arr.findLastIndex) {
    return arr.findLastIndex(fn);
  } else {
    const ind = [...arr].reverse().findIndex(fn);
    return ind == -1 ? -1 : (arr.length-1 - ind);
  }
};

export const simulateAsyncFetch = (all: any, cPageSize = 0, delay = 1000) => async (search: any, offset: any, meta: any) => {
  if (delay) {
    // console.debug("simulateAsyncFetch", {
    //   search, offset, values, hasMore, filtered
    // });
    await sleep(delay);
  }
  
  const isFetchSelectedValues = !!meta?.fetchSelectedValues && Array.isArray(search);
  if (isFetchSelectedValues) {
    const values = listValuesToArray(all)
      .filter(({value}: any) => search.includes(value));
    return {
      values
    };
  }

  const pageSize = meta?.pageSize != undefined ? meta.pageSize : cPageSize;
  const filtered = listValuesToArray(all)
    .filter(({title, value}: {title: any, value: any}) => search == null ? true : (
      title.toUpperCase().indexOf(search.toUpperCase()) != -1
      || `${value}`.toUpperCase().indexOf(search.toUpperCase()) != -1
    ));
  const pages = pageSize ? Math.ceil(filtered.length / pageSize) : 0;
  const currentOffset = offset || 0;
  const currentPage = pageSize ? Math.ceil(currentOffset / pageSize) : null;
  const values = pageSize ? filtered.slice(currentOffset, currentOffset + pageSize) : filtered;
  const newOffset = pageSize ? currentOffset + values.length : null;
  const hasMore = pageSize ? (newOffset < filtered.length) : false;
  return {
    values,
    hasMore
  };
};

export const mergeListValues = (values: any, newValues: any, toStart = false, hideNewValues = false) => {
  if (!newValues)
    return values;
  const old = values || [];
  const newFiltered = newValues
    .filter((v: any) => old.find((av: any) => ""+av.value == ""+v.value) == undefined)
    .map((v: any) => (hideNewValues ? {...v, isHidden: true} : v));
  const merged = toStart ? [...newFiltered, ...old] : [...old, ...newFiltered];
  return merged;
};

export const optionToListValue = (val: any, listValues: any, allowCustomValues: any) => {
  const v = val == null || val == "" ? undefined : (val?.value ?? val);
  const item = getListValue(v, listValues);
  const customItem = allowCustomValues && !item ? makeCustomListValue(v) : undefined;
  const listValue = item || customItem;
  const lvs = listValue ? [listValue] : undefined; //not allow []
  return [v, lvs];
};

export const optionsToListValues = (vals: any, listValues: any, allowCustomValues: any) => {
  const newSelectedListValues = vals.map((val: any, _i: any) => {
    const v = val == null || val == "" ? undefined : (val?.value ?? val);
    const item = getListValue(v, listValues);
    const customItem = allowCustomValues && !item ? makeCustomListValue(v) : undefined;
    const listValue = item || customItem;
    return listValue;
  }).filter((o: any) => o != undefined);
  let newSelectedValues = newSelectedListValues
    .map((o: any) => (o?.value ?? o));
  if (!newSelectedValues.length)
    newSelectedValues = undefined; //not allow []
  return [newSelectedValues, newSelectedListValues];
};

export const listValueToOption = (lv: any) => {
  if (lv == null) return null;
  const {
    title, value, disabled, groupTitle, grouplabel, renderTitle, children, label, isCustom, isHidden,
    ...rest
  } = lv;
  let option: any = {
    value,
    title: title || label || children, // fix issue #930 for AntD
  };
  if (disabled)
    option.disabled = disabled;
  if (isCustom)
    option.isCustom = isCustom;
  if (isHidden)
    option.isHidden = isHidden;
  // group
  if (groupTitle || grouplabel)
    option.groupTitle = groupTitle || grouplabel;
  // used only for MUI field autocomplete (if matchesType, render as bold)
  if (renderTitle)
    option.renderTitle = renderTitle;
  option = {
    ...option,
    ...rest,
  };
  return option;
};

export const fixListValuesGroupOrder = (listValues: any) => {
  let newValues: any[] = [];
  let groupTitles: any[] = [];
  for (let lv of listValues) {
    const i = findLastIndex(newValues, (lv1: any) => {
      return (lv1.groupTitle ?? "") == (lv.groupTitle ?? "");
    });
    if (lv.groupTitle != undefined && !groupTitles.includes(lv.groupTitle)) {
      groupTitles.push(lv.groupTitle);
      if (groupTitles.length === 1) {
        // fix empty groupTitles
        newValues = newValues.map(nv => ({...nv, groupTitle: ""}));
      }
    }
    if (lv.groupTitle == undefined && groupTitles.length) {
      // fix empty groupTitle
      lv = {...lv, groupTitle: ""};
    }
    if (i != -1) {
      newValues.splice(i+1, 0, lv);
    } else {
      newValues.push(lv);
    }
  }
  return newValues as any[];
};


export { getListValue };
