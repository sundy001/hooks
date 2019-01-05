import React, { Suspense, memo } from "react";
import "./Page.css";
import { ControlBox } from "../ControlBox";
import { createElements } from "../App/createElements";

export const Page = memo(
  ({
    id,
    width,
    height,
    backgroundColor,
    elements,
    dispatch,
    controlBox,
    rotateMouseDown,
    resizeMouseDown,
    resizeHandlerPosition
  }) => {
    return (
      <div
        data-id={id}
        className="page"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: backgroundColor
        }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          {createElements(dispatch, elements)}
        </Suspense>
        {controlBox && (
          <ControlBox
            frame={controlBox.frame}
            angle={controlBox.angle}
            // TODO: when the logic become complicated, move it to selector
            resizeHandlerPosition={resizeHandlerPosition}
            onRotateMouseDown={rotateMouseDown}
            onResizeMouseDown={resizeMouseDown}
          />
        )}
      </div>
    );
  }
);

Page.displayName = "Page";
