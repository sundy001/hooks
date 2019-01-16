import React, { FC } from "react";
import { ImageEntity } from "./type";
import "./Image.css";
import { getFrameStyle } from "../../../getFrameStyle";

export const Image: FC<ImageEntity> = ({
  id,
  imageUrl,
  imageFrame,
  frame,
  angle
}) => (
  <div
    data-id={id}
    tabIndex={0}
    className="element"
    style={{
      ...getFrameStyle(frame, angle),
      background: "red"
    }}
  >
    <img
      className="element-image"
      style={getFrameStyle(imageFrame)}
      src={imageUrl}
    />
  </div>
);

Image.displayName = "Image";
