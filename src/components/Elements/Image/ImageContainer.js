import React, { memo, useCallback } from "react";
import { Image } from "./Image";
import { useResize } from "./hooks/useResize";
import { useElementListener } from "../../../eventBus/useEventListener";
import { ImageCropper } from "../../ImageCropper";
import {
  updateControlBox,
  updateElement,
  hideControlBox,
  showControlBox
} from "../../Canvas/CanvasAction";

export const ImageContainer = memo(props => {
  const { id, dispatch, imageFrame, isCropping } = props;
  useElementListener("doubleClick", id, () => {
    dispatch(updateElement(id, { isCropping: true }));
  });
  useResize(id, dispatch, props.frame, imageFrame);

  const onFinish = useCallback((imageFrame, frame) => {
    dispatch(updateControlBox({ frame }));
    dispatch(updateElement(id, { imageFrame, frame, isCropping: false }));
  }, []);

  const onCropperMount = useCallback(() => {
    dispatch(hideControlBox());
  }, []);

  const onCropperUnmount = useCallback(() => {
    dispatch(showControlBox());
  }, []);

  if (isCropping) {
    return (
      <ImageCropper
        {...props}
        onFinish={onFinish}
        onMount={onCropperMount}
        onUnmount={onCropperUnmount}
      />
    );
  } else {
    return <Image {...props} />;
  }
});
