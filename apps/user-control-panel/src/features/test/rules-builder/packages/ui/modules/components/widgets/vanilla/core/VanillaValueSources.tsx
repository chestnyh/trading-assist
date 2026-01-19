import React from "react";

export default ({config, valueSources, valueSrc, title, setValueSrc, readonly}: {config: any, valueSources: any, valueSrc: string, title: string, setValueSrc: (value: string) => void, readonly: boolean}) => {
  const renderOptions = (valueSources: Array<[string, {label: string}]>) => (
    valueSources.map(([srcKey, info]) => (
      <option key={srcKey} value={srcKey}>{info.label}</option>
    ))
  );

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => setValueSrc(e.target.value);
  
  return (
    <select 
      onChange={onChange}
      value={valueSrc || ""}
      disabled={readonly}
    >
      {renderOptions(valueSources)}
    </select>
  );
};
