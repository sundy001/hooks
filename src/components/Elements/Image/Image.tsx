import React from "react";
import { getFrameStyle } from "../../../getFrameStyle";
import "./Image.css";

export const Image = ({ id, imageUrl, imageFrame, frame, angle }) => (
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
