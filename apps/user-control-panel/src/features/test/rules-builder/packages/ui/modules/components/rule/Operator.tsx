import React, { Component } from "react";
import { Utils } from "../../../../core/modules";
import PropTypes from "prop-types";
import { keys, pickBy, mapValues } from "lodash";
import {useOnPropsChanged, pureShouldComponentUpdate, liteShouldComponentUpdate} from "../../utils/reactUtils";
const {getFieldConfig, getOperatorConfig} = Utils.ConfigUtils;

interface OperatorProps {
  id?: string;
  groupId?: string;
  config: any;
  selectedField?: any;
  selectedFieldId?: string;
  selectedFieldType?: string;
  selectedFieldSrc?: string;
  selectedOperator?: string;
  readonly?: boolean;
  customProps?: any;
  setOperator: any;
}

export default class Operator extends Component<OperatorProps> {
  meta: any;

  static propTypes = {
    id: PropTypes.string,
    groupId: PropTypes.string,
    config: PropTypes.object.isRequired,
    selectedField: PropTypes.any,
    selectedFieldId: PropTypes.string,
    selectedFieldType: PropTypes.string,
    selectedFieldSrc: PropTypes.string,
    selectedOperator: PropTypes.string,
    readonly: PropTypes.bool,
    customProps: PropTypes.object,
    //actions
    setOperator: PropTypes.func.isRequired,
  };

  constructor(props: OperatorProps) {
    super(props);
    useOnPropsChanged(this);

    this.onPropsChanged(props);
  }

  onPropsChanged(nextProps: OperatorProps) {
    const prevProps = this.props;
    const keysForMeta = ["config", "selectedField", "selectedFieldSrc", "selectedFieldType", "selectedOperator"];
    const needUpdateMeta = !this.meta || keysForMeta.map((k: string) => ((nextProps as any)[k] !== (prevProps as any)?.[k])).filter((ch: boolean) => ch).length > 0;

    if (needUpdateMeta) {
      this.meta = this.getMeta(nextProps);
    }
  }

  shouldComponentUpdate = liteShouldComponentUpdate(this, {
    // tip: rely on selectedFieldId instead
    selectedField: (nextValue: any, prevValue: any) => { return false; }
  });

  getMeta({config, selectedField, selectedFieldType, selectedOperator}: {
    config: any;
    selectedField?: any;
    selectedFieldType?: any;
    selectedOperator?: any;
  }) {
    const fieldConfig = getFieldConfig(config, selectedField);
    let operators = [...(fieldConfig?.operators || config.types[selectedFieldType]?.operators || [])];
    if (!selectedField && !operators.includes(selectedOperator)) {
      // eg. `prox` field was selected, then `fieldSrc` changed to `func`
      // But `text` type excludes `proximity` operator in config, so add manually
      operators.push(selectedOperator);
    }
    
    const operatorsOptions 
      = mapValues(
        pickBy(
          config.operators, 
          (item, key) => operators?.indexOf(key) !== -1
        ), 
        (_opts, op) => getOperatorConfig(config, op, selectedField)
      );
      
    const items = this.buildOptions(config, operatorsOptions, operators);

    const selectedOpts = operatorsOptions[selectedOperator] || {};
    const placeholder = this.props.config.settings.operatorPlaceholder;
    const selectedKey = selectedOperator;
    const selectedKeys = selectedKey ? [selectedKey] : null;
    const selectedPath = selectedKeys;
    const selectedLabel = selectedOpts.label;
    // tip: label2 is not documented for operators
    const selectedAltLabel = selectedOpts.label2 || selectedOpts.tooltip;
    
    return {
      placeholder, items,
      selectedKey, selectedKeys, selectedPath, selectedLabel, selectedAltLabel, selectedOpts, fieldConfig
    };
  }

  buildOptions(config: any, fields: any, ops: any) {
    if (!fields || !ops)
      return null;

    return keys(fields).sort((a: string, b: string) => (ops.indexOf(a) - ops.indexOf(b))).map((fieldKey: string) => {
      const field = fields[fieldKey];
      const label = field.label;
      const altLabel = field.label2;
      const tooltip = field.tooltip;
      return {
        key: fieldKey,
        path: fieldKey,
        label,
        altLabel,
        tooltip,
      };
    });
  }

  render() {
    const {config, customProps, setOperator, readonly, id, groupId} = this.props;
    const {renderOperator} = config.settings;
    const renderProps = {
      id,
      groupId,
      config, 
      customProps, 
      readonly,
      setField: setOperator,
      ...this.meta
    };
    if (!renderProps.items)
      return null;
    return renderOperator(renderProps, config.ctx);
  }


}
