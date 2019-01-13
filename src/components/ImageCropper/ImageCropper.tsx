import React, { MouseEvent, SFC } from "react";

import { Frame } from "./type";

import { ControlBox } from "../ControlBox";
import "./ImageCropper.scss";
import { getFrameStyle } from "../../getFrameStyle";

const InternalImageCropper: SFC<{
  imageUrl: string;
  frame: Frame;
  imageFrame: Frame;
  outerBoxFrame: Frame;
  angle: number;
  onMouseDown: (event: MouseEvent) => void;
  onMouseMove: (event: MouseEvent) => void;
  onMouseUp: (event: MouseEvent) => void;
  onMaskMouseDown: (event: MouseEvent) => void;
  onInnerResizeMouseDown: { [position: string]: (event: MouseEvent) => void };
  onOuterResizeMouseDown: { [position: string]: (event: MouseEvent) => void };
}> = (
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
      frame={frame}
      angle={angle}
      resizeHandlerPosition="corner"
      controls={["resize"]}
      onResizeMouseDown={onInnerResizeMouseDown}
    />
    <ControlBox
      frame={outerBoxFrame}
      angle={angle}
      resizeHandlerPosition="corner"
      controls={["resize"]}
      onResizeMouseDown={onOuterResizeMouseDown}
    />
  </div>
);

export const ImageCropper = React.forwardRef(InternalImageCropper);
