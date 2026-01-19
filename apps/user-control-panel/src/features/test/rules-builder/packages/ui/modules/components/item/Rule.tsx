import React, { Component } from "react";
import { Utils } from "../../../../core/modules";
import RuleContainer from "../containers/RuleContainer";
import Draggable from "../containers/Draggable";
import OperatorWrapper from "../rule/OperatorWrapper";
import FieldWrapper from "../rule/FieldWrapper";
import Widget from "../rule/Widget";
import OperatorOptions from "../rule/OperatorOptions";
import {useOnPropsChanged} from "../../utils/reactUtils";
import {Col, dummyFn, WithConfirmFn, getRenderFromConfig} from "../utils";
import classNames from "classnames";
const {getFieldConfig, getOperatorConfig, getFieldWidgetConfig, getFieldId} = Utils.ConfigUtils;
const {isEmptyRuleProperties} = Utils.RuleUtils;


interface RuleProps {
  id: string;
  groupId?: string;
  selectedField?: any;
  selectedFieldSrc?: string;
  selectedFieldType?: string;
  selectedOperator?: string;
  operatorOptions?: any;
  config: any;
  value?: any;
  valueSrc?: any;
  valueType?: any;
  asyncListValues?: any[];
  isDraggingMe?: boolean;
  isDraggingTempo?: boolean;
  parentField?: string;
  valueError?: any;
  fieldError?: string;
  isLocked?: boolean;
  isTrueLocked?: boolean;
  handleDraggerMouseDown?: any;
  setField?: any;
  setFieldSrc?: any;
  setOperator?: any;
  setOperatorOption?: any;
  setLock?: any;
  removeSelf?: any;
  setValue?: any;
  setValueSrc?: any;
  setFuncValue?: any;
  reordableNodesCnt?: number;
  totalRulesCnt?: number;
  parentReordableNodesCnt?: number;
  parentFieldCanReorder?: boolean;
  confirmFn?: any;
}

class Rule extends Component<RuleProps> {
  Icon: any;
  Btn: any;
  BtnGrp: any;
  Switch: any;
  BeforeWidget: any;
  AfterWidget: any;
  RuleError: any;
  meta: any;
  doRemove: any;

  constructor(props: RuleProps) {
    super(props);
    useOnPropsChanged(this);
  
    this.removeSelf = this.removeSelf.bind(this);
    this.setLock = this.setLock.bind(this);

    this.onPropsChanged(props);
  }

  onPropsChanged(nextProps: RuleProps): void {
    const prevProps = this.props;
    const configChanged = !this.Icon || prevProps?.config !== nextProps?.config;
    const keysForMeta = ["selectedField", "selectedFieldSrc", "selectedFieldType", "selectedOperator", "config", "reordableNodesCnt", "isLocked", "parentField", "parentFieldCanReorder"];
    const needUpdateMeta = !this.meta || keysForMeta.map((k: string) => (nextProps[k as keyof RuleProps] !== prevProps[k as keyof RuleProps])).filter((ch: boolean) => ch).length > 0;

    if (needUpdateMeta) {
      this.meta = this.getMeta(nextProps);
    }
    if (configChanged) {
      const { config } = nextProps;
      const {
        renderIcon, renderButton, renderButtonGroup, renderSwitch, renderBeforeWidget, renderAfterWidget, renderRuleError,
      } = config.settings;
      this.Icon = getRenderFromConfig(config, renderIcon);
      this.Btn = getRenderFromConfig(config, renderButton);
      this.BtnGrp = getRenderFromConfig(config, renderButtonGroup);
      this.Switch = getRenderFromConfig(config, renderSwitch);
      this.BeforeWidget = getRenderFromConfig(config, renderBeforeWidget);
      this.AfterWidget = getRenderFromConfig(config, renderAfterWidget);
      this.RuleError = getRenderFromConfig(config, renderRuleError);
    }
    this.doRemove = () => {
      this.props.removeSelf?.();
    };
  }

  getMeta({selectedField, selectedFieldType, selectedOperator, config, reordableNodesCnt, isLocked, parentField, parentFieldCanReorder}: any): any {
    const {keepInputOnChangeFieldSrc} = config.settings;
    const selectedFieldId = getFieldId(selectedField);
    const selectedFieldConfig = getFieldConfig(config, selectedField);
    const isSelectedGroup = selectedFieldConfig && selectedFieldConfig.type === "!struct";
    const isOkWithoutField = keepInputOnChangeFieldSrc && selectedFieldType;
    const isFieldSelected = !!selectedField || isOkWithoutField;
    const isFieldAndOpSelected = isFieldSelected && selectedOperator;
    const selectedOperatorConfig = getOperatorConfig(config, selectedOperator, selectedField);
    const selectedOperatorHasOptions = selectedOperatorConfig && selectedOperatorConfig.options != null;
    const selectedFieldWidgetConfig = getFieldWidgetConfig(config, selectedField, selectedOperator, null, null) || {};
    const hideOperator = selectedFieldWidgetConfig.hideOperator;

    let showDragIcon = config.settings.canReorder && (reordableNodesCnt || 0) > 1 && !isLocked;
    if (parentField) {
      showDragIcon = showDragIcon && parentFieldCanReorder;
    }
    const showOperator = isFieldSelected && !hideOperator;
    const showOperatorLabel = isFieldSelected && hideOperator && selectedFieldWidgetConfig.operatorInlineLabel;
    const showWidget = isFieldAndOpSelected && !isSelectedGroup;
    const showOperatorOptions = isFieldAndOpSelected && selectedOperatorHasOptions;

    return {
      selectedFieldId, selectedFieldWidgetConfig,
      showDragIcon, showOperator, showOperatorLabel, showWidget, showOperatorOptions
    };
  }

  setLock(lock: any): void {
    this.props.setLock?.(lock);
  }

  removeSelf(): void {
    const {confirmFn, config} = this.props;
    const {renderConfirm, removeRuleConfirmOptions: confirmOptions} = config.settings;
    if (confirmOptions && !this.isEmptyCurrentRule()) {
      renderConfirm.call(config.ctx, {...confirmOptions,
        onOk: this.doRemove,
        onCancel: null,
        confirmFn: confirmFn
      }, config.ctx);
    } else {
      this.doRemove();
    }
  }

  _buildWidgetProps({
    selectedField, selectedFieldSrc, selectedFieldType,
    selectedOperator, operatorOptions,
    value, valueType, valueSrc, asyncListValues, valueError, fieldError,
    parentField,
  }: any, {
    selectedFieldId
  }: any): any {
    return {
      field: selectedField,
      fieldSrc: selectedFieldSrc,
      fieldType: selectedFieldType,
      fieldId: selectedFieldId,
      operator: selectedOperator,
      operatorOptions,
      value,
      valueType,
      valueSrc,
      asyncListValues,
      valueError,
      fieldError,
      parentField,
    };
  }

  isEmptyCurrentRule(): boolean {
    const {config} = this.props;
    const ruleData = this._buildWidgetProps(this.props, this.meta);
    return isEmptyRuleProperties(ruleData, config);
  }

  renderField(): React.ReactElement {
    const {
      config, isLocked, parentField, groupId, id,
      selectedFieldSrc, selectedField, selectedFieldType, setField, setFuncValue, setFieldSrc, fieldError,
    } = this.props;
    const { immutableFieldsMode } = config.settings;
    const { selectedFieldId } = this.meta;
    // tip: don't allow function inside !group (yet)

    return <FieldWrapper
      key="field"
      classname={classNames(
        selectedFieldSrc == "func" ? "rule--field--func" : "rule--field",
      )}
      config={config}
      canSelectFieldSource={!parentField}
      selectedField={selectedField}
      selectedFieldSrc={selectedFieldSrc}
      selectedFieldType={selectedFieldType}
      fieldError={fieldError}
      setField={!immutableFieldsMode ? setField : dummyFn}
      setFuncValue={!immutableFieldsMode ? setFuncValue : dummyFn}
      setFieldSrc={!immutableFieldsMode ? setFieldSrc : dummyFn}
      parentField={parentField}
      readonly={immutableFieldsMode || isLocked}
      id={id}
      groupId={groupId}
    />;
  }

  renderOperator (): React.ReactElement {
    const {config, isLocked} = this.props;
    const {
      selectedFieldId, selectedFieldWidgetConfig, showOperator, showOperatorLabel
    } = this.meta;
    const { immutableOpsMode } = config.settings;
    
    return <OperatorWrapper
      key="operator"
      config={config}
      selectedField={this.props.selectedField}
      selectedFieldSrc={this.props.selectedFieldSrc}
      selectedFieldType={this.props.selectedFieldType}
      selectedFieldId={selectedFieldId}
      selectedOperator={this.props.selectedOperator}
      setOperator={!immutableOpsMode ? this.props.setOperator : dummyFn}
      showOperator={showOperator}
      showOperatorLabel={showOperatorLabel}
      selectedFieldWidgetConfig={selectedFieldWidgetConfig}
      readonly={immutableOpsMode || isLocked}
      id={this.props.id}
      groupId={this.props.groupId}
    />;
  }

  renderWidget(): React.ReactNode {
    const {config, isLocked} = this.props;
    const { showWidget } = this.meta;
    const { immutableValuesMode } = config.settings;
    if (!showWidget) return null;

    const widget = <Widget
      key="values"
      {...this._buildWidgetProps(this.props, this.meta)}
      config={config}
      setValue={!immutableValuesMode ? this.props.setValue : dummyFn}
      setValueSrc={!immutableValuesMode ? this.props.setValueSrc : dummyFn}
      setFuncValue={!immutableValuesMode ? this.props.setFuncValue : dummyFn}
      readonly={immutableValuesMode || isLocked}
      id={this.props.id}
      groupId={this.props.groupId}
    />;

    return (
      <Col key={"widget-for-"+this.props.selectedOperator} className="rule--value">
        {widget}
      </Col>
    );
  }

  renderOperatorOptions(): React.ReactNode {
    const {config} = this.props;
    const { showOperatorOptions } = this.meta;
    const { immutableOpsMode, immutableValuesMode } = config.settings;
    if (!showOperatorOptions || !this.props.selectedOperator) return null;

    const opOpts = <OperatorOptions
      key="operatorOptions"
      selectedField={this.props.selectedField}
      selectedOperator={this.props.selectedOperator}
      operatorOptions={this.props.operatorOptions}
      setOperatorOption={!immutableOpsMode ? this.props.setOperatorOption : dummyFn}
      config={config}
      readonly={immutableValuesMode}
    />;

    return (
      <Col key={"op-options-for-"+this.props.selectedOperator} className="rule--operator-options">
        {opOpts}
      </Col>
    );
  }

  renderBeforeWidget(): React.ReactNode {
    const BeforeWidget = this.BeforeWidget;
    if (!BeforeWidget)
      return null;
    return <Col key={"before-widget-for-" +this.props.selectedOperator} className="rule--before-widget">
      <BeforeWidget {...this.props} />
    </Col>;
  }

  renderAfterWidget(): React.ReactNode {
    const AfterWidget = this.AfterWidget;
    if (!AfterWidget)
      return null;
    return <Col key={"after-widget-for-" +this.props.selectedOperator} className="rule--after-widget">
      <AfterWidget {...this.props} />
    </Col>;
  }

  renderError(): React.ReactNode {
    const {config, valueError, fieldError} = this.props;
    const { showErrorMessage } = config.settings;
    const RuleError = this.RuleError;
    const oneError = [fieldError, ...(valueError?.toArray() || [])].filter((e: any) => !!e).shift() || null;
    return showErrorMessage && oneError 
      && <div className="rule--error">
        {RuleError ? <RuleError error={oneError} /> : oneError}
      </div>;
  }

  renderDrag(): React.ReactNode {
    const { handleDraggerMouseDown, config, isLocked } = this.props;
    const { showDragIcon } = this.meta;
    const Icon = this.Icon;
    const icon = <Icon
      type="drag"
      config={config}
      readonly={isLocked}
    />;
    return showDragIcon && (<div 
      key="rule-drag-icon"
      onMouseDown={handleDraggerMouseDown}
      className={"qb-drag-handler rule--drag-handler"}
    >{icon}</div>);
  }

  renderDel(): React.ReactNode {
    const {config, isLocked} = this.props;
    const {
      deleteLabel,
      immutableGroupsMode,
      canDeleteLocked
    } = config.settings;
    const Icon = this.Icon;
    const Btn = this.Btn;

    return !immutableGroupsMode && (!isLocked || isLocked && canDeleteLocked) && (
      <Btn
        key="rule-del"
        type="delRule"
        onClick={this.removeSelf}
        label={deleteLabel}
        config={config}
        renderIcon={Icon}
      />
    );
  }

  renderLock(): React.ReactNode {
    const {config, isLocked, isTrueLocked, id} = this.props;
    const {
      lockLabel, lockedLabel, showLock,
    } = config.settings;
    const Switch = this.Switch;
      
    return showLock && !(isLocked && !isTrueLocked) && (
      <Switch
        key="rule-lock"
        type="lock"
        id={id}
        value={isLocked}
        setValue={this.setLock}
        label={lockLabel}
        checkedLabel={lockedLabel}
        hideLabel={true}
        config={config}
      />
    );
  }

  render (): React.ReactElement {
    const { showOperatorOptions, selectedFieldWidgetConfig } = this.meta;
    const { valueSrc, value, config } = this.props;
    const canShrinkValue = valueSrc?.first() == "value" && !showOperatorOptions && value.size == 1 && selectedFieldWidgetConfig.fullWidth;
    const BtnGrp = this.BtnGrp;

    const parts = [
      this.renderField(),
      this.renderOperator(),
      this.renderBeforeWidget(),
      this.renderWidget(),
      this.renderAfterWidget(),
      this.renderOperatorOptions(),
    ];
    const body = <div key="rule-body" className={classNames("rule--body", canShrinkValue && "can--shrink--value")}>{parts}</div>;

    const error = this.renderError();
    const drag = this.renderDrag();
    const lock = this.renderLock();
    const del = this.renderDel();

    return (
      <>
        {drag}
        <div key="rule-body-wrapper" className="rule--body--wrapper">
          {body}{error}
        </div>
        <div key="rule-header-wrapper" className="rule--header">
          <BtnGrp key="rule-header-group" config={config}>
            {lock}
            {del}
          </BtnGrp>
        </div>
      </>
    );
  }

}


export default RuleContainer(Draggable("rule")(WithConfirmFn(Rule)));


