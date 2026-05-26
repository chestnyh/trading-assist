import React from "react";

const typeToLabel = {
  "addSubRuleSimple": "+",
  "addSubRule": "+",
  "addSubGroup": "+",
  "delGroup": "x",
  "delRuleGroup": "x",
  "delRule": "x",
};

export default ({type, label, onClick, readonly}: {type: string, label: string, onClick: () => void, readonly: boolean}) => {
  const btnLabel = label || typeToLabel[type as keyof typeof typeToLabel];
  return <button onClick={onClick} type="button" disabled={readonly}>{btnLabel}</button>;
};
