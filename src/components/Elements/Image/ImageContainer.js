import React, { memo, useCallback } from "react";
import { Image } from "./Image";
import { useResize } from "./hooks/useResize";
import { useElementListener } from "../../../eventBus";
import { ImageCropper } from "../../ImageCropper";
import {
  startCroppingImage,
  stopCroppingImage,
  updateCroppingImage
} from "./actions";
import {
  updateControlBox,
  showControlBox,
  hideControlBox
} from "../../../controlBox";

export const ImageContainer = memo(props => {
  const { id, dispatch, imageFrame, isCropping } = props;

  useResize(id, dispatch, props.frame, imageFrame);

  useElementListener("doubleClick", id, () => {
    dispatch(startCroppingImage(id));
    dispatch(hideControlBox());
  });

  const onChange = useCallback(({ frame, imageFrame }) => {
    dispatch(updateCroppingImage(id, frame, imageFrame));
    dispatch(updateControlBox({ frame }));
  }, []);

  const onFinish = useCallback(() => {
    dispatch(stopCroppingImage(id));
    dispatch(showControlBox());
  }, []);

  return isCropping ? (
    <ImageCropper {...props} onMaskMouseDown={onFinish} onChange={onChange} />
  ) : (
    <Image {...props} />
  );
});

ImageContainer.displayName = "ImageContainer";
