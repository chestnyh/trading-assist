import React, { Component } from "react";
import { Utils } from "../../../../core/modules";
import PropTypes from "prop-types";
import {truncateString} from "../../utils/stuff";
import {useOnPropsChanged} from "../../utils/reactUtils";
import last from "lodash/last";
import keys from "lodash/keys";
const {getFieldPathLabels} = Utils.RuleUtils;
const {getFieldConfig, getFieldParts, getFieldPathParts} = Utils.ConfigUtils;

interface FieldProps {
  id?: string;
  groupId?: string;
  config: any;
  selectedField?: any;
  selectedFieldSrc?: string;
  selectedFieldType?: string;
  parentField?: string;
  customProps?: any;
  readonly?: boolean;
  setField: any;
  setFieldSrc?: any;
}

export default class Field extends Component<FieldProps> {
  meta: any;

  static propTypes = {
    id: PropTypes.string,
    groupId: PropTypes.string,
    config: PropTypes.object.isRequired,
    selectedField: PropTypes.any,
    selectedFieldSrc: PropTypes.string,
    selectedFieldType: PropTypes.string,
    parentField: PropTypes.string,
    customProps: PropTypes.object,
    readonly: PropTypes.bool,
    //actions
    setField: PropTypes.func.isRequired,
    setFieldSrc: PropTypes.func,
  };

  constructor(props: FieldProps) {
    super(props);
    useOnPropsChanged(this);

    this.onPropsChanged(props);
  }

  onPropsChanged(nextProps: FieldProps) {
    const prevProps = this.props;
    const keysForMeta = ["selectedField", "selectedFieldSrc", "selectedFieldType", "config", "parentField"];
    const needUpdateMeta = !this.meta || keysForMeta.map((k: string) => ((nextProps as any)[k] !== (prevProps as any)?.[k])).filter((ch: boolean) => ch).length > 0;

    if (needUpdateMeta) {
      this.meta = this.getMeta(nextProps);
    }
  }

  getMeta({selectedField, selectedFieldType, config, parentField}: {
    selectedField?: any;
    selectedFieldType?: any;
    config: any;
    parentField?: any;
  }) {
    let selectedKey = selectedField;
    const {maxLabelsLength, fieldSeparatorDisplay, fieldPlaceholder, fieldSeparator} = config.settings;
    const isFieldSelected = !!selectedField;
    const placeholder = !isFieldSelected ? truncateString(fieldPlaceholder, maxLabelsLength, "") : null;
    const currField = isFieldSelected ? getFieldConfig(config, selectedKey) : null;
    const selectedOpts = currField || {};

    const selectedKeys = getFieldPathParts(selectedKey, config);
    const selectedPath = getFieldPathParts(selectedKey, config, true);
    const selectedLabel = this.getFieldLabel(currField, selectedKey, config);
    const partsLabels = getFieldPathLabels(selectedKey, config);
    let selectedFullLabel = partsLabels ? partsLabels.join(fieldSeparatorDisplay) : null;
    if (selectedFullLabel == selectedLabel || parentField)
      selectedFullLabel = null;
    const selectedAltLabel = selectedOpts.label2 || selectedOpts.tooltip;

    const parentFieldPath = getFieldParts(parentField, config);
    const parentFieldConfig = parentField ? getFieldConfig(config, parentField) : null;
    const sourceFields = parentField ? parentFieldConfig && parentFieldConfig.subfields : config.fields;
    const lookingForFieldType = !isFieldSelected && selectedFieldType;
    const items = this.buildOptions(parentFieldPath || null, config, sourceFields, lookingForFieldType, parentFieldPath || null);

    // Field source has been chnaged, no new field selected, but op & value remains
    const errorText = lookingForFieldType ? "Please select field" : null;

    if (selectedKey && typeof selectedKey === "object") {
      // can happen due to incorrect rule state: field is Map{func, args} but fieldSrc is not "func"
      selectedKey = undefined;
    }

    return {
      placeholder, items, parentField,
      selectedKey, selectedKeys, selectedPath, selectedLabel, selectedOpts, selectedAltLabel, selectedFullLabel,
      errorText,
    };
  }

  getFieldLabel(fieldOpts: any, fieldKey: any, config: any) {
    if (!fieldKey) return null;
    let maxLabelsLength = config.settings.maxLabelsLength;
    let fieldParts = getFieldParts(fieldKey, config);
    let label = fieldOpts?.label || last(fieldParts);
    label = truncateString(label, maxLabelsLength, "");
    return label;
  }

  buildOptions(parentFieldPath: any, config: any, fields: any, fieldType: any = undefined, path: any[] | null = null, optGroup: any = null): any {
    if (!fields)
      return null;
    const {fieldSeparator, fieldSeparatorDisplay} = config.settings;
    const prefix = path?.length ? path.join(fieldSeparator) + fieldSeparator : "";

    const countFieldsMatchesType = (fields: any): number => {
      return Object.keys(fields || {}).reduce((acc: number, fieldKey: string) => {
        const field = fields[fieldKey];
        if (field.type === "!struct") {
          return acc + countFieldsMatchesType(field.subfields);
        } else {
          return acc + (field.type === fieldType ? 1 : 0);
        }
      }, 0);
    };

    return keys(fields).map((fieldKey: string) => {
      const fullFieldPath = [...(path ?? []), fieldKey];
      const field = fields[fieldKey];
      const label = this.getFieldLabel(field, fullFieldPath, config);
      const partsLabels = getFieldPathLabels(fullFieldPath, config);
      let fullLabel = partsLabels.join(fieldSeparatorDisplay);
      if (fullLabel == label || parentFieldPath?.length)
        fullLabel = null;
      const altLabel = field.label2;
      const tooltip = field.tooltip;
      const disabled = field.disabled;

      if (field.hideForSelect)
        return undefined;

      if (field.type == "!struct") {
        const items: any = this.buildOptions(parentFieldPath || null, config, field.subfields, fieldType, fullFieldPath || null, {
          label,
          tooltip,
        });
        const hasItemsMatchesType = countFieldsMatchesType(field.subfields) > 0;
        return {
          disabled,
          key: fieldKey,
          path: prefix+fieldKey,
          label,
          fullLabel,
          altLabel,
          tooltip,
          items,
          matchesType: hasItemsMatchesType,
        };
      } else {
        const matchesType = fieldType !== undefined ? field.type === fieldType : undefined;
        return {
          disabled,
          key: fieldKey,
          path: prefix+fieldKey,
          label,
          fullLabel,
          altLabel,
          tooltip,
          grouplabel: optGroup?.label,
          group: optGroup,
          matchesType,
        };
      }
    }).filter((o: any) => !!o);
  }

  setField = (field: any, asyncListValues: any, _meta: any = {}) => {
    const {id} = this.props;
    if (!_meta.widgetId) {
      const widgetId = [
        id,
        "L",
        -1,
      ].join(":");
      _meta.widgetId = widgetId;
    }
    this.props.setField(field, asyncListValues, _meta);
  };

  render() {
    const {config, customProps, setFieldSrc, readonly, id, groupId} = this.props;
    const {renderField} = config.settings;
    if (!this.meta.items) {
      return null;
    }
    const renderProps = {
      id,
      groupId,
      config, 
      customProps, 
      readonly,
      setField: this.setField,
      setFieldSrc,
      ...this.meta
    };
    return renderField(renderProps, config.ctx);
  }

}
