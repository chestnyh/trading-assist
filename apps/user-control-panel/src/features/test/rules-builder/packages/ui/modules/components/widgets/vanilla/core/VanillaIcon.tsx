import React from "react";
import { DragIcon } from "../../../utils";

export default ({type}: {type: string}) => {
  const typeToIcon: Record<string, React.ReactElement | null> = {
  };
  let icon: React.ReactElement | null = typeToIcon[type as keyof typeof typeToIcon] || null;
  if (!icon && type === "drag") {
    icon = <DragIcon />;
  }

  return icon;
};
