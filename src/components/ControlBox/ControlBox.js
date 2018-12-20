import "./ControlBox.scss";
import React, { memo } from "react";
import classNames from "classnames";
import ResizeHandler from "./ResizeHandler";
import RotationHandler from "./RotationHandler";
import {
  RECT_VERTICES,
  ALL_INDEXES,
  EDGE_INDEXES,
  CORNER_INDEXES
} from "../../math/rect";

const POSITION_VERTEX_INDEX_MAP = {
  all: ALL_INDEXES,
  edge: EDGE_INDEXES,
  corner: CORNER_INDEXES
};

const ControlBox = ({
  show,
  frame: { x, y, width, height },
  angle,
  controls, // (rotation|resize)[]
  resizeHandlerPosition, // all, edge, corner
  onRotateMouseDown,
  onResizeMouseDown
}) => {
  if (!show || width === 0 || height === 0) {
    return null;
  }

  const children = [];

  // resize
  if (controls.indexOf("resize") !== -1) {
    POSITION_VERTEX_INDEX_MAP[resizeHandlerPosition].forEach(index => {
      const position = RECT_VERTICES[index];
      children.push(
        <ResizeHandler
          key={`resize-${position}`}
          position={position}
          onMouseDown={onResizeMouseDown[position]}
        />
      );
    });
  }

  // rotation
  if (controls.indexOf("rotation") !== -1) {
    children.push(
      <RotationHandler
        key="rotate-bottom"
        position="bottom"
        onMouseDown={event => {
          onRotateMouseDown(event);
        }}
      />
    );
  }

  return (
    <div
      className={classNames("control-box", {
        // resizing: isResizing,
        // rotating: isRotating
      })}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(${x}px, ${y}px) rotate(${angle}rad)`
      }}
    >
      {children}
    </div>
  );
};

ControlBox.defaultProps = {
  resizeHandlerPosition: "all",
  controls: ["rotation", "resize"]
};

export default memo(ControlBox);
