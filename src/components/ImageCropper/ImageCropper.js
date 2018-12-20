import React from "react";
import { ControlBox } from "../ControlBox";
import "./ImageCropper.scss";

export const ImageCropper = ({
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
}) => (
  <div
    onMouseDown={onMouseDown}
    onMouseMove={onMouseMove}
    onMouseUp={onMouseUp}
  >
    <div className="image-croppoer__masked" onMouseDown={onMaskMouseDown} />
    <div
      className="image-container"
      style={{
        background: "green",
        width: `${frame.width}px`,
        height: `${frame.height}px`,
        transform: `translate(${frame.x}px, ${frame.y}px) rotate(${angle}rad)`
      }}
    >
      <img
        className="image-container__image"
        style={{
          width: `${imageFrame.width}px`,
          height: `${imageFrame.height}px`,
          transform: `translate(${imageFrame.x}px, ${imageFrame.y}px)`
        }}
        src={imageUrl}
      />
    </div>
    <img
      className="image-container__image"
      style={{
        opacity: 0.5,
        width: `${imageFrame.width}px`,
        height: `${imageFrame.height}px`,
        transform: `translate(${outerBoxFrame.x}px, ${
          outerBoxFrame.y
        }px) rotate(${angle}rad)`
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
);
