import React, { Component } from "react";
import { Utils } from "../../../../core/modules";
import mapValues from "lodash/mapValues";
import context from "../../stores/context";
import {pureShouldComponentUpdate, useOnPropsChanged} from "../../utils/reactUtils";
import classNames from "classnames";
import {connect} from "react-redux";
const {defaultGroupConjunction} = Utils.DefaultUtils;
const {getFieldConfig} = Utils.ConfigUtils;


interface GroupContainerProps {
  config: any;
  actions: any;
  path: any; // Immutable.List
  id: string;
  groupId?: string;
  not?: boolean;
  conjunction?: string;
  children1?: any; // Immutable.OrderedMap
  onDragStart?: any;
  reordableNodesCnt?: number;
  field?: any;
  fieldSrc?: string;
  fieldType?: string;
  parentField?: string;
  value?: any;
  valueSrc?: any;
  valueError?: any;
  isLocked?: boolean;
  isTrueLocked?: boolean;
  dragging?: any;
  isDraggingTempo?: boolean;
  operator?: any;
  totalRulesCnt?: number;
  parentFieldPathSize?: number;
  parentFieldCanReorder?: boolean;
  parentReordableNodesCnt?: number;
}

const createGroupContainer = (Group: any, itemType: any): any => 
  class GroupContainer extends Component<GroupContainerProps> {
    selectedConjunction: any;
    conjunctionOptions: any;
    pureShouldComponentUpdate: any;
    dummyFn: (() => void) & { isDummyFn?: boolean };

    constructor(props: GroupContainerProps) {
      super(props);
      this.pureShouldComponentUpdate = pureShouldComponentUpdate(this);
      useOnPropsChanged(this);

      this.selectedConjunction = this._selectedConjunction(props);
      this.conjunctionOptions = this._getConjunctionOptions(props);
      this.dummyFn = ((): void => {}) as (() => void) & { isDummyFn?: boolean };
      this.dummyFn.isDummyFn = true;
    }

    shouldComponentUpdate(nextProps: GroupContainerProps, nextState: any): boolean {
      let prevProps = this.props;
      let prevState = this.state;

      let should = this.pureShouldComponentUpdate(nextProps, nextState);
      if (should) {
        if (prevState == nextState && prevProps != nextProps) {
          const draggingId = (nextProps.dragging?.id || prevProps.dragging?.id);
          const isDraggingMe = draggingId == nextProps.id;
          let chs: string[] = [];
          for (let k in nextProps) {
            let changed = (nextProps[k as keyof GroupContainerProps] != prevProps[k as keyof GroupContainerProps]);
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

    onPropsChanged(nextProps: GroupContainerProps): void {
      const {config, id, conjunction} = nextProps;
      const oldConfig = this.props.config;
      const oldConjunction = this.props.conjunction;
      if (oldConfig != config || oldConjunction != conjunction) {
        this.selectedConjunction = this._selectedConjunction(nextProps);
        this.conjunctionOptions = this._getConjunctionOptions(nextProps);
      }
    }

    _getConjunctionOptions (props: GroupContainerProps): any {
      return mapValues(props.config.conjunctions, (item: any, index: any) => ({
        id: `conjunction-${props.id}-${index}`,
        name: `conjunction[${props.id}]`,
        key: index,
        label: item.label,
        checked: index === this._selectedConjunction(props),
      }));
    }

    _selectedConjunction = (props: GroupContainerProps): any => {
      props = props || this.props;
      return props.conjunction || defaultGroupConjunction(props.config, props.field);
    };

    setConjunction = (conj: any = null): void => {
      this.props.actions.setConjunction(this.props.path, conj);
    };

    setNot = (not: any = null): void => {
      this.props.actions.setNot(this.props.path, not);
    };

    setLock = (lock: any = null): void => {
      this.props.actions.setLock(this.props.path, lock);
    };

    removeSelf = (): void => {
      this.props.actions.removeGroup(this.props.path);
    };

    removeGroupChildren = (): void => {
      this.props.actions.removeGroupChildren(this.props.path);
    };

    addGroup = (): void => {
      const parentRuleGroupField = itemType == "rule_group" ? this.props.field : this.props.parentField;
      this.props.actions.addGroup(this.props.path, undefined, undefined, parentRuleGroupField);
    };

    addCaseGroup = (): void => {
      this.props.actions.addCaseGroup(this.props.path);
    };

    addDefaultCaseGroup = (): void => {
      this.props.actions.addDefaultCaseGroup(this.props.path);
    };

    addRule = (): void => {
      const parentRuleGroupField = itemType == "rule_group" ? this.props.field : this.props.parentField;
      this.props.actions.addRule(this.props.path, undefined, undefined, undefined, parentRuleGroupField);
    };

    // for RuleGroup
    setField = (field: any, asyncListValues: any, _meta: any): void => {
      this.props.actions.setField(this.props.path, field, asyncListValues, _meta);
    };

    // for RuleGroupExt
    setOperator = (operator: any): void => {
      this.props.actions.setOperator(this.props.path, operator);
    };

    // for RuleGroupExt, CaseGroup
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

    render(): React.ReactElement {
      const {showErrorMessage} = this.props.config.settings;
      const isDraggingMe = this.props.dragging?.id == this.props.id;
      const lev = this.props.path.size - 1;
      let currentNesting = this.props.path.size;
      let maxNesting = this.props.config.settings.maxNesting;
      let isRoot = currentNesting == 1;
      if (this.props.parentField && this.props.parentFieldPathSize) {
        // inside rule-group
        const ruleGroupFieldConfig = getFieldConfig(this.props.config, this.props.parentField);
        currentNesting = this.props.path.size - this.props.parentFieldPathSize + 1;
        maxNesting = ruleGroupFieldConfig?.maxNesting;
        isRoot = false;
      } else if (this.props.field) {
        // it is rule-group
        const ruleGroupFieldConfig = getFieldConfig(this.props.config, this.props.field);
        currentNesting = 1;
        maxNesting = ruleGroupFieldConfig?.maxNesting;
        isRoot = false;
      }
      const isInDraggingTempo = !isDraggingMe && this.props.isDraggingTempo;
      const fieldType = this.props.fieldType || null;

      const {valueError} = this.props;
      const oneError = [...(valueError?.toArray() || [])].filter((e: any) => !!e).shift() || null;
      const hasError = oneError != null && showErrorMessage;

      // Don't allow nesting further than the maximum configured depth and don't
      // allow removal of the root group.
      const allowFurtherNesting = typeof maxNesting === "undefined" || currentNesting < maxNesting;
      const isMaxNestingExceeded = maxNesting && currentNesting > maxNesting;

      return (
        <div
          className={classNames("group-or-rule-container", "group-container", hasError ? "group-with-error" : null)}
          data-id={this.props.id}
        >
          {[
            isDraggingMe ? <Group
              key={"dragging"}
              id={this.props.id}
              groupId={this.props.groupId}
              isDraggingMe={true}
              isDraggingTempo={true}
              dragging={this.props.dragging}
              isRoot={isRoot}
              lev={lev}
              allowFurtherNesting={allowFurtherNesting}
              isMaxNestingExceeded={isMaxNestingExceeded}
              conjunctionOptions={this.conjunctionOptions}
              not={this.props.not}
              selectedConjunction={this.selectedConjunction}
              setConjunction={this.dummyFn}
              setNot={this.dummyFn}
              setLock={this.dummyFn}
              removeSelf={this.dummyFn}
              removeGroupChildren={this.dummyFn}
              addGroup={this.dummyFn}
              addCaseGroup={this.dummyFn}
              addDefaultCaseGroup={this.dummyFn}
              addRule={this.dummyFn}
              setField={this.dummyFn}
              setFuncValue={this.dummyFn}
              setOperator={this.dummyFn}
              setValue={this.dummyFn}
              setValueSrc={this.dummyFn}
              value={this.props.value || null}
              valueError={this.props.valueError || null}
              valueSrc={this.props.valueSrc || null}
              config={this.props.config}
              children1={this.props.children1}
              actions={this.props.actions}
              reordableNodesCnt={this.props.reordableNodesCnt}
              totalRulesCnt={this.props.totalRulesCnt}
              selectedField={this.props.field || null}
              selectedFieldSrc={this.props.fieldSrc || "field"}
              selectedFieldType={fieldType}
              parentField={this.props.parentField || null}
              parentFieldPathSize={this.props.parentFieldPathSize}
              parentFieldCanReorder={this.props.parentFieldCanReorder}
              selectedOperator={this.props.operator || null}
              isLocked={this.props.isLocked}
              isTrueLocked={this.props.isTrueLocked}
              parentReordableNodesCnt={this.props.parentReordableNodesCnt}
            /> : null
            ,
            <Group
              key={this.props.id}
              id={this.props.id}
              groupId={this.props.groupId}
              isDraggingMe={isDraggingMe}
              isDraggingTempo={isInDraggingTempo}
              onDragStart={this.props.onDragStart}
              isRoot={isRoot}
              lev={lev}
              allowFurtherNesting={allowFurtherNesting}
              isMaxNestingExceeded={isMaxNestingExceeded}
              conjunctionOptions={this.conjunctionOptions}
              not={this.props.not}
              selectedConjunction={this.selectedConjunction}
              setConjunction={isInDraggingTempo ? this.dummyFn : this.setConjunction}
              setNot={isInDraggingTempo ? this.dummyFn : this.setNot}
              setLock={isInDraggingTempo ? this.dummyFn : this.setLock}
              removeSelf={isInDraggingTempo ? this.dummyFn : this.removeSelf}
              removeGroupChildren={isInDraggingTempo ? this.dummyFn : this.removeGroupChildren}
              addGroup={isInDraggingTempo ? this.dummyFn : this.addGroup}
              addCaseGroup={isInDraggingTempo ? this.dummyFn : this.addCaseGroup}
              addDefaultCaseGroup={isInDraggingTempo ? this.dummyFn : this.addDefaultCaseGroup}
              addRule={isInDraggingTempo ? this.dummyFn : this.addRule}
              setField={isInDraggingTempo ? this.dummyFn : this.setField}
              setFuncValue={isInDraggingTempo ? this.dummyFn : this.setFuncValue}
              setOperator={isInDraggingTempo ? this.dummyFn : this.setOperator}
              setValue={isInDraggingTempo ? this.dummyFn : this.setValue}
              setValueSrc={isInDraggingTempo ? this.dummyFn : this.setValueSrc}
              value={this.props.value || null}
              valueError={this.props.valueError || null}
              valueSrc={this.props.valueSrc || null}
              config={this.props.config}
              children1={this.props.children1}
              actions={this.props.actions}
              reordableNodesCnt={this.props.reordableNodesCnt}
              totalRulesCnt={this.props.totalRulesCnt}
              selectedField={this.props.field || null}
              selectedFieldSrc={this.props.fieldSrc || "field"}
              selectedFieldType={fieldType}
              parentField={this.props.parentField || null}
              parentFieldPathSize={this.props.parentFieldPathSize}
              parentFieldCanReorder={this.props.parentFieldCanReorder}
              selectedOperator={this.props.operator || null}
              isLocked={this.props.isLocked}
              isTrueLocked={this.props.isTrueLocked}
              parentReordableNodesCnt={this.props.parentReordableNodesCnt}
            />
          ]}
        </div>
      );
    }

  };


export default (Group: any, itemType: any): any => {
  const ConnectedGroupContainer = connect(
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
  )(createGroupContainer(Group, itemType));
  ConnectedGroupContainer.displayName = "ConnectedGroupContainer";

  return ConnectedGroupContainer;
};


