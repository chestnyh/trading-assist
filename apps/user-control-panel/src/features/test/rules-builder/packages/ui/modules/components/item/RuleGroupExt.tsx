import React from "react";
import { Utils } from "../../../../core/modules";
import GroupContainer from "../containers/GroupContainer";
import Draggable from "../containers/Draggable";
import {BasicGroup} from "./Group";
import {RuleGroupExtActions} from "./RuleGroupExtActions";
import FieldWrapper from "../rule/FieldWrapper";
import OperatorWrapper from "../rule/OperatorWrapper";
import {useOnPropsChanged} from "../../utils/reactUtils";
import {Col, dummyFn, WithConfirmFn} from "../utils";
import Widget from "../rule/Widget";
import classNames from "classnames";
const {getFieldConfig, getFieldWidgetConfig} = Utils.ConfigUtils;
const {isEmptyRuleGroupExtPropertiesAndChildren} = Utils.RuleUtils;
const {getTotalReordableNodesCountInTree} = Utils.TreeUtils;


interface RuleGroupExtProps extends React.ComponentProps<typeof BasicGroup> {
  selectedField?: any;
  selectedFieldSrc?: string;
  selectedFieldType?: string;
  selectedOperator?: string;
  value?: any;
  parentField?: string;
  setField?: any;
  setFieldSrc?: any;
  setOperator?: any;
  setValue?: any;
  setFuncValue?: any;
  valueError?: any;
  lev?: number;
}

class RuleGroupExt extends BasicGroup {
  constructor(props: RuleGroupExtProps) {
    super(props);
  }

  onPropsChanged(nextProps: RuleGroupExtProps): void {
    super.onPropsChanged(nextProps);
  }

  childrenClassName = (): string => "rule_group_ext--children";
  
  renderFooterWrapper = (): null => null;

  canAddGroup(): boolean {
    return this.props.allowFurtherNesting;
  }

  canAddRule(): boolean {
    const {config, selectedField} = this.props as RuleGroupExtProps;
    const selectedFieldConfig = getFieldConfig(config, selectedField);
    const maxNumberOfRules = selectedFieldConfig?.maxNumberOfRules;
    const totalRulesCnt = this.props.totalRulesCnt;
    if (maxNumberOfRules) {
      return (totalRulesCnt || 0) < maxNumberOfRules;
    }
    return true;
  }

  canDeleteGroup = (): boolean => true;

  renderHeaderWrapper(): React.ReactElement {
    return (
      <>
        {this.renderGroupField()}
        {this.renderError()}
        {this.renderGroupHeader()}
      </>
    );
  }

  canRenderHeader(): boolean {
    return this.canRenderConjs();
  }

  renderHeader(): React.ReactElement {
    return (
      <div className={"group--conjunctions"}>
        {this.renderConjs()}
      </div>
    );
  }

  renderGroupField(): React.ReactElement {
    return (
      <div className={classNames(
        "group--field--count--rule",
        this.showDragIcon() ? "with--drag" : "hide--drag",
      )}>
        {this.renderDrag()}
        {this.renderField()}
        {this.renderOperator()}
        {this.renderWidget()}
        {/* {!this.isNoChildren() ? " where:" : ""} */}
        {this.renderSelfActions()}
      </div>
    );
  }

  canRenderGroupHeader(): boolean {
    return this.canRenderHeader() && this.canRenderChildrenActions();
  }

  renderGroupHeader(): React.ReactNode {
    if (!this.canRenderGroupHeader()) {
      return null;
    }
    return (
      <div className={classNames(
        "group--header", 
        this.isOneChild() ? "one--child" : "",
        this.isOneChild() ? "hide--line" : "",
        this.isNoChildren() ? "no--children" : "",
        this.showConjs() ? "with--conjs" : "hide--conjs"
      )}>
        {this.renderHeader()}
        {this.renderChildrenActions()}
      </div>
    );
  }

  renderError(): React.ReactNode {
    const {config, valueError} = this.props as RuleGroupExtProps;
    const { renderRuleError, showErrorMessage } = config.settings;
    const oneError = [...(valueError?.toArray() || [])].filter((e: any) => !!e).shift() || null;
    return showErrorMessage && oneError 
        && <div className="rule_group--error">
          {renderRuleError ? renderRuleError({error: oneError}, config.ctx) : oneError}
        </div>;
  }

  showNot(): boolean {
    const {config, selectedField} = this.props as RuleGroupExtProps;
    const selectedFieldConfig = getFieldConfig(config, selectedField);
    return selectedFieldConfig?.showNot ?? config.settings.showNot;
  }

  conjunctionOptions(): any {
    const { selectedField } = this.props as RuleGroupExtProps;
    return this.conjunctionOptionsForGroupField(selectedField);
  }

  renderField(): React.ReactElement {
    const {
      config, selectedField, selectedFieldSrc, selectedFieldType, setField, setFieldSrc, setFuncValue,
      parentField, id, groupId, isLocked
    } = this.props as RuleGroupExtProps;
    const { immutableFieldsMode } = config.settings;
    
    return <FieldWrapper
      key="field"
      classname={"rule--field"}
      config={config}
      canSelectFieldSource={false}
      selectedField={selectedField}
      selectedFieldSrc={selectedFieldSrc}
      selectedFieldType={selectedFieldType}
      setField={setField}
      setFuncValue={setFuncValue}
      setFieldSrc={setFieldSrc}
      parentField={parentField}
      readonly={immutableFieldsMode || isLocked}
      id={id}
      groupId={groupId}
    />;
  }

  renderOperator(): React.ReactElement {
    const {config, selectedField, selectedFieldSrc, selectedOperator, setField, setOperator, isLocked} = this.props as RuleGroupExtProps;
    const { immutableFieldsMode } = config.settings;
    const selectedFieldWidgetConfig = getFieldWidgetConfig(config, selectedField, (selectedOperator || undefined) as any) || {};
    const hideOperator = selectedFieldWidgetConfig.hideOperator;
    const showOperatorLabel = selectedField && hideOperator && selectedFieldWidgetConfig.operatorInlineLabel;
    const showOperator = selectedField && !hideOperator;

    return <OperatorWrapper
      key="operator"
      config={config}
      selectedField={selectedField}
      selectedFieldSrc={selectedFieldSrc}
      selectedOperator={selectedOperator}
      setOperator={setOperator}
      showOperator={showOperator}
      showOperatorLabel={showOperatorLabel}
      selectedFieldWidgetConfig={selectedFieldWidgetConfig}
      readonly={immutableFieldsMode || isLocked}
      id={this.props.id}
      groupId={this.props.groupId}
    />;
  }

  isEmptyCurrentGroup(): boolean {
    const {children1, config} = this.props;
    const ruleData = this._buildWidgetProps(this.props as RuleGroupExtProps);
    return isEmptyRuleGroupExtPropertiesAndChildren(ruleData, children1, config);
  }

  _buildWidgetProps({
    selectedField, selectedFieldSrc, selectedFieldType,
    selectedOperator, operatorOptions,
    value, valueType, valueSrc, asyncListValues, valueError, fieldError,
    parentField,
  }: any): any {
    return {
      field: selectedField,
      fieldSrc: selectedFieldSrc,
      fieldType: selectedFieldType,
      operator: selectedOperator,
      operatorOptions,
      value,
      valueType, // new Immutable.List(["number"])
      // todo: aggregation can be not only number?
      valueSrc: ["value"], //new Immutable.List(["value"]), // should be fixed in isEmptyRuleGroupExtPropertiesAndChildren
      //asyncListValues,
      valueError,
      fieldError: null,
      parentField,
    };
  }

  renderWidget(): React.ReactNode {
    const {config, selectedField, selectedOperator, isLocked} = this.props as RuleGroupExtProps;
    const { immutableValuesMode } = config.settings;
    const isFieldAndOpSelected = selectedField && selectedOperator;
    const showWidget = isFieldAndOpSelected;
    if (!showWidget) return null;

    const widget = <Widget
      key="values"
      isForRuleGroup={true}
      {...this._buildWidgetProps(this.props as RuleGroupExtProps)}
      config={config}
      setValue={!immutableValuesMode ? (this.props as RuleGroupExtProps).setValue : dummyFn}
      // todo: aggregation can be not only number?
      setValueSrc={dummyFn}
      readonly={immutableValuesMode || isLocked}
      id={this.props.id}
      groupId={this.props.groupId}
    />;

    return (
      <Col key={"widget-for-"+(this.props as RuleGroupExtProps).selectedOperator} className="rule--value">
        {widget}
      </Col>
    );
  }

  showChildrenActionsAsSelf(): boolean {
    const { config } = this.props;
    const { forceShowConj } = config.settings;
    return this.isNoChildren()
      || this.isOneChild() && !forceShowConj && !this.showNot()
      || !this.showNot() && !this.showConjs();
  }

  canRenderChildrenActions(): boolean {
    return !this.showChildrenActionsAsSelf() && (this.canAddRule() || this.canAddGroup());
  }

  childrenAreRequired(): boolean {
    const {config, selectedOperator} = this.props as RuleGroupExtProps;
    const cardinality = config.operators[selectedOperator!]?.cardinality ?? 1;
    return cardinality == 0; // tip: for group operators some/none/all
  }

  renderChildrenActions(): React.ReactElement {
    const {config, addRule, addGroup, isLocked, isTrueLocked, id} = this.props;

    return <RuleGroupExtActions
      config={config}
      addRule={addRule}
      addGroup={addGroup}
      canAddRule={!this.showChildrenActionsAsSelf() && this.canAddRule()}
      canAddGroup={!this.showChildrenActionsAsSelf() && this.canAddGroup()}
      removeSelf={this.removeGroupChildren}
      canDeleteGroup={true}
      setLock={this.setLock}
      isLocked={isLocked}
      isTrueLocked={isTrueLocked}
      id={id+"_children"}
    />;
  }

  renderSelfActions(): React.ReactElement {
    const {config, addRule, addGroup, isLocked, isTrueLocked, id} = this.props;

    return <RuleGroupExtActions
      config={config}
      addRule={addRule}
      addGroup={addGroup}
      canAddRule={this.showChildrenActionsAsSelf() && this.canAddRule()}
      canAddGroup={this.showChildrenActionsAsSelf() && this.canAddGroup()}
      removeSelf={this.removeSelf}
      setLock={this.setLock}
      isLocked={isLocked}
      isTrueLocked={isTrueLocked}
      canDeleteGroup={this.canDeleteGroup()}
      id={id+"_self"}
    />;
  }


  reordableNodesCntForItem(_item: any): number {
    if (this.props.isLocked)
      return 0;
    const {children1, id} = this.props;
    return getTotalReordableNodesCountInTree({
      id, type: "rule_group", children1
    });
  }

  extraPropsForItem(_item: any): any {
    const { selectedField, lev, config } = this.props as RuleGroupExtProps;
    const selectedFieldConfig = getFieldConfig(config, selectedField);
    return {
      parentField: selectedField,
      parentFieldPathSize: lev! + 1,
      parentFieldCanReorder: selectedFieldConfig?.canReorder ?? config.settings.canReorder,
    };
  }
}


export default GroupContainer(Draggable("group rule_group_ext")(WithConfirmFn(RuleGroupExt)), "rule_group");


