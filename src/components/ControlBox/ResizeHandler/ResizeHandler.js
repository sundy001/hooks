import React from "react";
import "./ResizeHandler.scss";
import cx from "classnames";

export const ResizeHandler = ({ position, ...props }) => (
  <div {...props} className={cx("resizable-handler", position)} />
);

ResizeHandler.displayName = "ResizeHandler";
