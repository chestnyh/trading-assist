import React from "react";
import { Utils } from "../../../../../../core/modules";
import omit from "lodash/omit";
const { mapListValues } = Utils.ListUtils;

interface VanillaSelectProps {
  listValues: any;
  value?: any;
  setValue: (value: any) => void;
  allowCustomValues?: boolean;
  readonly?: boolean;
  customProps?: any;
}

export default ({listValues, value, setValue, allowCustomValues, readonly, customProps,}: VanillaSelectProps): React.ReactElement => {
  const renderOptions = () => 
    mapListValues(listValues, ({title, value}: any) => {
      return <option key={value} value={value}>{title}</option>;
    });

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => setValue(e.target.value);
  
  const hasValue = value != null;
  return (
    <select
      onChange={onChange}
      value={hasValue ? value : ""}
      disabled={readonly}
      {...omit(customProps, ["showSearch", "input"])}
    >
      {!hasValue && <option disabled value={""}></option>}
      {renderOptions()}
    </select>
  );
};

