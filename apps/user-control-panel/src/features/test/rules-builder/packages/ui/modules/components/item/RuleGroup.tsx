import React from "react";
import { Utils } from "../../../../core/modules";
import GroupContainer from "../containers/GroupContainer";
import Draggable from "../containers/Draggable";
import {BasicGroup} from "./Group";
import {RuleGroupActions} from "./RuleGroupActions";
import FieldWrapper from "../rule/FieldWrapper";
import {WithConfirmFn} from "../utils";
const {getFieldConfig} = Utils.ConfigUtils;


interface RuleGroupProps extends React.ComponentProps<typeof BasicGroup> {
  selectedField?: any;
  selectedFieldSrc?: string;
  selectedFieldType?: string;
  parentField?: string;
  setField?: any;
  setFieldSrc?: any;
  setFuncValue?: any;
  lev?: number;
}

class RuleGroup extends BasicGroup {
  constructor(props: RuleGroupProps) {
    super(props);
  }

  onPropsChanged(nextProps: RuleGroupProps): void {
    super.onPropsChanged(nextProps);
  }

  childrenClassName = (): string => "rule_group--children";
  
  renderHeaderWrapper = (): null => null;
  renderFooterWrapper = (): null => null;
  renderConjs = (): null => null;
  canAddGroup = (): boolean => false;
  canAddRule = (): boolean => true;
  canDeleteGroup = (): boolean => false;

  reordableNodesCntForItem(_item: any): number {
    if (this.props.isLocked)
      return 0;
    const {children1} = this.props;
    return children1?.size || 0;
  }

  renderChildrenWrapper(): React.ReactElement {
    return (
      <>
        {this.renderDrag()}
        {this.renderField()}
        {this.renderActions()}
        {super.renderChildrenWrapper()}
      </>
    );
  }

  renderField(): React.ReactElement {
    const {
      config, selectedField, selectedFieldSrc, selectedFieldType, setField, setFuncValue, setFieldSrc, 
      parentField, id, groupId, isLocked
    } = this.props as RuleGroupProps;
    const { immutableFieldsMode } = config.settings;
    
    return <FieldWrapper
      key="field"
      classname={"group--field"}
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

  renderActions(): React.ReactElement {
    const {config, addRule, isLocked, isTrueLocked, id} = this.props;

    return <RuleGroupActions
      config={config}
      addRule={addRule}
      canAddRule={this.canAddRule()}
      canDeleteGroup={this.canDeleteGroup()}
      removeSelf={this.removeSelf}
      setLock={this.setLock}
      isLocked={isLocked}
      isTrueLocked={isTrueLocked}
      id={id}
    />;
  }

  extraPropsForItem(_item: any): any {
    const { selectedField, lev, config } = this.props as RuleGroupProps;
    const selectedFieldConfig = getFieldConfig(config, selectedField);
    return {
      parentField: selectedField,
      parentFieldPathSize: lev! + 1,
      parentFieldCanReorder: selectedFieldConfig?.canReorder ?? config.settings.canReorder,
    };
  }
}


export default GroupContainer(Draggable("group rule_group")(WithConfirmFn(RuleGroup)), "rule_group");


