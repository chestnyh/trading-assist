import React from "react";

interface VanillaNumberProps {
  value?: number;
  setValue: (value: number | undefined) => void;
  config: any;
  readonly?: boolean;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  customProps?: any;
}

export default (props: VanillaNumberProps): React.ReactElement => {
  const {value, setValue, config, readonly, min, max, step, placeholder, customProps, } = props;
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val === "" || val === null)
      val = undefined as any;
    else
      val = Number(val) as any;
    setValue(val as any);
  };
  const numberValue = value == undefined ? "" : value;
  return (
    <input type="number"  value={numberValue} placeholder={placeholder} disabled={readonly} min={min} max={max} step={step} onChange={onChange} {...customProps} />
  );
};


