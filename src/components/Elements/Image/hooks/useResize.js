import { useRef } from "react";
import { resolvePosition, TOP, LEFT } from "../../../../math/rect";
import { useElementListener } from "../../../../eventBus/useEventListener";
import { updateElement } from "../../../Canvas/CanvasAction";

export const useResize = (id, dispatch, frame, imageFrame) => {
  const stateRef = useRef({
    beginningFrame: null,
    beginningImageFrame: null,
    hRatio: null,
    vRatio: null
  });

  useElementListener("resizeStart", id, () => {
    const state = stateRef.current;
    state.beginningFrame = frame;
    state.beginningImageFrame = imageFrame;
    state.hRatio = frame.width / imageFrame.width;
    state.vRatio = frame.height / imageFrame.height;
  });

  useElementListener("resize", id, ({ position, frame }) => {
    const {
      beginningFrame,
      beginningImageFrame,
      hRatio,
      vRatio
    } = stateRef.current;
    const { vertical, horizontal } = resolvePosition(position);
    let newFrame;

    if (horizontal !== null && vertical !== null) {
      newFrame = {
        width:
          beginningImageFrame.width +
          (frame.width - beginningFrame.width) / hRatio,
        height:
          beginningImageFrame.height +
          (frame.height - beginningFrame.height) / vRatio,
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

    dispatch(updateElement(id, { imageFrame: newFrame }));
  });

  useElementListener("resizeEnd", id, () => {
    const state = stateRef.current;
    state.beginningFrame = null;
    state.beginningImageFrame = null;
    state.hRatio = null;
    state.rRatio = null;
  });
};
