import React from "react";

interface VanillaTextProps {
  value?: string;
  setValue: (value: string | undefined) => void;
  config: any;
  readonly?: boolean;
  placeholder?: string;
  maxLength?: number;
  customProps?: any;
}

export default (props: VanillaTextProps): React.ReactElement => {
  const {value, setValue, config, readonly, placeholder, maxLength, customProps, } = props;
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val === "")
      val = undefined as any; // don't allow empty value
    setValue(val);
  };
  const textValue = value || "";
  return (
    <input
      type="text" 
      value={textValue} 
      placeholder={placeholder} 
      disabled={readonly} 
      onChange={onChange}
      maxLength={maxLength}
      {...customProps}
    />
  );
};

