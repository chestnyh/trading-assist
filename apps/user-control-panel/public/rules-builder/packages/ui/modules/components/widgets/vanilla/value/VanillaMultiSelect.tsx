import React from "react";
import { Utils } from "../../../../../../core/modules";
import { omit } from "lodash";
const { mapListValues } = Utils.ListUtils;

interface VanillaMultiSelectProps {
  listValues: any;
  value?: any[];
  setValue: (value: any[] | undefined) => void;
  allowCustomValues?: boolean;
  readonly?: boolean;
  customProps?: any;
}

export default ({listValues, value, setValue, allowCustomValues, readonly, customProps,}: VanillaMultiSelectProps): React.ReactElement => {
  const renderOptions = () => 
    mapListValues(listValues, ({title, value}: any) => {
      return <option key={value} value={value}>{title}</option>;
    });

  const getMultiSelectValues = (multiselect: HTMLSelectElement): any[] | undefined => {
    let values: any[] = [];
    const options = multiselect.options;
    for (let i = 0 ; i < options.length ; i++) {
      const opt = options[i];
      if (opt.selected) {
        values.push(opt.value);
      }
    }
    if (!values.length)
      values = undefined as any; //not allow []
    return values;
  };

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => setValue(getMultiSelectValues(e.target));
  
  return (
    <select multiple
      onChange={onChange}
      value={value}
      disabled={readonly}
      {...omit(customProps, ["showSearch", "input", "showCheckboxes"])}
    >
      {renderOptions()}
    </select>
  );
};


