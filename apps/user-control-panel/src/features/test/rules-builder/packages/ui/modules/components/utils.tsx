import React from "react";

const Col = ({children, ...props}: any): React.ReactElement => (<div {...props}>{children}</div>);

const dummyFn = (): void => {};

const DragIcon = (): React.ReactElement => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="gray" width="18px" height="18px">
    <path d="M0 0h24v24H0V0z" fill="none"/>
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);

const WithConfirmFn = (Cmp: any): any => (
  (props: any): React.ReactElement => {
    const {useConfirm} = props.config.settings;
    const confirmFn = useConfirm ? useConfirm.call(props.config.ctx, props.config.ctx) : null;
    return <Cmp {...props} confirmFn={confirmFn} />;
  }
);

const getWidgetId = ({
  id, isLHS, delta, parentFuncs,
}: any): string => {
  return [
    id,
    isLHS ? "L" : "R",
    isLHS ? -1 : (delta || 0),
    (parentFuncs || []).map(([f, a]: any) => `${f}(${a})`).join("/"),
  ].join(":");
};

const getRenderFromConfig = (config: any, renderFn: any): any => {
  let Cmp: any;
  if (typeof renderFn === "function") {
    Cmp = (pr: any): any => renderFn?.(pr, config.ctx);
    Cmp.displayName = renderFn.name;
  } else {
    Cmp = renderFn;
  }
  return Cmp;
};

export {
  Col, dummyFn, DragIcon, WithConfirmFn,
  getWidgetId,
  getRenderFromConfig,
};



