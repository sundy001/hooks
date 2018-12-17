import { useElement } from "../../../hook/useElement";
import React, { memo } from "react";
import style from "./Image.module.css";
import cx from "classnames";
import { useState } from "react";

const Image = ({ id, imageUrl, dispatch, ...props }) => {
  const elementProps = useElement(props);
  const [imageFrame, setImageFrame] = useState({
    width: 640,
    height: 640,
    x: 0,
    y: 0
  });

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
          transform: `translate(${imageFrame.x}px, ${
            imageFrame.y
          }px) rotate(0deg)`
        }}
        src={imageUrl}
      />
    </div>
  );
};

export default memo(Image);
