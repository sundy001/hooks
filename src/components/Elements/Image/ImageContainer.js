import React, { memo, useState, useCallback } from "react";
import { Image } from "./Image";
import { useResize } from "./hooks/useResize";
import { useElementListener } from "../hooks/useEventListener";
import { ImageCropper } from "../../ImageCropper";
import {
  updateControlBox,
  updateElement,
  hideControlBox,
  showControlBox
} from "../../Canvas/CanvasAction";

export const ImageContainer = memo(props => {
  const { id, dispatch, imageFrame: initialImageFrame } = props;
  const [imageFrame, setImageFrame] = useState(initialImageFrame);
  const [isCropping, setIsCropping] = useState(false);
  useElementListener("doubleClick", id, () => {
    setIsCropping(true);
  });
  useResize(id, setImageFrame, props.frame, imageFrame);

  const onFinish = useCallback((newImageFrame, newFrame) => {
    setImageFrame(newImageFrame);
    dispatch(updateControlBox({ frame: newFrame }));
    dispatch(updateElement(id, { frame: newFrame }));
    setIsCropping(false);
  });

  const onCropperMount = useCallback(() => {
    dispatch(hideControlBox());
  });

  const onCropperUnmount = useCallback(() => {
    dispatch(showControlBox());
  });

  if (isCropping) {
    return (
      <ImageCropper
        {...props}
        onFinish={onFinish}
        onMount={onCropperMount}
        onUnmount={onCropperUnmount}
        imageFrame={imageFrame}
      />
    );
  } else {
    return <Image {...props} imageFrame={imageFrame} />;
  }
});
