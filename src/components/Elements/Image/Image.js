import React, { memo, useRef } from "react";
import { useState } from "react";
import { resolvePosition, TOP, LEFT } from "../../../math/rect";
import { useElementListener } from "../hooks/useEventListener";
import { DisplayImage } from "./DisplayImage";
import ImageCropper from "../../ImageCropper";

const Image = props => {
  const { id } = props;
  const stateRef = useRef({
    beginningFrame: null,
    beginningImageFrame: null
  });
  const [imageFrame, setImageFrame] = useState({
    width: 640,
    height: 640,
    x: 0,
    y: 0
  });
  const [isCropping, setIsCropping] = useState(false);

  useElementListener("resizeStart", id, () => {
    const state = stateRef.current;
    state.beginningFrame = props.frame;
    state.beginningImageFrame = imageFrame;
  });

  useElementListener("resize", id, ({ position, frame }) => {
    const { beginningFrame, beginningImageFrame } = stateRef.current;
    const { vertical, horizontal } = resolvePosition(position);
    let newFrame;

    // TODO: move to resize start
    const widthRatio = beginningFrame.width / beginningImageFrame.width;
    const heightRatio = beginningFrame.height / beginningImageFrame.height;

    if (horizontal !== null && vertical !== null) {
      newFrame = {
        width:
          beginningImageFrame.width +
          (frame.width - beginningFrame.width) / widthRatio,
        height:
          beginningImageFrame.height +
          (frame.height - beginningFrame.height) / heightRatio,
        x: beginningImageFrame.x * (frame.width / beginningFrame.width),
        y: beginningImageFrame.y * (frame.height / beginningFrame.height)
      };
    } else {
      newFrame = { ...imageFrame };
      if (horizontal === LEFT) {
        newFrame.x = beginningImageFrame.x + frame.width - beginningFrame.width;
      }
      if (vertical === TOP) {
        newFrame.y =
          beginningImageFrame.y + frame.height - beginningFrame.height;
      }
    }

    setImageFrame(newFrame);
  });

  useElementListener("resizeEnd", id, () => {
    stateRef.current.beginningFrame = null;
  });

  useElementListener("doubleClick", id, () => {
    setIsCropping(true);
  });

  if (isCropping) {
    // if (isCropping) {
    return (
      <ImageCropper
        onFinish={newImageFrame => {
          setImageFrame(newImageFrame);
        }}
        imageFrame={imageFrame}
        setIsCropping={setIsCropping}
        {...props}
      />
    );
  } else {
    return <DisplayImage imageFrame={imageFrame} {...props} />;
  }
};

export default memo(Image);
