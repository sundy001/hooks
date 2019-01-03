import React, { memo, useCallback, useState } from "react";

import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { useOuterResize } from "./hooks/useOuterResize";
import { useInnerResize } from "./hooks/useInnerResize";
import { ImageCropper } from "./ImageCropper";
import { getInitialOuterBoxPosition } from "./getInitialOuterBoxPosition";

export const ImageCropperContainer = memo(
  ({
    imageUrl,
    frame: initialFrame,
    imageFrame: initalImageFrame,
    angle,
    onMaskMouseDown,
    onChange
  }) => {
    const [frame, setFrame] = useState(initialFrame);
    const [imageFrame, setImageFrame] = useState(initalImageFrame);
    const [outerBoxPosition, setOuterPosition] = useState(
      getInitialOuterBoxPosition(frame, imageFrame, angle)
    );
    const callOnChangeIfExist = () => {
      if (onChange) {
        onChange({
          frame,
          imageFrame
        });
      }
    };

    const outerBoxFrame = {
      ...imageFrame,
      x: outerBoxPosition.x,
      y: outerBoxPosition.y
    };

    const { dragMouseDown, dragMouseMove, dragMouseUp } = useDragAndDrop(
      setImageFrame,
      setOuterPosition,
      callOnChangeIfExist,
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
      callOnChangeIfExist,
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
      callOnChangeIfExist,
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
        }, [])}
        onMouseUp={useCallback(event => {
          dragMouseUp(event);
          outerResizeMouseUp(event);
          innerResizeMouseUp(event);
        }, [])}
        onMaskMouseDown={useCallback(event => {
          event.stopPropagation();
          onMaskMouseDown();
        }, [])}
        onInnerResizeMouseDown={innerResizeMouseDown}
        onOuterResizeMouseDown={outerResizeMouseDown}
      />
    );
  }
);

ImageCropperContainer.displayName = "ImageCropperContainer";
