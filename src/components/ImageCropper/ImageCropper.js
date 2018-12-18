import React, { memo, useEffect, useRef, useState } from "react";
import Victor from "victor";
import "./ImageCropper.scss";
import { updateControlBox } from "../Canvas/CanvasAction";
import { transform, frameDisplacement } from "../../math/affineTransformation";
import { useDragAndDrop } from "../../hook/useDragAndDrop";

const ImageCropper = ({
  id,
  imageUrl,
  imageFrame: initalImageFrame,
  dispatch,
  frame: initialFrame,
  angle,
  setIsCropping
}) => {
  const [imageFrame, setImageFrame] = useState(initalImageFrame);
  const [frame, setFrame] = useState(initialFrame);

  useEffect(() => {
    dispatch(updateControlBox({ frame: { x: 0, y: 0, width: 0, height: 0 } }));
  }, []);

  const offset = new Victor(imageFrame.x, imageFrame.y);
  offset.rotate(angle);

  const targetVertex = transform(new Victor(0, 0), frame, angle);
  targetVertex.add(offset);

  const external = frameDisplacement(
    new Victor(0, 0), //  raw vertex
    imageFrame.width,
    imageFrame.height,
    angle,
    targetVertex // target vertex
  );

  const stateRef = useRef({
    previousPoint: null
  });

  // TODO: should unify the code with useDragAndDrop in canvas
  const [handleMouseDown, handleMouseMove, handleMouseUp] = useDragAndDrop({
    onMouseDown({ original }) {
      // TOOD: may be can removed later, after stop canvas event handler
      // copy from canvas useDragAndDrop
      original.stopPropagation();

      stateRef.current.previousPoint = { x: original.pageX, y: original.pageY };
    },
    onDragStart() {
      console.log("onDragStart");
    },
    onDrag({ original }) {
      // copy from canvas useDragAndDrop
      const { previousPoint } = stateRef.current;

      const { pageX, pageY } = original;
      const dx = pageX - previousPoint.x;
      const dy = pageY - previousPoint.y;
      previousPoint.x = pageX;
      previousPoint.y = pageY;
      console.log("onDrag");

      setImageFrame({
        ...imageFrame,
        x: imageFrame.x + dx,
        y: imageFrame.y + dy
      });
    },
    onDragEnd() {
      console.log("onDragEnd");
    }
  });

  // console.log(external);

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className="image-croppoer__masked"
        onClick={() => {
          console.log("-----------");
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
          transform: `translate(${external.x}px, ${
            external.y
          }px) rotate(${angle}rad)`
        }}
        src={imageUrl}
      />
    </div>
  );
};

export default memo(ImageCropper);
