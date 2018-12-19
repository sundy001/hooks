import React, { memo, useEffect, useRef, useState } from "react";
import Victor from "victor";
import "./ImageCropper.scss";
import { hideControlBox, showControlBox } from "../Canvas/CanvasAction";
import { transform, frameDisplacement } from "../../math/affineTransformation";
import useDragAndDrop from "./hooks/useDragAndDrop";
import useResize from "./hooks/useResize";
import useInnerCrop from "./hooks/useInnerCrop";
import ControlBox from "../ControlBox";

const ImageCropper = ({
  id,
  imageUrl,
  imageFrame: initalImageFrame,
  dispatch,
  frame: initialFrame,
  angle,
  setIsCropping,
  onFinish
}) => {
  const [imageFrame, setImageFrame] = useState(initalImageFrame);
  const [frame, setFrame] = useState(initialFrame);
  const [outerBoxPosition, setOuterPosition] = useState(() => {
    const { x, y, width, height } = imageFrame;
    const offset = new Victor(x, y);
    offset.rotate(angle);

    const targetVertex = transform(new Victor(0, 0), frame, angle);
    targetVertex.add(offset);

    return frameDisplacement(
      new Victor(0, 0), //  raw vertex
      width,
      height,
      angle,
      targetVertex // target vertex
    );
  });

  const outerBoxFrame = {
    ...imageFrame,
    x: outerBoxPosition.x,
    y: outerBoxPosition.y
  };

  useEffect(() => {
    dispatch(hideControlBox());

    return () => {
      dispatch(showControlBox());
    };
  }, []);

  // TODO: should unify the code with useDragAndDrop in canvas
  const { dragMouseDown, dragMouseMove, dragMouseUp } = useDragAndDrop(
    setImageFrame,
    setOuterPosition,
    imageFrame,
    outerBoxPosition,
    angle
  );

  const { resizeMouseDown, resizeMouseMove, resizeMouseUp } = useResize(
    setOuterPosition,
    setImageFrame,
    outerBoxFrame,
    frame,
    angle
  );

  const { cropMouseDown, cropMouseMove, cropMouseUp } = useInnerCrop(
    setFrame,
    setImageFrame,
    frame,
    imageFrame,
    angle
  );

  return (
    <div
      onMouseDown={dragMouseDown}
      onMouseMove={event => {
        dragMouseMove(event);
        resizeMouseMove(event);
        cropMouseMove(event);
      }}
      onMouseUp={event => {
        dragMouseUp(event);
        resizeMouseUp(event);
        cropMouseUp(event);
      }}
    >
      <div
        className="image-croppoer__masked"
        onMouseDown={event => {
          event.stopPropagation();
          onFinish(imageFrame);
          setIsCropping(false);
        }}
      />
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
          transform: `translate(${outerBoxPosition.x}px, ${
            outerBoxPosition.y
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
        resizeMouseDown={cropMouseDown}
      />
      <ControlBox
        show={true}
        frame={outerBoxFrame}
        angle={angle}
        resizeHandlerPosition="corner"
        controls={["resize"]}
        resizeMouseDown={resizeMouseDown}
      />
    </div>
  );
};

export default memo(ImageCropper);
