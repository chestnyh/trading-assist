import Immutable, {fromJS} from "immutable";
import {toImmutableList} from "../utils/stuff";
import * as constants from "../stores/constants";
import { defaultRuleProperties, defaultGroupProperties } from "../utils/defaultRuleUtils";
import uuid from "../utils/uuid";


/**
 * @param {object} config
 * @param {Immutable.Map} tree
 */
export const setTree = (config: any, tree: any): any => ({
  type: constants.SET_TREE,
  tree: tree,
  config: config
});

/**
 * @param {object} config
 * @param {Immutable.List} path
 * @param {Immutable.Map} properties
 */
export const addRule = (config: any, path: any, properties: any, ruleType: any = "rule", children: any = null, parentRuleGroupField: any = null): any => ({
  type: constants.ADD_RULE,
  ruleType: ruleType,
  children: children,
  path: toImmutableList(path),
  id: uuid(),
  properties: defaultRuleProperties(config, parentRuleGroupField).merge(fromJS(properties) || {}),
  config: config,
  meta: {
    parentRuleGroupField,
  },
});

/**
 * @param {object} config
 * @param {Immutable.List} path
 */
export const removeRule = (config: any, path: any): any => ({
  type: constants.REMOVE_RULE,
  path: toImmutableList(path),
  config: config
});

/**
 * @param {object} config
 * @param {Immutable.List} path
 * @param {Immutable.Map} properties
 */
export const addDefaultCaseGroup = (config: any, path: any, properties: any, children: any = null): any => ({
  type: constants.ADD_CASE_GROUP,
  path: toImmutableList(path),
  children: children,
  id: uuid(),
  properties: defaultGroupProperties(config).merge(fromJS(properties) || {}),
  config: config,
  meta: {
    isDefaultCase: true
  }
});

/**
 * @param {object} config
 * @param {Immutable.List} path
 * @param {Immutable.Map} properties
 */
export const addCaseGroup = (config: any, path: any, properties: any, children: any = null): any => ({
  type: constants.ADD_CASE_GROUP,
  path: toImmutableList(path),
  children: children,
  id: uuid(),
  properties: defaultGroupProperties(config).merge(fromJS(properties) || {}),
  config: config
});

/**
 * @param {object} config
 * @param {Immutable.List} path
 * @param {Immutable.Map} properties
 */
export const addGroup = (config: any, path: any, properties: any, children: any = null, parentRuleGroupField: any = null): any => ({
  type: constants.ADD_GROUP,
  path: toImmutableList(path),
  children: children,
  id: uuid(),
  properties: defaultGroupProperties(config, parentRuleGroupField).merge(fromJS(properties) || {}),
  config: config,
  meta: {
    parentRuleGroupField,
  },
});

/**
 * @param {object} config
 * @param {Immutable.List} path
 */
export const removeGroup = (config: any, path: any): any => ({
  type: constants.REMOVE_GROUP,
  path: toImmutableList(path),
  config: config
});

/**
 * @param {object} config
 * @param {Immutable.List} path
 */
export const removeGroupChildren = (config: any, path: any): any => ({
  type: constants.REMOVE_GROUP_CHILDREN,
  path: toImmutableList(path),
  config: config
});

/**
 * @param {object} config
 * @param {Array} fromPath
 * @param {Array} toPath
 * @param {String} placement, see constants PLACEMENT_*
 */
export const moveItem = (config: any, fromPath: any, toPath: any, placement: any): any => ({
  type: constants.MOVE_ITEM,
  fromPath: toImmutableList(fromPath),
  toPath: toImmutableList(toPath),
  placement: placement,
  config: config,
});
