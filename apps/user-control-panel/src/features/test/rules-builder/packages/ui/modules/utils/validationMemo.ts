import {immutableEqual} from "./stuff";
import { Utils } from "../../../core/modules";
const { validateAndFixTree } = Utils.Validation;

export const createValidationMemo = () => {
  let originalTree: any;
  let validatedTree: any;
  let configId: any;

  return (config: any, tree: any, oldConfig = undefined, sanitizeTree = true) => {
    if (!tree) {
      return null;
    }
    if (config.__configId === configId && (immutableEqual(tree, originalTree) || immutableEqual(tree, validatedTree))) {
      return validatedTree;
    } else {
      configId = config.__configId;
      originalTree = tree;
      if (sanitizeTree === false) {
        validatedTree = validateAndFixTree(tree, null, config, oldConfig || config, false, false, false);
      } else {
        validatedTree = validateAndFixTree(tree, null, config, oldConfig || config);
      }
      return validatedTree;
    }
  };
};
