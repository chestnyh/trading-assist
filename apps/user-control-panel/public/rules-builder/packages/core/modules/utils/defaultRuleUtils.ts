import * as Immutable from "immutable";
import { Map, List, OrderedMap } from "immutable";
import uuid from "./uuid";
import {getNewValueForFieldOp} from "./getNewValueForFieldOp";
import { isImmutable } from "./stuff";
import { defaultOperatorOptions, defaultGroupProperties, getDefaultField, getDefaultFieldSrc, getDefaultOperator, defaultGroupConjunction } from "./defaultUtils";
import {validateValue, validateRange} from "./validation";
import { getFieldConfig } from "./configUtils";

export * from "./defaultUtils";



export const defaultRuleProperties = (config: any, parentRuleGroupField: any = null, item: any = null, canUseDefaultFieldAndOp = true, canGetFirst = false): any => {
  let field = null, operator = null, fieldSrc = null;
  const {showErrorMessage} = config.settings;
  if (item) {
    fieldSrc = item?.properties?.fieldSrc;
    field = item?.properties?.field;
    operator = item?.properties?.operator;
  } else if (canUseDefaultFieldAndOp) {
    field = getDefaultField(config, canGetFirst, parentRuleGroupField);
    if (field) {
      fieldSrc = isImmutable(field) ? "func" : "field";
    } else {
      fieldSrc = getDefaultFieldSrc(config);
    }
    operator = getDefaultOperator(config, field, true);
  } else {
    fieldSrc = getDefaultFieldSrc(config);
  }
  let current: any = Map({
    fieldSrc: fieldSrc,
    field: field,
    operator: operator,
    value: List(),
    valueSrc: List(),
    //used for complex operators like proximity
    operatorOptions: defaultOperatorOptions(config, operator, field),
  });
  if (showErrorMessage) {
    current = current.set("valueError", List());
  }
  
  if (field && operator) {
    const canFix = false;
    let {newValue, newValueSrc, newValueType, newValueError, newFieldError} = getNewValueForFieldOp(
      { validateValue, validateRange },
      config, config, current, field, operator, "operator", canFix
    );
    current = current
      .set("value", newValue)
      .set("valueSrc", newValueSrc)
      .set("valueType", newValueType);
    if (showErrorMessage) {
      current = current
        .set("valueError", newValueError)
        .set("fieldError", newFieldError);
    }
  }

  const fieldConfig = getFieldConfig(config, field);
  if (fieldConfig?.type === "!group") {
    const conjunction = defaultGroupConjunction(config, fieldConfig);
    current = current.set("conjunction", conjunction);
  }

  return current; 
};


export const defaultItemProperties = (config: any, item: any): any => {
  return item?.type == "group" 
    ? defaultGroupProperties(config) 
    : defaultRuleProperties(config, null, item);
};

export const defaultRule = (id: any, config: any): any => ({
  [id]: Map({
    type: "rule",
    id: id,
    properties: defaultRuleProperties(config)
  })
});

export const defaultRoot = (config: any, canAddDefaultRule = true): any => {
  return Map({
    type: "group",
    id: uuid(),
    children1: OrderedMap(canAddDefaultRule ? { ...defaultRule(uuid(), config) } : {}),
    properties: defaultGroupProperties(config)
  });
};
