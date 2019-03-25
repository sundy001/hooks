import React, { memo, useCallback, FC } from "react";
import ReactDOM from "react-dom";
import { Image } from "./Image";
import { useResize } from "./hooks/useResize";

import {
  startCroppingImage,
  stopCroppingImage,
  updateCroppingImage,
  Action
} from "./actions";
import { ImageEntity } from "./type";
import { ImageCropper } from "../../ImageCropper";
import {
  showControlBox,
  hideControlBox,
  updateControlBoxByElement
} from "../../../controlBox";
import { useElementListener } from "../../../eventBus";
import { updateElements } from "../../App";

const InternalImageContainer: FC<
  ImageEntity & {
    dispatch: (action: ImageContainerAction) => void;
    zoom: number;
  }
> = props => {
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
      document.querySelector(`.page[data-id="${props.page}"]`) as HTMLElement
    )
  ) : (
    <Image {...props} />
  );
};

export const ImageContainer = memo(InternalImageContainer);

ImageContainer.displayName = "ImageContainer";

type ImageContainerAction =
  | Action
  | ReturnType<typeof hideControlBox>
  | ReturnType<typeof updateControlBoxByElement>
  | ReturnType<typeof showControlBox>
  | ReturnType<typeof updateElements>;
