import React, { memo } from "react";
import "./RotationHandler.scss";
import cx from "classnames";

export const RotationHandler = memo(({ position, ...props }) => (
  <div {...props} className={cx("rotation-handler", position)} />
));
