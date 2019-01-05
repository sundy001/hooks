import React from "react";
import { ControlBox } from "../ControlBox";
import "./ImageCropper.scss";
import { getFrameStyle } from "../../getFrameStyle";

export const ImageCropper = React.forwardRef(
  (
    {
      imageUrl,
      frame,
      imageFrame,
      outerBoxFrame,
      angle,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMaskMouseDown,
      onInnerResizeMouseDown,
      onOuterResizeMouseDown
    },
    ref
  ) => (
    <div
      ref={ref}
      className="image-croppoer"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <div
        className="image-croppoer__masked"
        onMouseDown={event => {
          onMaskMouseDown(event);
        }}
      />
      <div
        className="image-container"
        style={{
          background: "red",
          ...getFrameStyle(frame, angle)
        }}
      >
        <img
          className="image-container__image"
          style={getFrameStyle(imageFrame)}
          src={imageUrl}
        />
      </div>
      <img
        className="image-container__image"
        style={{
          ...getFrameStyle(outerBoxFrame, angle),
          opacity: 0.5
        }}
        src={imageUrl}
      />
      <ControlBox
        show={true}
        frame={frame}
        angle={angle}
        resizeHandlerPosition="corner"
        controls={["resize"]}
        onResizeMouseDown={onInnerResizeMouseDown}
      />
      <ControlBox
        show={true}
        frame={outerBoxFrame}
        angle={angle}
        resizeHandlerPosition="corner"
        controls={["resize"]}
        onResizeMouseDown={onOuterResizeMouseDown}
      />
    </div>
  )
);
