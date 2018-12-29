import { getFrameStyle } from "./getFrameStyle";
import React, { memo } from "react";
import "./Test.css";

export const Test = memo(({ id, onMouseDown, frame, angle }) => {
  return (
    <div
      data-id={id}
      tabIndex="0"
      className="element"
      onMouseDown={onMouseDown}
      style={{
        ...getFrameStyle(frame, angle),
        background: "brown"
      }}
    />
  );
});
