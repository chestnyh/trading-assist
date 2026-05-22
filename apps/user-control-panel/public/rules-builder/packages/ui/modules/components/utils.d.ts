import React from "react";

export const Col: React.FC<React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }>;
export const dummyFn: () => void;
export const DragIcon: React.FC;
export const WithConfirmFn: <T extends React.ComponentType<any>>(Cmp: T) => React.FC<any>;
export const getWidgetId: (params: {
  id: string;
  isLHS: boolean;
  delta?: number;
  parentFuncs?: Array<[string, string]>;
}) => string;
export const getRenderFromConfig: (config: any, renderFn: any) => React.ComponentType<any>;


