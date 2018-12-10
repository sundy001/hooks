import React, { memo } from "react";
import "./SelectionBox.scss";

const SelectionBox = ({ frame: { x, y, width, height } }) => {
  if (width === 0 || height === 0) {
    return null;
  }

  return (
    <div
      className="selection-box"
      style={{
        width: width,
        height: height,
        transform: `translate(${x}px, ${y}px)`
      }}
    />
  );
};

export default memo(SelectionBox);
