import React, { memo } from "react";
import "./SelectionBox.scss";

// TODO: think about how to optimize prop elements to prevent rerender trigger by elements change
const SelectionBox = ({ frame: { x, y, width, height } }) => {
  // TODO: move out and tidy up latter
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
