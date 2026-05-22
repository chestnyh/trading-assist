import React from "react";

interface VanillaTextAreaProps {
  value?: string;
  setValue: (value: string | undefined) => void;
  config: any;
  readonly?: boolean;
  placeholder?: string;
  maxLength?: number;
  maxRows?: number;
  fullWidth?: boolean;
  customProps?: any;
}

export default (props: VanillaTextAreaProps): React.ReactElement => {
  const {value, setValue, config, readonly, placeholder, maxLength, maxRows, fullWidth, customProps, } = props;
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let val = e.target.value;
    if (val === "")
      val = undefined as any; // don't allow empty value
    setValue(val);
  };
  const textValue = value || "";
  return (
    <textarea
      value={textValue} 
      placeholder={placeholder}
      disabled={readonly}
      onChange={onChange}
      maxLength={maxLength}
      style={{
        width: fullWidth ? "100%" : undefined
      }}
      {...customProps}
    />
  );
};

