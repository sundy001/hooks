import React, { memo } from "react";
import "./ResizeHandler.scss";
import cx from "classnames";

export const ResizeHandler = memo(({ position, ...props }) => (
  <div {...props} className={cx("resizable-handler", position)} />
));
