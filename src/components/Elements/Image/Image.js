import React, { memo } from "react";
import cx from "classnames";
import { useElement } from "../../../hooks/useElement";
import { component, image } from "./Image.module.css";

export const Image = memo(({ id, imageUrl, imageFrame, ...props }) => (
  <div
    data-id={id}
    tabIndex="0"
    className={cx("element", component)}
    {...useElement(props)}
  >
    <img
      className={image}
      style={{
        width: `${imageFrame.width}px`,
        height: `${imageFrame.height}px`,
        transform: `translate(${imageFrame.x}px, ${imageFrame.y}px)`
      }}
      src={imageUrl}
    />
  </div>
));
