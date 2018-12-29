import React, { memo } from "react";
import cx from "classnames";
import { getFrameStyle } from "../../../getFrameStyle";
import { component, image } from "./Image.module.css";

export const Image = memo(
  ({ id, imageUrl, imageFrame, onMouseDown, frame, angle }) => (
    <div
      data-id={id}
      tabIndex="0"
      onMouseDown={onMouseDown}
      className={cx("element", component)}
      style={{
        ...getFrameStyle(frame, angle),
        background: "red"
      }}
    >
      <img className={image} style={getFrameStyle(imageFrame)} src={imageUrl} />
    </div>
  )
);
