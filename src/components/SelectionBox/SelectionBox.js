import React, { memo } from "react";
import "./SelectionBox.scss";

export const SelectionBox = memo(({ frame: { x, y, width, height } }) =>
  width === 0 || height === 0 ? null : (
    <div
      className="selection-box"
      style={{
        width: width,
        height: height,
        transform: `translate(${x}px, ${y}px)`
      }}
    />
  )
);

SelectionBox.displayName = "SelectionBox";
