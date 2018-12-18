import React from "react";
import { useElement } from "../../../hook/useElement";
import style from "./Image.module.css";
import cx from "classnames";

export const DisplayImage = ({ id, imageUrl, imageFrame, ...props }) => {
  const elementProps = useElement(props);
  return (
    <div
      data-id={id}
      className={cx("element", style.component)}
      {...elementProps}
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
};
