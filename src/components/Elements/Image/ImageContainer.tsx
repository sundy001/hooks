import React, { memo, useCallback, SFC } from "react";
import ReactDOM from "react-dom";
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
  showControlBox,
  hideControlBox,
  updateControlBoxByElement
} from "../../../controlBox";

const InternalImageContainer: SFC<any> = props => {
  const { id, dispatch, imageFrame, isCropping } = props;

  useResize(id, dispatch, props.frame, imageFrame);

  useElementListener("doubleClick", id, () => {
    dispatch(startCroppingImage(id));
    dispatch(hideControlBox());
  });

  const onChange = useCallback(({ frame, imageFrame }) => {
    dispatch(updateCroppingImage(id, frame, imageFrame));
    dispatch(updateControlBoxByElement(id));
  }, []);

  const onFinish = useCallback(() => {
    dispatch(stopCroppingImage(id));
    dispatch(showControlBox());
  }, []);

  return isCropping ? (
    ReactDOM.createPortal(
      <ImageCropper
        {...props}
        onMaskMouseDown={onFinish}
        onChange={onChange}
      />,
      document.querySelector(`.page[data-id="${props.page}"]`)
    )
  ) : (
    <Image {...props} />
  );
};

export const ImageContainer = memo(InternalImageContainer);

ImageContainer.displayName = "ImageContainer";
