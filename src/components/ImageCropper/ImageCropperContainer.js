import React, { memo, useEffect, useCallback, useState } from "react";

import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { useOuterResize } from "./hooks/useOuterResize";
import { useInnerResize } from "./hooks/useInnerResize";
import { ImageCropper } from "./ImageCropper";
import { getInitialOuterBoxPosition } from "./getInitialOuterBoxPosition";

export const ImageCropperContainer = memo(
  ({
    imageUrl,
    imageFrame: initalImageFrame,
    frame: initialFrame,
    angle,
    onMount,
    onUnmount,
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
      onMount();
      return () => {
        onUnmount();
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
        })}
        onInnerResizeMouseDown={innerResizeMouseDown}
        onOuterResizeMouseDown={outerResizeMouseDown}
      />
    );
  }
);
