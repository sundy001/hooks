import React, { memo, SFC } from "react";
import "./SelectionBox.scss";

const InternalSelectionBox: SFC<any> = ({ frame: { x, y, width, height } }) =>
  width === 0 || height === 0 ? null : (
    <div
      className="selection-box"
      style={{
        width: width,
        height: height,
        transform: `translate(${x}px, ${y}px)`
      }}
    />
  );
export const SelectionBox = memo(InternalSelectionBox);

SelectionBox.displayName = "SelectionBox";
