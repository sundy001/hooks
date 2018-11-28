import React, { memo, forwardRef } from "react";
import "./ResizeHandler.scss";
import classNames from "classnames";

const ResizeHandler = forwardRef(({ position, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className={classNames("resizable-handler", position)}
    />
  );
});

export default memo(ResizeHandler);
