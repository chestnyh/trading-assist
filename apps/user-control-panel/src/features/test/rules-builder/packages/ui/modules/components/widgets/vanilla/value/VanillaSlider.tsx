import React from "react";

interface VanillaSliderProps {
  value?: number;
  setValue: (value: number | undefined) => void;
  config: any;
  readonly?: boolean;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  customProps?: {
    input?: any;
    slider?: any;
  };
}

export default (props: VanillaSliderProps): React.ReactElement => {
  const {value, setValue, config, readonly, min, max, step, placeholder, customProps = {}, } = props;
  const customInputProps = customProps.input || {};
  const customSliderProps = customProps.slider || customProps;
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
    <div style={{display: "inline-flex"}}>
      <input key={"number"} type="number"  value={numberValue} placeholder={placeholder} disabled={readonly} min={min} max={max} step={step} onChange={onChange} {...customInputProps} />
      <input key={"range"} type="range"  value={numberValue} disabled={readonly} min={min} max={max} step={step} onChange={onChange} {...customSliderProps} />
    </div>
  );
};

