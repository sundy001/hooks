import React, { memo, useEffect, useCallback, useState } from "react";
import { hideControlBox, showControlBox } from "../Canvas/CanvasAction";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { useOuterResize } from "./hooks/useOuterResize";
import { useInnerResize } from "./hooks/useInnerResize";
import { ImageCropper } from "./ImageCropper";
import { getInitialOuterBoxPosition } from "./getInitialOuterBoxPosition";

export const ImageCropperContainer = memo(
  ({
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
    const [outerBoxPosition, setOuterPosition] = useState(
      getInitialOuterBoxPosition(frame, imageFrame, angle)
    );

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

    const { dragMouseDown, dragMouseMove, dragMouseUp } = useDragAndDrop(
      setImageFrame,
      setOuterPosition,
      imageFrame,
      outerBoxPosition,
      angle
    );

    const {
      outerResizeMouseDown,
      outerResizeMouseMove,
      outerResizeMouseUp
    } = useOuterResize(
      setOuterPosition,
      setImageFrame,
      outerBoxFrame,
      frame,
      angle
    );

    const {
      innerResizeMouseDown,
      innerResizeMouseMove,
      innerResizeMouseUp
    } = useInnerResize(
      setFrame,
      setImageFrame,
      frame,
      imageFrame,
      outerBoxPosition,
      angle
    );

    return (
      <ImageCropper
        imageUrl={imageUrl}
        frame={frame}
        imageFrame={imageFrame}
        outerBoxFrame={outerBoxFrame}
        angle={angle}
        onMouseDown={dragMouseDown}
        onMouseMove={useCallback(event => {
          dragMouseMove(event);
          outerResizeMouseMove(event);
          innerResizeMouseMove(event);
        })}
        onMouseUp={useCallback(event => {
          dragMouseUp(event);
          outerResizeMouseUp(event);
          innerResizeMouseUp(event);
        })}
        onMaskMouseDown={useCallback(event => {
          event.stopPropagation();
          onFinish(imageFrame, frame);
          setIsCropping(false);
        })}
        onInnerResizeMouseDown={innerResizeMouseDown}
        onOuterResizeMouseDown={outerResizeMouseDown}
      />
    );
  }
);
