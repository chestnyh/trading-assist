import React from "react";

interface VanillaBooleanProps {
  value?: boolean;
  setValue: (value: boolean) => void;
  config: any;
  labelYes?: string;
  labelNo?: string;
  readonly?: boolean;
  widgetId?: string;
  customProps?: {
    radioYes?: any;
    radioNo?: any;
  };
}

export default (props: VanillaBooleanProps): React.ReactElement => {
  const {value, setValue, config, labelYes, labelNo, readonly, widgetId, customProps = {}} = props;
  const customRadioYesProps = customProps.radioYes || {};
  const customRadioNoProps = customProps.radioNo || {};

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.checked);
  const onRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value == "true");

  // return <>
  //     <input key={widgetId}  type="checkbox" id={widgetId} checked={!!value} disabled={readonly} onChange={onCheckboxChange} />
  //     <label style={{display: "inline"}} key={id+"label"}  htmlFor={widgetId}>{value ? labelYes : labelNo}</label>
  // </>;

  return <>
    <input type="radio" value="true" checked={!!value} disabled={readonly} onChange={onRadioChange} { ...customRadioYesProps }/> {labelYes}
    <input type="radio" value="false" checked={!value} disabled={readonly} onChange={onRadioChange} { ...customRadioNoProps } /> {labelNo}
  </>;

};


