import React from "react";
import "./RotationHandler.scss";
import cx from "classnames";

export const RotationHandler = ({ position, ...props }) => (
  <div {...props} className={cx("rotation-handler", position)} />
);

RotationHandler.displayName = "RotationHandler";
