import React from "react";

interface VanillaDateProps {
  value?: string;
  setValue: (value: string | undefined) => void;
  config: any;
  valueFormat?: string;
  readonly?: boolean;
  customProps?: any;
}

export default (props: VanillaDateProps): React.ReactElement => {
  const {value, setValue, config, valueFormat, readonly, customProps, } = props;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value == "")
      value = undefined as any;
    setValue(value);
  };
  
  return (
    <input type="date"  value={value || ""}  disabled={readonly} onChange={onChange} {...customProps} />
  );
};


