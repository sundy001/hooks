import React, { memo, forwardRef } from "react";
import "./RotationHandler.scss";
import classNames from "classnames";

const RotationHandler = forwardRef(({ position, ...props }, ref) => {
  return <div {...props} ref={ref} className={classNames("rotation-handler", position)} />;
});

export default memo(RotationHandler);
