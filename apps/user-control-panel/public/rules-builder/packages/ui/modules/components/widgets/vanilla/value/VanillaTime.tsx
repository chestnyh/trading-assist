import React from "react";

interface VanillaTimeProps {
  value?: string;
  setValue: (value: string | undefined) => void;
  config: any;
  valueFormat?: string;
  use12Hours?: boolean;
  readonly?: boolean;
  customProps?: any;
}

export default (props: VanillaTimeProps): React.ReactElement => {
  const {value, setValue, config, valueFormat, use12Hours, readonly, customProps } = props;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value == "")
      value = undefined as any;
    setValue(value);
  };
  
  return (
    <input type="time"  value={value || ""}  disabled={readonly} onChange={onChange} {...customProps} />
  );
};

