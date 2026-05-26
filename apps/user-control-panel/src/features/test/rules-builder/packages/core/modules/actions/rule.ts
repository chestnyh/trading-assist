import * as constants from "../stores/constants";
import {toImmutableList} from "../utils/stuff";

/**
 * @param {object} config
 * @param {Immutable.List} path
 * @param {string} field
 */
export const setField = (config: any, path: any, field: any, asyncListValues: any, _meta: any): any => ({
  type: constants.SET_FIELD,
  path: toImmutableList(path),
  field,
  config,
  asyncListValues,
  _meta,
});

/**
 * @param {object} config
 * @param {Immutable.List} path
 * @param {*} srcKey
 */
export const setFieldSrc = (config: any, path: any, srcKey: any): any => ({
  type: constants.SET_FIELD_SRC,
  path: toImmutableList(path),
  srcKey: srcKey,
  config: config,
});

/**
 * @param {object} config
 * @param {Immutable.List} path
 * @param {string} operator
 */
export const setOperator = (config: any, path: any, operator: any): any => ({
  type: constants.SET_OPERATOR,
  path: toImmutableList(path),
  operator: operator,
  config: config
});

/**
 * @param {object} config
 * @param {Immutable.List} path
 * @param {integer} delta
 * @param {*} value
 * @param {string} valueType
 * @param {*} asyncListValues
 */
export const setValue = (config: any, path: any, delta: any, value: any, valueType: any, asyncListValues: any, _meta: any): any => ({
  type: constants.SET_VALUE,
  path: toImmutableList(path),
  delta,
  value,
  valueType,
  asyncListValues,
  config,
  _meta,
});

/**
 * @param {object} config
 * @param {Immutable.List} path
 * @param {integer} delta
 * @param {*} srcKey
 */
export const setValueSrc = (config: any, path: any, delta: any, srcKey: any, _meta: any): any => ({
  type: constants.SET_VALUE_SRC,
  path: toImmutableList(path),
  delta,
  srcKey,
  config,
  _meta,
});

/**
 * @param {object} config
 * @param {Immutable.List} path
 * @param {integer} delta
 * @param {Array} parentFuncs
 * @param {string | null} argKey
 * @param {*} value
 * @param {string | "!valueSrc"} valueType
 * @param {*} asyncListValues
 */
export const setFuncValue = (config: any, path: any, delta: any, parentFuncs: any, argKey: any, value: any, valueType: any, asyncListValues: any, _meta: any): any => ({
  type: constants.SET_FUNC_VALUE,
  path: toImmutableList(path),
  delta,
  parentFuncs,
  argKey,
  value,
  valueType,
  asyncListValues,
  config,
  _meta,
});

/**
 * @param {object} config
 * @param {Immutable.List} path
 * @param {string} name
 * @param {*} value
 */
export const setOperatorOption = (config: any, path: any, name: any, value: any): any => ({
  type: constants.SET_OPERATOR_OPTION,
  path: toImmutableList(path),
  name: name,
  value: value,
  config: config
});
