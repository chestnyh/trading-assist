import React, { PureComponent } from "react";
import Rule from "./Rule";
import Group from "./Group";
import RuleGroup from "./RuleGroup";
import RuleGroupExt from "./RuleGroupExt";
import SwitchGroup from "./SwitchGroup";
import CaseGroup from "./CaseGroup";

const types = [
  "rule",
  "group",
  "rule_group",
  "switch_group",
  "case_group"
];

const getProperties = (props: any): any => {
  const properties = props.properties?.toObject() || {};
  const result = {...properties};
  if (props.isParentLocked) {
    result.isLocked = true;
  }
  if (properties.isLocked) {
    result.isTrueLocked = true;
  }
  return result;
};

const typeMap: Record<string, (props: any) => React.ReactElement | null> = {
  rule: (props: any) => (
    <Rule
      {...getProperties(props)}
      id={props.id}
      groupId={props.groupId}
      path={props.path}
      actions={props.actions}
      reordableNodesCnt={props.reordableNodesCnt}
      totalRulesCnt={props.totalRulesCnt}
      config={props.config}
      onDragStart={props.onDragStart}
      isDraggingTempo={props.isDraggingTempo}
      parentField={props.parentField}
      parentFieldPathSize={props.parentFieldPathSize}
      parentReordableNodesCnt={props.parentReordableNodesCnt}
      parentFieldCanReorder={props.parentFieldCanReorder}
    />
  ),
  group: (props: any) => (
    <Group 
      {...getProperties(props)}
      id={props.id}
      groupId={props.groupId}
      path={props.path}
      actions={props.actions}
      config={props.config}
      reordableNodesCnt={props.reordableNodesCnt}
      totalRulesCnt={props.totalRulesCnt}
      onDragStart={props.onDragStart}
      isDraggingTempo={props.isDraggingTempo}
      children1={props.children1}
      parentField={props.parentField}
      parentFieldPathSize={props.parentFieldPathSize}
      parentReordableNodesCnt={props.parentReordableNodesCnt}
      parentFieldCanReorder={props.parentFieldCanReorder}
    />
  ),
  rule_group: (props: any) => (
    <RuleGroup 
      {...getProperties(props)}
      id={props.id}
      groupId={props.groupId}
      path={props.path}
      actions={props.actions}
      config={props.config}
      reordableNodesCnt={props.reordableNodesCnt}
      totalRulesCnt={props.totalRulesCnt}
      onDragStart={props.onDragStart}
      isDraggingTempo={props.isDraggingTempo}
      children1={props.children1}
      parentField={props.parentField}
      parentFieldPathSize={props.parentFieldPathSize}
      parentReordableNodesCnt={props.parentReordableNodesCnt}
      parentFieldCanReorder={props.parentFieldCanReorder}
    />
  ),
  rule_group_ext: (props: any) => (
    <RuleGroupExt 
      {...getProperties(props)}
      id={props.id}
      groupId={props.groupId}
      path={props.path}
      actions={props.actions}
      config={props.config}
      reordableNodesCnt={props.reordableNodesCnt}
      totalRulesCnt={props.totalRulesCnt}
      onDragStart={props.onDragStart}
      isDraggingTempo={props.isDraggingTempo}
      children1={props.children1}
      parentField={props.parentField}
      parentFieldPathSize={props.parentFieldPathSize}
      parentReordableNodesCnt={props.parentReordableNodesCnt}
      parentFieldCanReorder={props.parentFieldCanReorder}
    />
  ),
  switch_group: (props: any) => (
    <SwitchGroup 
      {...getProperties(props)}
      id={props.id}
      groupId={props.groupId}
      path={props.path}
      actions={props.actions}
      config={props.config}
      reordableNodesCnt={props.reordableNodesCnt}
      totalRulesCnt={props.totalRulesCnt}
      onDragStart={props.onDragStart}
      isDraggingTempo={props.isDraggingTempo}
      children1={props.children1}
      parentField={null}
      parentReordableNodesCnt={props.parentReordableNodesCnt}
    />
  ),
  case_group: (props: any) => (
    <CaseGroup 
      {...getProperties(props)}
      id={props.id}
      groupId={props.groupId}
      path={props.path}
      actions={props.actions}
      config={props.config}
      reordableNodesCnt={props.reordableNodesCnt}
      totalRulesCnt={props.totalRulesCnt}
      onDragStart={props.onDragStart}
      isDraggingTempo={props.isDraggingTempo}
      children1={props.children1}
      parentField={null}
      parentReordableNodesCnt={props.parentReordableNodesCnt}
    />
  ),
};


interface ItemProps {
  config: any;
  id: string;
  groupId?: string;
  type: typeof types[number];
  path: any; // Immutable.List
  properties?: any; // Immutable.Map
  children1?: any; // Immutable.OrderedMap
  actions: any;
  reordableNodesCnt?: number;
  totalRulesCnt?: number;
  onDragStart?: any;
  parentField?: string;
  isDraggingTempo?: boolean;
  isParentLocked?: boolean;
  parentFieldPathSize?: number;
  parentReordableNodesCnt?: number;
  parentFieldCanReorder?: boolean;
}

class Item extends PureComponent<ItemProps> {
  render(): React.ReactElement | null {
    const { type, ...props } = this.props;
    const mode = props.properties?.get("mode");
    const postfix = mode == "array" ? "_ext" : "";    
    const renderItem = props.config.settings.renderItem;
    let Cmp = typeMap[type + postfix];
    if (renderItem) {
      return renderItem({...props, type, itemComponent: Cmp}, props.config.ctx);
    }
    if (!Cmp) return null;
    return Cmp(props);
  }
}

export { Item };


