import React, { memo, useState } from "react";
import { Image } from "./Image";
import { useResize } from "./hooks/useResize";
import { useElementListener } from "../hooks/useEventListener";
import ImageCropper from "../../ImageCropper";
import { updateControlBox, updateElement } from "../../Canvas/CanvasAction";

const ImageContainer = props => {
  const { id, dispatch, imageFrame: initialImageFrame } = props;
  const [imageFrame, setImageFrame] = useState(initialImageFrame);
  const [isCropping, setIsCropping] = useState(false);
  useElementListener("doubleClick", id, () => {
    setIsCropping(true);
  });
  useResize(id, setImageFrame, props.frame, imageFrame);

  if (isCropping) {
    return (
      <ImageCropper
        onFinish={(newImageFrame, newFrame) => {
          setImageFrame(newImageFrame);
          dispatch(updateControlBox({ frame: newFrame }));
          dispatch(updateElement(id, { frame: newFrame }));
        }}
        setIsCropping={setIsCropping}
        {...props}
        imageFrame={imageFrame}
      />
    );
  } else {
    return <Image {...props} imageFrame={imageFrame} />;
  }
};

export default memo(ImageContainer);
