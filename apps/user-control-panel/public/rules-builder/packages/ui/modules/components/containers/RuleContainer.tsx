import React, { Component } from "react";
import { Utils } from "../../../../core/modules";
import context from "../../stores/context";
import {pureShouldComponentUpdate} from "../../utils/reactUtils";
import {connect} from "react-redux";
import classNames from "classnames";
const {getFieldConfig} = Utils.ConfigUtils;


interface RuleContainerProps {
  id: string;
  groupId?: string;
  config: any;
  path: any; // Immutable.List
  operator?: string;
  field?: any;
  fieldSrc?: string;
  fieldType?: string;
  actions: any;
  onDragStart?: any;
  value?: any;
  valueSrc?: any;
  asyncListValues?: any[];
  valueError?: any;
  fieldError?: string;
  operatorOptions?: any;
  reordableNodesCnt?: number;
  parentField?: string;
  isLocked?: boolean;
  isTrueLocked?: boolean;
  dragging?: any;
  isDraggingTempo?: boolean;
  valueType?: any;
  totalRulesCnt?: number;
  parentFieldPathSize?: number;
  parentFieldCanReorder?: boolean;
  parentReordableNodesCnt?: number;
}

const createRuleContainer = (Rule: any): any => 
  class RuleContainer extends Component<RuleContainerProps> {
    pureShouldComponentUpdate: any;
    dummyFn: (() => void) & { isDummyFn?: boolean };

    constructor(props: RuleContainerProps) {
      super(props);
      this.pureShouldComponentUpdate = pureShouldComponentUpdate(this);
      
      this.dummyFn = ((): void => {}) as (() => void) & { isDummyFn?: boolean };
      this.dummyFn.isDummyFn = true;
    }

    removeSelf = (): void => {
      this.props.actions.removeRule(this.props.path);
    };

    setLock = (lock: any = null): void => {
      this.props.actions.setLock(this.props.path, lock);
    };

    setField = (field: any, asyncListValues: any, _meta: any): void => {
      this.props.actions.setField(this.props.path, field, asyncListValues, _meta);
    };

    setFieldSrc = (srcKey: any): void => {
      this.props.actions.setFieldSrc(this.props.path, srcKey);
    };

    setOperator = (operator: any): void => {
      this.props.actions.setOperator(this.props.path, operator);
    };

    setOperatorOption = (name: any, value: any): void => {
      this.props.actions.setOperatorOption(this.props.path, name, value);
    };

    setValue = (delta: any, value: any, type: any, asyncListValues: any, _meta: any): void => {
      this.props.actions.setValue(this.props.path, delta, value, type, asyncListValues, _meta);
    };

    setValueSrc = (delta: any, srcKey: any, _meta: any): void => {
      this.props.actions.setValueSrc(this.props.path, delta, srcKey, _meta);
    };

    // can be used for both LHS and LHS
    setFuncValue = (delta: any, parentFuncs: any, argKey: any, value: any, type: any, asyncListValues: any, _meta: any): void => {
      this.props.actions.setFuncValue(this.props.path, delta, parentFuncs, argKey, value, type, asyncListValues, _meta);
    };

    shouldComponentUpdate(nextProps: RuleContainerProps, nextState: any): boolean {
      let prevProps = this.props;
      let prevState = this.state;

      let should = this.pureShouldComponentUpdate(nextProps, nextState);
      if (should) {
        if (prevState == nextState && prevProps != nextProps) {
          const draggingId = (nextProps.dragging?.id || prevProps.dragging?.id);
          const isDraggingMe = draggingId == nextProps.id;
          let chs: string[] = [];
          for (let k in nextProps) {
            let changed = (nextProps[k as keyof RuleContainerProps] != prevProps[k as keyof RuleContainerProps]);
            if (k == "dragging" && !isDraggingMe) {
              changed = false; //dragging another item -> ignore
            }
            if (changed) {
              chs.push(k);
            }
          }
          if (!chs.length)
            should = false;
        }
      }
      return should;
    }

    render(): React.ReactElement {
      const lev = this.props.path.size - 1;
      const isDraggingMe = this.props.dragging?.id == this.props.id;
      const fieldConfig = getFieldConfig(this.props.config, this.props.field);
      const fieldType = this.props.fieldType || fieldConfig?.type || null;
      const {showErrorMessage} = this.props.config.settings;
      const _isGroup = fieldConfig && fieldConfig.type == "!struct";
      const isInDraggingTempo = !isDraggingMe && this.props.isDraggingTempo;

      const {valueError, fieldError} = this.props;
      const oneError = [fieldError, ...(valueError?.toArray() || [])].filter((e: any) => !!e).shift() || null;
      const hasError = oneError != null && showErrorMessage;

      return (
        <div
          className={classNames("group-or-rule-container", "rule-container", hasError ? "rule-with-error" : null)}
          data-id={this.props.id}
        >
          {[
            isDraggingMe ? <Rule
              key={"dragging"}
              id={this.props.id}
              groupId={this.props.groupId}
              lev={lev}
              isDraggingMe={true}
              isDraggingTempo={true}
              dragging={this.props.dragging}
              setField={this.dummyFn}
              setFieldSrc={this.dummyFn}
              setFuncValue={this.dummyFn}
              setOperator={this.dummyFn}
              setOperatorOption={this.dummyFn}
              setLock={this.dummyFn}
              removeSelf={this.dummyFn}
              setValue={this.dummyFn}
              setValueSrc={this.dummyFn}
              selectedField={this.props.field || null}
              selectedFieldSrc={this.props.fieldSrc || "field"}
              selectedFieldType={fieldType}
              parentField={this.props.parentField || null}
              parentFieldPathSize={this.props.parentFieldPathSize}
              parentFieldCanReorder={this.props.parentFieldCanReorder}
              selectedOperator={this.props.operator || null}
              value={this.props.value || null}
              valueSrc={this.props.valueSrc || null}
              valueType={this.props.valueType || null}
              valueError={this.props.valueError || null}
              fieldError={this.props.fieldError || null}
              operatorOptions={this.props.operatorOptions}
              config={this.props.config}
              reordableNodesCnt={this.props.reordableNodesCnt}
              totalRulesCnt={this.props.totalRulesCnt}
              asyncListValues={this.props.asyncListValues}
              isLocked={this.props.isLocked}
              isTrueLocked={this.props.isTrueLocked}
              parentReordableNodesCnt={this.props.parentReordableNodesCnt}
            /> : null
            ,
            <Rule
              key={this.props.id}
              id={this.props.id}
              groupId={this.props.groupId}
              lev={lev}
              isDraggingMe={isDraggingMe}
              isDraggingTempo={isInDraggingTempo}
              onDragStart={this.props.onDragStart}
              setLock={isInDraggingTempo ? this.dummyFn : this.setLock}
              removeSelf={isInDraggingTempo ? this.dummyFn : this.removeSelf}
              setField={isInDraggingTempo ? this.dummyFn : this.setField}
              setFieldSrc={isInDraggingTempo ? this.dummyFn : this.setFieldSrc}
              setFuncValue={isInDraggingTempo ? this.dummyFn : this.setFuncValue}
              setOperator={isInDraggingTempo ? this.dummyFn : this.setOperator}
              setOperatorOption={isInDraggingTempo ? this.dummyFn : this.setOperatorOption}
              setValue={isInDraggingTempo ? this.dummyFn : this.setValue}
              setValueSrc={isInDraggingTempo ? this.dummyFn : this.setValueSrc}
              selectedField={this.props.field || null}
              selectedFieldSrc={this.props.fieldSrc || "field"}
              selectedFieldType={fieldType}
              parentField={this.props.parentField || null}
              parentFieldPathSize={this.props.parentFieldPathSize}
              parentFieldCanReorder={this.props.parentFieldCanReorder}
              selectedOperator={this.props.operator || null}
              value={this.props.value || null}
              valueSrc={this.props.valueSrc || null}
              valueType={this.props.valueType || null}
              valueError={this.props.valueError || null}
              fieldError={this.props.fieldError || null}
              operatorOptions={this.props.operatorOptions}
              config={this.props.config}
              reordableNodesCnt={this.props.reordableNodesCnt}
              totalRulesCnt={this.props.totalRulesCnt}
              asyncListValues={this.props.asyncListValues}
              isLocked={this.props.isLocked}
              isTrueLocked={this.props.isTrueLocked}
              parentReordableNodesCnt={this.props.parentReordableNodesCnt}
            />
          ]}
        </div>
      );
    }

  };


export default (Rule: any): any => {
  const ConnectedRuleContainer = connect(
    (state: any) => {
      return {
        dragging: state.dragging,
      };
    },
    null,
    null,
    {
      context
    }
  )(createRuleContainer(Rule));
  ConnectedRuleContainer.displayName = "ConnectedRuleContainer";

  return ConnectedRuleContainer;
};


