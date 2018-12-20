import React from "react";
import { useElement } from "../../../hooks/useElement";
import style from "./Image.module.css";
import cx from "classnames";

export const Image = ({ id, imageUrl, imageFrame, ...props }) => (
  <div
    data-id={id}
    className={cx("element", style.component)}
    {...useElement(props)}
  >
    <img
      className={style.image}
      style={{
        width: `${imageFrame.width}px`,
        height: `${imageFrame.height}px`,
        transform: `translate(${imageFrame.x}px, ${imageFrame.y}px)`
      }}
      src={imageUrl}
    />
  </div>
);
