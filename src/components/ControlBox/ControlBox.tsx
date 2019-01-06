import "./ControlBox.scss";
import React, { memo, useCallback, SFC } from "react";
import cx from "classnames";
import { ResizeHandler } from "./ResizeHandler";
import { RotationHandler } from "./RotationHandler";
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

const InternalControlBox: SFC<any> = (
  {
    frame: { x, y, width, height },
    angle,
    controls = ["rotation", "resize"], // (rotation|resize)[]
    resizeHandlerPosition = "all", // all, edge, corner
    onRotateMouseDown,
    onResizeMouseDown
  },
  ref
) => {
  const children = [];

  // resize
  if (controls.indexOf("resize") !== -1) {
    const indexes = POSITION_VERTEX_INDEX_MAP[resizeHandlerPosition];
    for (let i = 0; i < indexes.length; i++) {
      const position = RECT_VERTICES[indexes[i]];
      children.push(
        <ResizeHandler
          key={`resize-${position}`}
          position={position}
          onMouseDown={onResizeMouseDown[position]}
        />
      );
    }
  }

  // rotation
  if (controls.indexOf("rotation") !== -1) {
    children.push(
      <RotationHandler
        key="rotate-bottom"
        position="bottom"
        onMouseDown={useCallback(event => {
          onRotateMouseDown(event);
        }, [])}
      />
    );
  }

  return (
    <div
      ref={ref}
      className={cx("control-box", {
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

export const ControlBox = memo(React.forwardRef(InternalControlBox));

ControlBox.displayName = "ControlBox";