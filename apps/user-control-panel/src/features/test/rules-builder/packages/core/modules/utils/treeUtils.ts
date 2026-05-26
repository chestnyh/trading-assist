import * as Immutable from "immutable";
import { fromJS } from "immutable";
import {toImmutableList, isImmutable, applyToJS as immutableToJs} from "./stuff";
import {getFieldConfig} from "./configUtils";
import uuid from "./uuid";

export {
  toImmutableList, immutableToJs, isImmutable,
};

/**
 * @param {Immutable.List} path
 * @param {...string} suffix
 * @return {Immutable.List}
 */
export const expandTreePath = (path: any, ...suffix: any[]) =>
  path.interpose("children1").withMutations((list: any) => {
    list.skip(1);
    list.push.apply(list, suffix);
    return list;
  });


/**
 * @param {Immutable.List} path
 * @param {...string} suffix
 * @return {Immutable.List}
 */
export const expandTreeSubpath = (path: any, ...suffix: any[]) =>
  path.interpose("children1").withMutations((list: any) => {
    list.push.apply(list, suffix);
    return list;
  });


/**
 * @param {Immutable.Map} tree
 * @param {Immutable.List} path
 * @return {Immutable.Map}
 */
export const getItemByPath = (tree: any, path: any) => {
  let children = Immutable.OrderedMap({ [tree.get("id")] : tree });
  let res = tree;
  path.forEach((id: any) => {
    res = children?.get(id);
    children = res?.get("children1");
  });
  return res;
};


/**
 * @param {Immutable.Map} tree
 * @param {Immutable.List} path
 * @return {field, path}[] ordered by closest
 */
export const getAncestorRuleGroups = (tree: any, path: any) => {
  const parentRuleGroups = path
    .map((_id: any, i: number) => path.take(i+1))
    .reverse()
    .toJS()
    .map((path: any) => ({ item: getItemByPath(tree, path), path }))
    .filter(({ item }: { item: any }) => item?.get("type") === "rule_group");
  if (parentRuleGroups.length) {
    return parentRuleGroups.map(({ item, path }: { item: any, path: any }) => ({
      path,
      field: item.get("properties").get("field"),
    }));
  }
  return [];
};

/**
 * Remove `path` in every item
 * @param {Immutable.Map} tree
 * @return {Immutable.Map} tree
 */
// export const removePathsInTree = (tree) => {
//   let newTree = tree;

//   function _processNode (item, path) {
//     const itemPath = path.push(item.get("id"));
//     if (item.get("path")) {
//       newTree = newTree.removeIn(expandTreePath(itemPath, "path"));
//     }

//     const children = item.get("children1");
//     if (children) {
//       children.map((child, _childId) => {
//         _processNode(child, itemPath);
//       });
//     }
//   }

//   _processNode(tree, new Immutable.List());

//   return newTree;
// };


/**
 * Remove `isLocked` in items that inherit parent's `isLocked`
 * @param {Immutable.Map} tree
 * @return {Immutable.Map} tree
 */
export const removeIsLockedInTree = (tree: any) => {
  let newTree = tree;

  function _processNode (item: any, path: any, isParentLocked = false) {
    const itemPath = path.push(item.get("id"));
    const isLocked = item.getIn(["properties", "isLocked"]);
    if (isParentLocked && isLocked) {
      newTree = newTree.deleteIn(expandTreePath(itemPath, "properties", "isLocked"));
    }

    const children = item.get("children1");
    if (children) {
      children.map((child: any, _childId: any) => {
        _processNode(child, itemPath, isLocked || isParentLocked);
      });
    }
  }

  _processNode(tree, Immutable.List());

  return newTree;
};


/**
 * Set correct `path` and `id` in every item
 * @param {Immutable.Map} tree
 * @return {Immutable.Map} tree
 */
export const fixPathsInTree = (tree: any) => {
  let newTree = tree;

  function _processNode (item: any, path: any, lev: number, nodeId: any) {
    if (!item) return;
    const currPath = item.get("path");
    const currId = item.get("id");
    const itemId = currId || nodeId || uuid();
    const itemPath = path.push(itemId);
    if (!currPath || !currPath.equals(itemPath)) {
      newTree = newTree.setIn(expandTreePath(itemPath, "path"), itemPath);
    }
    if (!currId) {
      newTree = newTree.setIn(expandTreePath(itemPath, "id"), itemId);
    }

    const children = item.get("children1");
    if (children) {
      if (children.constructor.name === "Map") {
        // protect: should be OrderedMap, not Map (issue #501)
        newTree = newTree.setIn(
          expandTreePath(itemPath, "children1"), 
          Immutable.OrderedMap(children)
        );
      }
      children.forEach((child: any, childId: any) => {
        _processNode(child, itemPath, lev + 1, childId);
      });
    }
  }

  _processNode(tree, Immutable.List(), 0, null);


  return newTree;
};

export const fixEmptyGroupsInTree = (tree: any) => {
  let newTree = tree;

  function _processNode (item: any, path: any, lev: number, nodeId: any): boolean {
    if (!item) return false;
    const itemId = item.get("id") || nodeId;
    const itemPath = path.push(itemId);

    const children = item.get("children1");
    if (children) {
      const allChildrenGone = children.map((child: any, childId: any) => {
        return _processNode(child, itemPath, lev + 1, childId);
      }).reduce((curr: boolean, v: boolean) => (curr && v), true);
      if ((children.size == 0 || allChildrenGone) && lev > 0) {
        newTree = newTree.deleteIn(expandTreePath(itemPath));
        return true;
      }
    }
    return false;
  }

  _processNode(tree, Immutable.List(), 0, null);


  return newTree;
};

/**
 * @param {Immutable.Map} tree
 * @return {Object} {flat, items}
 */
export const getFlatTree = (tree: any, config: any) => {
  let flat: any[] = [];
  let items: Record<string, any> = {};
  let cases: any[] = [];
  let visibleHeight = 0; // number of non-collapsed nodes
  let globalLeafCount = 0;
  let globalAtomicCount = 0;
  let globalGroupCount = 0;
  let globalCountByType: Record<string, number> = {};
  // rule_group_ext can be counted as group  (group #x)
  // or by similars (rule-group #x) (NOT both _ext and no ext)

  function _flatizeTree (
    item: any, path: any[], insideCollapsed: boolean, insideLocked: boolean, insideRuleGroup: boolean, lev: number, atomicLev: number, caseId: any, childNo: number | null
  ): void {
    const isRoot = item === tree;
    const type = item.get("type");
    const collapsed = item.get("collapsed");
    const id = item.get("id");
    const children = item.get("children1");
    const isLocked = item.getIn(["properties", "isLocked"]);
    const childrenIds = children ? children.map((_child: any, childId: any) => childId).valueSeq().toArray() : null;
    const isRuleGroup = type === "rule_group";
    const isRule = type === "rule";
    const isGroup = type === "group";
    const isCaseGroup = type === "case_group";
    // tip: count rule_group as 1 atomic rule
    const isAtomicRule = !insideRuleGroup && (!children || isRuleGroup);
    const hasChildren = childrenIds?.length > 0;
    const parentId = path.length ? path[path.length-1] : null;
    const closestRuleGroupId = [...path].reverse().find((id: any) => items[id]?.type == "rule_group");
    const field = item.getIn(["properties", "field"]);
    const fieldConfig = field && config && getFieldConfig(config, field);
    const canRegroup = fieldConfig ? fieldConfig?.canRegroup !== false : undefined;
    const maxNesting = fieldConfig?.maxNesting;
    const closestRuleGroupCanRegroup = items?.[closestRuleGroupId]?.canRegroup;
    const closestRuleGroupMaxNesting = items?.[closestRuleGroupId]?.maxNesting;
    const closestRuleGroupLev = items?.[closestRuleGroupId]?.lev;
    const currentCaseId = isCaseGroup ? id : caseId;

    // Calculations before
    if (isCaseGroup) {
      cases.push(id);
      // reset counters
      globalLeafCount = 0;
      globalAtomicCount = 0;
      globalGroupCount = 0;
      globalCountByType = {};
    }
    const caseNo = currentCaseId ? cases.indexOf(currentCaseId) : null;
    const itemsBefore = flat.length;
    const top = visibleHeight;

    let position: any;
    if (!isRoot) {
      position = {} as any;
      position.caseNo = caseNo;
      position.globalNoByType = isCaseGroup ? caseNo : (globalCountByType[type] || 0);
      position.indexPath = [ ...path.slice(1).map((id: any) => items[id]?.childNo), childNo ];
      if (isRule) {
        position.globalLeafNo = globalLeafCount;
      } else if (isGroup) {
        position.globalGroupNo = globalGroupCount;
      }
    }
    const nextAtomicLev = insideRuleGroup || isRuleGroup ? atomicLev : atomicLev + 1;

    flat.push(id);
    items[id] = {
      node: item,
      index: itemsBefore, // index in `flat`
      id: id,
      type: type,
      parent: parentId,
      children: childrenIds,
      childNo,
      caseId: currentCaseId,
      caseNo,
      closestRuleGroupId,
      closestRuleGroupLev,
      closestRuleGroupMaxNesting,
      closestRuleGroupCanRegroup,
      maxNesting,
      canRegroup,
      path: path.concat(id),
      lev: lev, // depth level (0 for root node)
      atomicLev, // same as lev, but rules inside rule_group retains same number
      nextAtomicLev,
      isLeaf: !children, // is atomic rule OR rule inside rule_group
      isAtomicRule, // is atomic (rule or rule_group, but not rules inside rule_group)
      isLocked: isLocked || insideLocked,
      // vertical
      top: (insideCollapsed ? null : top),
      // for case
      isDefaultCase: isCaseGroup ? !children : undefined,
      atomicRulesCountInCase: isCaseGroup ? 0 : undefined,
      // object with numbers indicating # of item in tree
      position,
      // unused
      collapsed: collapsed,
      _top: itemsBefore,
      parentType: parentId ? items[parentId].type : null,
      // @deprecated use isLeaf instead
      leaf: !children,

      // will be added later:
      //  prev
      //  next
      //  depth  - for any group (children of rule_group are not counted, collapsed are not counted)
      //  height  - visible height
      //  bottom = (insideCollapsed ? null : top + height)
      //  _height = (itemsAfter - itemsBefore)  - real height (incl. collapsed)
    };

    // Calculations before traversing children
    let height = 0;
    let depth = 0;
    if (!insideCollapsed) {
      visibleHeight += 1;
      height += 1;
      if (hasChildren && !collapsed && !isRuleGroup) {
        // tip: don't count children of rule_group
        depth += 1;
      }
      if (!isRoot && !isCaseGroup) {
        isGroup && globalGroupCount++;
        isAtomicRule && globalAtomicCount++;
        isRule && globalLeafCount++;
        globalCountByType[type] = (globalCountByType[type] || 0) + 1;
      }
    }
    if (caseId && isAtomicRule) {
      items[caseId].atomicRulesCountInCase++;
    }

    // Traverse children deeply
    let maxChildDepth = 0;
    let sumHeight = 0;
    if (hasChildren) {
      let childCount = 0;
      children.forEach((child: any, childId: any) => {
        if (child) {
          _flatizeTree(
            child, 
            path.concat(id), 
            insideCollapsed || collapsed, insideLocked || isLocked, insideRuleGroup || isRuleGroup,
            lev + 1, nextAtomicLev,
            currentCaseId, childCount
          );
          const childItem = items[childId];
          // Calculations after deep traversing 1 child
          maxChildDepth = Math.max(maxChildDepth, childItem?.depth || 0);
          sumHeight += childItem?.height || 0;
          childCount++;
        }
      });
    }

    // Calculations after deep traversing ALL children
    height += sumHeight;
    depth += maxChildDepth;
    const itemsAfter = flat.length;
    const _height = itemsAfter - itemsBefore;
    const bottom = (insideCollapsed ? null : top + height);

    Object.assign(items[id], {
      depth: children ? depth : undefined,
      _height,
      height,
      bottom,
    });
  }

  // Start recursion
  _flatizeTree(tree, [], false, false, false, 0, 0, null, null);

  // Calc after recursion
  for (let i = 0 ; i < flat.length ; i++) {
    const prevId = i > 0 ? flat[i-1] : null;
    const nextId = i < (flat.length-1) ? flat[i+1] : null;
    let item = items[flat[i]];
    item.prev = prevId;
    item.next = nextId;
  }

  return {flat, items, cases};
};


/**
 * Returns count of reorderable(!) nodes
 * @param {Immutable.Map} tree
 * @return {Integer}
 */
export const getTotalReordableNodesCountInTree = (tree: any) => {
  if (!tree)
    return -1;
  let cnt = 0;

  function _processNode (item: any, path: any[], lev: number): void {
    let id, children, type;
    if (typeof item.get === "function") {
      id = item.get("id");
      children = item.get("children1");
      type = item.get("type");
    } else {
      id = item.id;
      children = item.children1;
      type = item.type;
    }
    cnt++;
    if (type == "rule_group" && lev > 0) {
      //tip: rules in rule-group can be reordered only inside
    } else if (children) {
      children.forEach((child: any, _childId: any) => {
        if (child) {
          _processNode(child, path.concat(id), lev + 1);
        }
      });
    }
  }

  _processNode(tree, [], 0);
    
  return cnt - 1; // -1 for root
};

/**
 * Returns count of atomic rules (i.e. don't count groups; count rule_group as 1 atomic rule)
 * @param {Immutable.Map} tree
 * @return {Integer}
 */
export const getTotalRulesCountInTree = (tree: any) => {
  if (!tree)
    return -1;
  let cnt = 0;

  function _processNode (item: any, path: any[], lev: number): void {
    let id, children, type;
    if (typeof item.get === "function") {
      id = item.get("id");
      children = item.get("children1");
      type = item.get("type");
    } else {
      id = item.id;
      children = item.children1;
      type = item.type;
    }
    
    if (type == "rule" || type == "rule_group" && lev > 0) {
      // tip: count rule_group as 1 rule
      cnt++;
    } else if (children) {
      children.forEach((child: any, _childId: any) => {
        if (child) {
          _processNode(child, path.concat(id), lev + 1);
        }
      });
    }
  }

  _processNode(tree, [], 0);
    
  return cnt;
};


// Remove fields that can be calced: "id", "path"
// Remove empty fields: "operatorOptions"
export const getLightTree = (tree: any, deleteExcess = true, children1AsArray = true) => {
  let newTree = tree;

  function _processNode (item: any, itemId: any): void {
    if (deleteExcess && item.path) {
      delete item.path;
    }
    if (deleteExcess && !children1AsArray && itemId) {
      delete item.id;
    }
    let properties = item.properties;
    if (properties) {
      if (properties.operatorOptions == null) {
        delete properties.operatorOptions;
      }
    }

    const children = item.children1;
    if (children) {
      for (let id in children) {
        if (children[id]) {
          _processNode(children[id], id);
        }
      }
      if (children1AsArray) {
        item.children1 = Object.values(children);
      }
    }
  }

  _processNode(tree, null);

  return newTree;
};

export const getSwitchValues = (tree: any) => {
  let vals: any[] = [];
  const children = tree.get("children1");
  if (children) {
    children.forEach((child: any) => {
      const value = child.getIn(["properties", "value"]);
      let caseValue;
      if (value && value.size == 1) {
        caseValue = value.get(0);
        if (Array.isArray(caseValue) && caseValue.length == 0) {
          caseValue = null;
        }
      } else {
        caseValue = null;
      }
      vals = [...vals, caseValue];
    });
  }

  return vals;
};

export const isEmptyTree = (tree: any) => (!tree.get("children1") || tree.get("children1").size == 0);

export const hasChildren = (tree: any, path: any) => tree.getIn(expandTreePath(path, "children1")).size > 0;


export const _fixImmutableValue = (v: any): any => {
  if (v?.toJS) {
    const vJs = v?.toJS?.();
    if (vJs?.func) {
      // `v` is a func, keep Immutable
      return v.toOrderedMap();
    } else {
      // for values of multiselect use Array instead of List
      return vJs;
    }
  } else {
    return v;
  }
};

export function jsToImmutable(tree: any): any {
  const imm = fromJS(tree, function (key: any, value: any, path: any) {
    const isFuncArg = path
      && path.length > 3
      && path[path.length-1] === "value"
      && path[path.length-3] === "args";
    const isRuleValue = path
      && path.length > 3
      && path[path.length-1] === "value"
      && path[path.length-2] === "properties";

    let outValue;
    if (key == "properties") {
      outValue = value.toOrderedMap();

      // `value` should be undefined instead of null
      // JSON doesn't support undefined and replaces undefined -> null
      // So fix: null -> undefined
      for (let i = 0 ; i < 2 ; i++) {
        if (outValue.get("value")?.get?.(i) === null) {
          outValue = outValue.setIn(["value", i], undefined);
        }
      }
    } else if (isFuncArg) {
      outValue = _fixImmutableValue(value);
    } else if ((path ? isRuleValue : key == "value") && (value && typeof value.toList === "function" && Array.isArray(value.toArray?.()))) {
      outValue = value.map(_fixImmutableValue).toList();
    } else if (key == "asyncListValues") {
      // keep in JS format
      outValue = value.toJS();
    } else if (key == "children1" && (value && typeof value.toList === "function" && Array.isArray(value.toArray?.()))) {
      const mapped = value.map((child: any) => [child?.get("id") || uuid(), child]);
      outValue = Immutable.OrderedMap(mapped.toArray ? mapped.toArray() : Array.from(mapped));
    } else {
      outValue = Immutable.isIndexed(value) ? value.toList() : value.toOrderedMap();
    }
    return outValue;
  });
  return imm;
}
