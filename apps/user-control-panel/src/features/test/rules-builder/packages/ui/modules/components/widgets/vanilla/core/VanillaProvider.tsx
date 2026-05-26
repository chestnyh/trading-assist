import React from "react";

const VanillaProvider = ({config, children}: {config: any, children: React.ReactNode}) => {
  const themeMode = config.settings.themeMode ?? "light";
  const compactMode = config.settings.compactMode;
  const liteMode = config.settings.liteMode;

  const base = (<div className={`qb-${themeMode} ${compactMode ? "qb-compact" : ""} ${liteMode ? "qb-lite" : ""}`}>{children}</div>);
  return base;
};

export { VanillaProvider };
