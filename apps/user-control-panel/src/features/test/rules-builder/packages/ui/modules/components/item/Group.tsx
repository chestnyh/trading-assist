import React, { Component } from "react";
import { Utils } from "../../../../core/modules";
import { startsWith } from "lodash";
import GroupContainer from "../containers/GroupContainer";
import Draggable from "../containers/Draggable";
import classNames from "classnames";
import { Item } from "./Item";
import {GroupActions} from "./GroupActions";
import {WithConfirmFn, dummyFn, getRenderFromConfig} from "../utils";
import {useOnPropsChanged} from "../../utils/reactUtils";
const {getFieldConfig} = Utils.ConfigUtils;
const {isEmptyGroupChildren} = Utils.RuleUtils;
const {getTotalReordableNodesCountInTree, getTotalRulesCountInTree} = Utils.TreeUtils;

const defaultPosition = "topRight";


interface BasicGroupProps {
  reordableNodesCnt?: number;
  conjunctionOptions: any;
  allowFurtherNesting: boolean;
  isMaxNestingExceeded?: boolean;
  isRoot: boolean;
  not?: boolean;
  selectedConjunction?: string;
  config: any;
  id: string;
  groupId?: string;
  path?: any; // Immutable.List
  children1?: any; // Immutable.OrderedMap
  isDraggingMe?: boolean;
  isDraggingTempo?: boolean;
  isLocked?: boolean;
  isTrueLocked?: boolean;
  parentField?: string;
  handleDraggerMouseDown?: any;
  onDragStart?: any;
  addRule: any;
  addGroup: any;
  removeSelf: any;
  removeGroupChildren: any;
  setConjunction: any;
  setNot: any;
  setLock: any;
  actions: any;
  totalRulesCnt?: number;
  parentFieldPathSize?: number;
  parentFieldCanReorder?: boolean;
  confirmFn?: any;
}

export class BasicGroup extends Component<BasicGroupProps> {
  Icon: any;
  Conjs: any;
  BeforeActions: any;
  AfterActions: any;
  doRemove: any;

  constructor(props: BasicGroupProps) {
    super(props);

    useOnPropsChanged(this);
    this.onPropsChanged(props);

    this.removeSelf = this.removeSelf.bind(this);
    this.removeGroupChildren = this.removeGroupChildren.bind(this);
    this.setLock = this.setLock.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  onPropsChanged(nextProps: BasicGroupProps): void {
    const prevProps = this.props;
    const configChanged = !this.Icon || prevProps?.config !== nextProps?.config;

    if (configChanged) {
      const { config } = nextProps;
      const { renderIcon, renderConjs, renderBeforeActions, renderAfterActions } = config.settings;
      this.Icon = getRenderFromConfig(config, renderIcon);
      this.Conjs = getRenderFromConfig(config, renderConjs);
      this.BeforeActions = getRenderFromConfig(config, renderBeforeActions);
      this.AfterActions = getRenderFromConfig(config, renderAfterActions);
    }

    this.doRemove = () => {
      this.props.removeSelf();
    };
  }

  isGroupTopPosition(): boolean {
    return startsWith(this.props.config.settings.groupActionsPosition || defaultPosition, "top");
  }

  setLock(lock: any): void {
    this.props.setLock(lock);
  }

  removeGroupChildren(): void {
    this.props.removeGroupChildren();
  }

  removeSelf(): void {
    const {confirmFn, config} = this.props;
    const {renderConfirm, removeGroupConfirmOptions: confirmOptions} = config.settings;
    if (confirmOptions && !this.isEmptyCurrentGroup()) {
      renderConfirm.call(config.ctx, {...confirmOptions,
        onOk: this.doRemove,
        onCancel: null,
        confirmFn: confirmFn
      }, config.ctx);
    } else {
      this.doRemove();
    }
  }

  isEmptyCurrentGroup(): boolean {
    const {children1, config} = this.props;
    return isEmptyGroupChildren(children1, config);
  }

  showNot(): boolean {
    const {config, parentField} = this.props;
    let showNot = config.settings.showNot;
    if (parentField) {
      const ruleGroupFieldConfig = getFieldConfig(config, parentField);
      showNot = showNot && (ruleGroupFieldConfig?.showNot ?? true);
    }
    return showNot;
  }

  // show conjs for 2+ children?
  showConjs(): boolean {
    const {config} = this.props;
    const {forceShowConj} = config.settings;
    const conjunctionOptions = this.conjunctionOptions();
    const conjunctionCount = Object.keys(conjunctionOptions).length;
    return conjunctionCount > 1 && !this.isOneChild() || this.showNot() || forceShowConj;
  }

  isNoChildren(): boolean {
    const {children1} = this.props;
    return children1 ? children1.size == 0 : true;
  }


  isOneChild(): boolean {
    const {children1} = this.props;
    return children1 ? children1.size < 2 : true;
  }

  renderChildrenWrapper(): React.ReactNode {
    const {children1} = this.props;

    return children1 && (
      <div key="group-children" className={classNames(
        "group--children",
        !this.showConjs() ? "hide--conjs" : "",
        this.isOneChild() ? "hide--line" : "",
        this.isOneChild() ? "one--child" : "",
        this.childrenClassName()
      )}>{this.renderChildren()}</div>
    );
  }

  childrenClassName = (): string => "";

  renderHeaderWrapper(): React.ReactNode {
    const isGroupTopPosition = this.isGroupTopPosition();
    return (
      <div key="group-header" className={classNames(
        "group--header",
        this.isOneChild() ? "one--child" : "",
        !this.showConjs() ? "hide--conjs" : "",
        this.isOneChild() ? "hide--line" : "",
        this.isNoChildren() ? "no--children" : "",
      )}>
        {this.renderHeader()}
        {isGroupTopPosition && this.renderBeforeActions()}
        {isGroupTopPosition && this.renderActions()}
        {isGroupTopPosition && this.renderAfterActions()}
      </div>
    );
  }

  renderFooterWrapper(): React.ReactNode {
    const isGroupTopPosition = this.isGroupTopPosition();
    return !isGroupTopPosition && (
      <div key="group-footer" className='group--footer'>
        {this.renderBeforeActions()}
        {this.renderActions()}
        {this.renderAfterActions()}
      </div>
    );
  }

  renderBeforeActions = (): React.ReactNode => {
    const BeforeActions = this.BeforeActions;
    if (BeforeActions == undefined)
      return null;
    return <BeforeActions
      key="group-actions-before"
      {...this.props}
    />;
  };

  renderAfterActions = (): React.ReactNode => {
    const AfterActions = this.AfterActions;
    if (AfterActions == undefined)
      return null;
    return <AfterActions
      key="group-actions-after"
      {...this.props}
    />;
  };

  renderActions(): React.ReactElement {
    const {config, addRule, addGroup, isLocked, isTrueLocked, id, parentField} = this.props;

    return <GroupActions
      key="group-actions"
      config={config}
      addRule={addRule}
      addGroup={addGroup}
      canAddGroup={this.canAddGroup()}
      canAddRule={this.canAddRule()}
      canDeleteGroup={this.canDeleteGroup()}
      removeSelf={this.removeSelf}
      setLock={this.setLock}
      isLocked={isLocked}
      isTrueLocked={isTrueLocked}
      id={id}
      parentField={parentField}
    />;
  }

  canAddGroup(): boolean {
    return this.props.allowFurtherNesting;
  }

  canAddRule(): boolean {
    const { totalRulesCnt, isMaxNestingExceeded, parentField } = this.props;
    let { maxNumberOfRules } = this.props.config.settings;
    if (parentField) {
      const ruleGroupFieldConfig = getFieldConfig(this.props.config, parentField);
      maxNumberOfRules = ruleGroupFieldConfig.maxNumberOfRules;
    }
    if (isMaxNestingExceeded) {
      return false;
    }
    if (maxNumberOfRules) {
      return (totalRulesCnt || 0) < maxNumberOfRules;
    }
    return true;
  }

  canDeleteGroup(): boolean {
    return !this.props.isRoot;
  }

  renderChildren(): React.ReactNode {
    const {children1} = this.props;
    return children1 ? children1.valueSeq().toArray().map(this.renderItem) : null;
  }

  renderItem(item: any): React.ReactElement | undefined {
    if (!item) {
      return undefined;
    }
    const props = this.props;
    const {config, actions, onDragStart, isLocked, parentField, parentFieldPathSize, parentFieldCanReorder} = props;
    const isRuleGroup = item.get("type") == "group" && item.getIn(["properties", "field"]) != null;
    const type = isRuleGroup ? "rule_group" : item.get("type");
    
    return (
      <Item
        key={item.get("id")}
        id={item.get("id")}
        groupId={props.id}
        path={item.get("path")}
        type={type}
        properties={item.get("properties")}
        config={config}
        actions={actions}
        children1={item.get("children1")}
        parentField={parentField}
        parentFieldPathSize={parentFieldPathSize}
        parentFieldCanReorder={parentFieldCanReorder}
        reordableNodesCnt={this.reordableNodesCntForItem(item)}
        totalRulesCnt={this.totalRulesCntForItem(item)}
        parentReordableNodesCnt={this.reordableNodesCnt()}
        onDragStart={onDragStart}
        isDraggingTempo={this.props.isDraggingTempo}
        isParentLocked={isLocked}
        {...this.extraPropsForItem(item)}
      />
    );
  }

  extraPropsForItem(_item: any): any {
    return {};
  }

  reordableNodesCnt(): number {
    if (this.props.isLocked)
      return 0;
    return this.props.reordableNodesCnt || 0;
  }

  totalRulesCntForItem(item: any): number {
    if (item.get("type") === "rule_group") {
      return getTotalRulesCountInTree(item);
    }
    return this.props.totalRulesCnt || 0;
  }

  reordableNodesCntForItem(_item: any): number {
    if (this.props.isLocked)
      return 0;
    return this.reordableNodesCnt();
  }

  showDragIcon(): boolean {
    const { config, isRoot, isLocked, parentField, parentFieldCanReorder } = this.props;
    const reordableNodesCnt = this.reordableNodesCnt();
    let canReorder = config.settings.canReorder && !isRoot && reordableNodesCnt > 1 && !isLocked;
    if (parentField) {
      canReorder = canReorder && parentFieldCanReorder;
    }
    return canReorder;
  }

  renderDrag(): React.ReactNode {
    const { handleDraggerMouseDown, config, isLocked } = this.props;
    const Icon = this.Icon;
    const icon = <Icon
      type="drag"
      readonly={isLocked}
      config={config}
    />;
    return this.showDragIcon() && (<div 
      key="group-drag-icon"
      onMouseDown={handleDraggerMouseDown}
      className={"qb-drag-handler group--drag-handler"}
    >{icon}</div>);
  }

  conjunctionOptions(): any {
    const { parentField, conjunctionOptions } = this.props;
    // Note: if current group is a group inside rule-group, we should respect config of parent rule-group
    return parentField ? this.conjunctionOptionsForGroupField(parentField) : conjunctionOptions;
  }

  conjunctionOptionsForGroupField(groupField: any = null): any {
    const {config, conjunctionOptions} = this.props;
    const groupFieldConfig = getFieldConfig(config, groupField);
    if (groupFieldConfig?.conjunctions) {
      let filtered: any = {};
      for (let k of groupFieldConfig.conjunctions) {
        const options = conjunctionOptions[k];
        if (options) {
          filtered[k] = options;
        }
      }
      return filtered;
    }
    return conjunctionOptions;
  }

  canRenderConjs(): boolean {
    const { children1 } = this.props;
    if (!this.showConjs())
      return false;
    if (!children1 || !children1.size)
      return false;
    return true;
  }

  renderConjs(): React.ReactNode {
    const {
      config, id,
      selectedConjunction, setConjunction, not, setNot, isLocked
    } = this.props;

    const {immutableGroupsMode, notLabel} = config.settings;
    const conjunctionOptions = this.conjunctionOptions();
    if (!this.canRenderConjs())
      return null;

    const renderProps = {
      disabled: this.isOneChild(),
      readonly: immutableGroupsMode || isLocked,
      selectedConjunction: selectedConjunction,
      setConjunction: immutableGroupsMode ? dummyFn : setConjunction,
      conjunctionOptions: conjunctionOptions,
      config: config,
      not: not || false,
      id: id,
      setNot: immutableGroupsMode ? dummyFn : setNot,
      notLabel: notLabel,
      showNot: this.showNot(),
      isLocked: isLocked
    };
    const Conjs = this.Conjs;
    return (
      <Conjs
        key="group-conjs"
        {...renderProps}
      />
    );
  }

  renderHeader(): React.ReactElement {
    return (
      <div key="group-conjunctions" className={"group--conjunctions"}>
        {this.renderConjs()}
        {this.renderDrag()}
      </div>
    );
  }

  render(): React.ReactElement {
    return <>
      {this.renderHeaderWrapper()}
      {this.renderChildrenWrapper()}
      {this.renderFooterWrapper()}
    </>;
  }
}

export default GroupContainer(Draggable("group simple_group")(WithConfirmFn(BasicGroup)), "group");


