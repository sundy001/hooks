import React, { FC, HTMLAttributes } from "react";
import "./RotationHandler.scss";
import cx from "classnames";

export const RotationHandler: FC<
  { position: string } & HTMLAttributes<HTMLDivElement>
> = ({ position, ...props }) => (
  <div {...props} className={cx("rotation-handler", position)} />
);

RotationHandler.displayName = "RotationHandler";
