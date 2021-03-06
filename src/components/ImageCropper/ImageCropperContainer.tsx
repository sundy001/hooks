import React, { FC, memo, useCallback, useRef, useState } from "react";

import { Frame } from "./type";

import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { useOuterResize } from "./hooks/useOuterResize";
import { useInnerResize } from "./hooks/useInnerResize";
import { ImageCropper } from "./ImageCropper";
import { getInitialOuterBoxPosition } from "./getInitialOuterBoxPosition";
import { getScrollPosition } from "../../getScrollPosition";
import { multiple } from "../../math/frame";

const InternalImageCropperContainer: FC<{
  imageUrl: string;
  frame: Frame;
  imageFrame: Frame;
  angle: number;
  onMaskMouseDown: () => void;
  onChange: (event: { frame: Frame; imageFrame: Frame }) => void;
  zoom: number;
}> = ({
  imageUrl,
  frame: initialFrame,
  imageFrame: initalImageFrame,
  angle,
  onMaskMouseDown,
  onChange,
  zoom = 1
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
    angle,
    zoom
  );

  const imageCropperRef = useRef<HTMLElement>(null);
  const getOffset = () => {
    const offsetParent = imageCropperRef.current!.offsetParent as HTMLElement;
    const rect = offsetParent.getBoundingClientRect();
    const scrollPosition = getScrollPosition();

    return {
      x: rect.left + scrollPosition.left,
      y: rect.top + scrollPosition.top
    };
  };

  const {
    outerResizeMouseDown,
    outerResizeMouseMove,
    outerResizeMouseUp
  } = useOuterResize(
    setOuterPosition,
    setImageFrame,
    callOnChangeIfExist,
    getOffset,
    outerBoxFrame,
    frame,
    angle,
    zoom
  );

  const {
    innerResizeMouseDown,
    innerResizeMouseMove,
    innerResizeMouseUp
  } = useInnerResize(
    setFrame,
    setImageFrame,
    callOnChangeIfExist,
    getOffset,
    frame,
    imageFrame,
    outerBoxPosition,
    angle,
    zoom
  );

  return (
    <ImageCropper
      ref={imageCropperRef}
      imageUrl={imageUrl}
      frame={multiple(frame, zoom)}
      imageFrame={multiple(imageFrame, zoom)}
      outerBoxFrame={multiple(outerBoxFrame, zoom)}
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
};

export const ImageCropperContainer = memo(InternalImageCropperContainer);

ImageCropperContainer.displayName = "ImageCropperContainer";
