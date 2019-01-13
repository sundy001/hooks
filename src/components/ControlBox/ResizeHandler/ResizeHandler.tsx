import React, { SFC, HTMLAttributes } from "react";
import "./ResizeHandler.scss";
import cx from "classnames";

export const ResizeHandler: SFC<
  { position: string } & HTMLAttributes<HTMLDivElement>
> = ({ position, ...props }) => (
  <div {...props} className={cx("resizable-handler", position)} />
);

ResizeHandler.displayName = "ResizeHandler";
