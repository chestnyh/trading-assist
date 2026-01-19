import React from "react";
import { Utils } from "../../../../../../core/modules";
const { moment } = Utils;

interface VanillaDateTimeProps {
  value?: string;
  setValue: (value: string | undefined) => void;
  config: any;
  valueFormat?: string;
  use12Hours?: boolean;
  readonly?: boolean;
  customProps?: any;
}

export default (props: VanillaDateTimeProps): React.ReactElement => {
  const {value, setValue, config, valueFormat, use12Hours, readonly, customProps, } = props;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value == "")
      value = undefined as any;
    else
      value = moment(new Date(value)).format(valueFormat);
    setValue(value);
  };

  let dtValue = value;
  if (!value)
    dtValue = "";
  else
    dtValue = moment(value).format("YYYY-MM-DDTHH:mm");
  
  return (
    <input type="datetime-local"  value={dtValue}  disabled={readonly} onChange={onChange} {...customProps} />
  );
};


