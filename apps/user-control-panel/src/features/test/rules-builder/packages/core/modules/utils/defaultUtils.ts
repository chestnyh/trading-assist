import * as Immutable from "immutable";
import { Map, List } from "immutable";
import {getFieldConfig, getFieldParts, getFirstField, getOperatorConfig, getFirstOperator} from "./configUtils";
import { isImmutable, isImmutableList } from "./stuff";
import { jsToImmutable } from "./treeUtils";


// @deprecated Use defaultGroupConjunction
export const defaultConjunction = (config: any) => defaultGroupConjunction(config);

//used for complex operators like proximity
export const defaultOperatorOptions = (config: any, operator: any, field: any) => {
  let operatorConfig = operator ? getOperatorConfig(config, operator, field) : null;
  if (!operatorConfig)
    return null; //new Immutable.Map();
  return operatorConfig.options ? Map(
    operatorConfig.options
    && operatorConfig.options.defaults || {}
  ) : null;
};

export const defaultGroupConjunction = (config: any, groupFieldConfig: any = null) => {
  groupFieldConfig = getFieldConfig(config, groupFieldConfig); // if `groupFieldConfig` is field name, not config
  const conjs = groupFieldConfig?.conjunctions || Object.keys(config.conjunctions);
  if (conjs.length == 1)
    return conjs[0];
  // todo: config.settings.defaultGroupConjunction is deprecated, defaultConjunction should be used instead
  return groupFieldConfig?.defaultConjunction || config.settings.defaultConjunction || config.settings.defaultGroupConjunction || conjs[0];
};

export const defaultGroupProperties = (config: any, groupFieldConfig: any = null) => {
  return Map({
    conjunction: defaultGroupConjunction(config, groupFieldConfig),
    not: false
  });
};

export const getDefaultField = (config: any, canGetFirst = true, parentRuleGroupField: any = null) => {
  const {defaultField} = config.settings;
  let f = (!parentRuleGroupField ? defaultField : getDefaultSubField(config, parentRuleGroupField))
    || canGetFirst && getFirstField(config, parentRuleGroupField)
    || null;
  // if default LHS is func, convert to Immutable
  if (f != null && typeof f !== "string" && !isImmutable(f)) {
    f = jsToImmutable(f);
  }
  return f;
};

export const getDefaultSubField = (config: any, parentRuleGroupField: any = null) => {
  if (!parentRuleGroupField)
    return null;
  const fieldSeparator = config?.settings?.fieldSeparator || ".";
  const parentRuleGroupConfig = getFieldConfig(config, parentRuleGroupField);
  let f = parentRuleGroupConfig?.defaultField;
  if (f) {
    f = [...getFieldParts(parentRuleGroupField), f].join(fieldSeparator);
  }
  return f;
};

export const getDefaultFieldSrc = (config: any, canGetFirst = true) => {
  return canGetFirst && config.settings.fieldSources?.[0] || "field";
};

export const getDefaultOperator = (config: any, field: any, canGetFirst = true) => {
  const fieldConfig = getFieldConfig(config, field);
  const fieldOperators = fieldConfig?.operators || [];
  let {defaultOperator: globalDefaultOperator} = config.settings;
  if (globalDefaultOperator && !fieldOperators.includes(globalDefaultOperator))
    globalDefaultOperator = null;
  const fieldDefaultOperator = fieldConfig?.defaultOperator;
  const fieldOwnDefaultOperator = fieldConfig?.ownDefaultOperator;
  const firstOperator = canGetFirst ? getFirstOperator(config, field) : null;
  const op = fieldOwnDefaultOperator || globalDefaultOperator || fieldDefaultOperator || firstOperator;
  return op;
};


export const createListWithOneElement = (el: any) => {
  if (isImmutableList(el))
    return el; // already Immutable list
  return createListFromArray([el]);
};

export const createListFromArray = (arr: any) => {
  if (isImmutableList(arr))
    return arr; // already Immutable list
  return List(arr);
};

export const emptyProperties = () => Map();

