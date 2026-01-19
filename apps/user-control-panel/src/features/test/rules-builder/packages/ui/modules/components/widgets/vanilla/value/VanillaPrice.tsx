import React from "react";
import { NumericFormat, getNumberFormatProps } from "../../../../utils/numberFormat";

interface VanillaPriceProps {
  value?: number;
  setValue: (value: number | undefined) => void;
  readonly?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  customProps?: any;
  [key: string]: any;
}

export default (props: VanillaPriceProps): React.ReactElement => {
  const {
    value,
    setValue,
    readonly,
    placeholder,
    min,
    max,
    customProps,
  } = props;

  const numericFormatProps = getNumberFormatProps(props);

  const formattedValue = value == undefined ? "" : value;
  //const isValid = value != undefined && (max == undefined || value <= max) && (min == undefined || value >= min);

  const onValueChange = (values: any) => {
    let { floatValue } = values;
    setValue(floatValue !== undefined ? floatValue : undefined);
  };

  return (
    <NumericFormat
      value={formattedValue}
      placeholder={placeholder}
      disabled={readonly}
      onValueChange={onValueChange}
      {...customProps}
      {...numericFormatProps}
    />
  );
};

