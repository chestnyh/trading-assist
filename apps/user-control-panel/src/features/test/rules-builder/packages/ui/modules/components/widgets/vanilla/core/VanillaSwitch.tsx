import React from "react";

export default ({value, setValue, label, id, config, type}: {value: boolean, setValue: (value: boolean) => void, label: string, id: string, config: any, type: string}) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(Boolean(e.target.checked));
  const postfix = type;
  return [
    <input key={id+postfix}  type="checkbox" id={id+postfix} checked={!!value} onChange={onChange} />
    ,
    <label key={id+postfix+"label"}  htmlFor={id+postfix}>{label}</label>
  ];
};
