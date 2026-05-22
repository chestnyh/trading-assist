import React from "react";
import GroupContainer from "../containers/GroupContainer";
import Draggable from "../containers/Draggable";
import {BasicGroup} from "./Group";
import {GroupActions} from "./GroupActions";
import {useOnPropsChanged} from "../../utils/reactUtils";
import {Col, dummyFn, WithConfirmFn, getRenderFromConfig} from "../utils";
import Widget from "../rule/Widget";
import classNames from "classnames";


interface CaseGroupProps extends React.ComponentProps<typeof BasicGroup> {
  parentReordableNodesCnt?: number;
  value?: any;
  setValue?: any;
  valueSrc?: any;
  valueError?: any;
  setValueSrc?: any;
  setFuncValue?: any;
}

class CaseGroup extends BasicGroup {
  BeforeCaseValue: any;
  AfterCaseValue: any;
  RuleError: any;

  constructor(props: CaseGroupProps) {
    super(props);
  }

  onPropsChanged(nextProps: CaseGroupProps): void {
    const prevProps = this.props;
    const configChanged = !this.BeforeCaseValue || prevProps?.config !== nextProps?.config;

    super.onPropsChanged(nextProps);

    if (configChanged) {
      const { config } = nextProps;
      const { renderBeforeCaseValue, renderAfterCaseValue, renderRuleError } = config.settings;
      this.BeforeCaseValue = getRenderFromConfig(config, renderBeforeCaseValue);
      this.AfterCaseValue = getRenderFromConfig(config, renderAfterCaseValue);
      this.RuleError = getRenderFromConfig(config, renderRuleError);
    }
  }

  isDefaultCase(): boolean {
    return this.props.children1 == undefined;
  }

  reordableNodesCnt(): number {
    // `parentReordableNodesCnt` is number of cases to reorder
    return (this.props as CaseGroupProps).parentReordableNodesCnt || 0;
  }

  reordableNodesCntForItem(_item: any): number {
    // `reordableNodesCnt` is number of nodes is current case
    if (this.props.isLocked)
      return 0;
    return this.props.reordableNodesCnt || 0;
  }

  totalRulesCntForItem(_item: any): number {
    // `totalRulesCnt` is number of nodes is current case
    return this.props.totalRulesCnt || 0;
  }

  showDragIcon(): boolean {
    // default impl of `showDragIcon()` uses `this.reordableNodesCnt()`
    if (this.isDefaultCase())
      return false;
    return super.showDragIcon();
  }

  childrenClassName = (): string => "case_group--children";
  
  renderFooterWrapper = (): null => null;

  renderHeaderWrapper(): React.ReactElement {
    return (
      <div key="group-header" className={classNames(
        "group--header", 
        this.isOneChild() ? "one--child" : "",
        this.isOneChild() ? "hide--line" : "",
        this.isNoChildren() ? "no--children" : "",
        this.showDragIcon() ? "with--drag" : "hide--drag",
        this.showConjs() && (!this.isOneChild() || this.showNot()) ? "with--conjs" : "hide--conjs"
      )}>
        {this.renderHeaderLeft()}
        {this.renderHeaderCenter()}
        {this.renderActions()}
      </div>
    );
  }

  renderChildrenWrapper(): React.ReactElement | null {
    if (this.isDefaultCase())
      return null;
    // body has 2 columns: condition & value
    return (
      <div className={"case_group--body"}>
        {this.renderCondition()}
        {this.renderBeforeValue()}
        {this.renderValue()}
        {this.renderAfterValue()}
      </div>
    );
  }

  renderHeaderLeft(): React.ReactNode {
    if (this.isDefaultCase()) {
      const { defaultCaseLabel } = this.props.config.settings;
      return defaultCaseLabel || "";
    }
    // default impl:
    return (
      <div className={"group--conjunctions"}>
        {this.renderConjs()}
        {this.renderDrag()}
        {this.renderError()}
      </div>
    );
  }

  renderCondition(): React.ReactNode {
    if (this.isDefaultCase())
      return null;
    return super.renderChildrenWrapper();
  }

  renderHeaderCenter(): React.ReactNode {
    if (this.isDefaultCase()) {
      return (
        <div>
          {this.renderValue()}
          {this.renderError()}
        </div>
      );
    }
    return null;
  }

  canAddGroup(): boolean {
    if (this.isDefaultCase())
      return false;
    return super.canAddGroup();
  }

  canAddRule(): boolean {
    if (this.isDefaultCase())
      return false;
    return super.canAddRule();
  }

  renderBeforeValue(): React.ReactNode {
    const BeforeCaseValue = this.BeforeCaseValue;
    if (BeforeCaseValue == undefined)
      return null;
    return <BeforeCaseValue
      key="values-before"
      {...this.props}
    />;
  }

  renderAfterValue(): React.ReactNode {
    const AfterCaseValue = this.AfterCaseValue;
    if (AfterCaseValue == undefined)
      return null;
    return <AfterCaseValue
      key="values-after"
      {...this.props}
    />;
  }

  renderError(): React.ReactNode {
    const {config, valueError} = this.props as CaseGroupProps;
    const { showErrorMessage } = config.settings;
    const RuleError = this.RuleError;
    const oneError = [...(valueError?.toArray() || [])].filter((e: any) => !!e).shift() || null;
    return showErrorMessage && oneError 
      && <div className="rule--error">
        {RuleError ? <RuleError error={oneError} /> : oneError}
      </div>;
  }

  renderValue(): React.ReactElement {
    const { config, isLocked, value, valueSrc, valueError, setValue, setValueSrc, setFuncValue, id } = this.props as CaseGroupProps;
    const { immutableValuesMode } = config.settings;

    const widget = <Widget
      key="values"
      isCaseValue={true}
      field={"!case_value"}
      operator={undefined}
      value={value}
      valueSrc={valueSrc ?? "value"}
      valueError={valueError}
      fieldError={undefined}
      config={config}
      setValue={!immutableValuesMode ? setValue : dummyFn}
      setValueSrc={!immutableValuesMode ? setValueSrc : dummyFn}
      setFuncValue={!immutableValuesMode ? setFuncValue : dummyFn}
      readonly={immutableValuesMode || isLocked}
      id={id}
      groupId={undefined}
    />;

    return (
      <Col className="case_group--value">
        {widget}
      </Col>
    );
  }

  renderActions(): React.ReactElement {
    const {config, addGroup, addRule, isLocked, isTrueLocked, id} = this.props;
    return <GroupActions
      config={config}
      addGroup={addGroup}
      addRule={addRule}
      canAddRule={this.canAddRule()}
      canAddGroup={this.canAddGroup()}
      canDeleteGroup={this.canDeleteGroup()}
      removeSelf={this.removeSelf}
      setLock={this.setLock}
      isLocked={isLocked}
      isTrueLocked={isTrueLocked}
      id={id}
    />;
  }

  isEmptyCurrentGroup(): boolean {
    // used to confirm self-deletion
    const { value } = this.props as CaseGroupProps;
    const oneValue = value && value.size ? value.get(0) : null;
    const hasValue = oneValue != null && (Array.isArray(oneValue) ? oneValue.length > 0 : true);
    return super.isEmptyCurrentGroup() && !hasValue;
  }

}

export default GroupContainer(Draggable("group case_group")(WithConfirmFn(CaseGroup)), "case_group");


