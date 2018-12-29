import React, { memo, useCallback } from "react";
import { Image } from "./Image";
import { useResize } from "./hooks/useResize";
import { useElementListener } from "../../../eventBus/useEventListener";
import { ImageCropper } from "../../ImageCropper";
import {
  startCroppingImage,
  stopCroppingImage,
  updateCroppingImage
} from "../../Canvas/CanvasAction";

export const ImageContainer = memo(props => {
  const { id, dispatch, imageFrame, isCropping } = props;
  useElementListener("doubleClick", id, () => {
    dispatch(startCroppingImage(id));
  });
  useElementListener("cropEnd", id, () => {
    dispatch(startCroppingImage(id));
  });
  useResize(id, dispatch, props.frame, imageFrame);

  const onChange = useCallback(({ frame, imageFrame }) => {
    dispatch(updateCroppingImage(id, frame, imageFrame));
  }, []);

  const onFinish = useCallback(() => {
    dispatch(stopCroppingImage(id));
  }, []);

  if (isCropping) {
    return (
      <ImageCropper {...props} onMaskMouseDown={onFinish} onChange={onChange} />
    );
  } else {
    return <Image {...props} />;
  }
});
