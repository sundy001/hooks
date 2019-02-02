import React, { memo, FC } from "react";
import "./SelectionBox.scss";

const InternalSelectionBox: FC<{
  frame: Readonly<{
    width: number;
    height: number;
    x: number;
    y: number;
  }>;
}> = ({ frame: { x, y, width, height } }) =>
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
