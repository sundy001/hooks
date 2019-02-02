import { useRef } from "react";
import { resolvePosition, TOP, LEFT } from "../../../../math/rect";
import { useElementListener } from "../../../../eventBus";
import { updateElement } from "../../../App";
import { Frame } from "../type";

export const useResize = (
  id: number,
  dispatch: (action: ReturnType<typeof updateElement>) => void,
  frame: Frame,
  imageFrame: Frame
) => {
  const stateRef = useRef<{
    beginningFrame: Frame | null;
    beginningImageFrame: Frame | null;
    wRatio: number | null;
    hRatio: number | null;
  }>({
    beginningFrame: null,
    beginningImageFrame: null,
    wRatio: null,
    hRatio: null
  });

  useElementListener("resizeStart", id, () => {
    const state = stateRef.current;
    state.beginningFrame = frame;
    state.beginningImageFrame = imageFrame;
    state.wRatio = frame.width / imageFrame.width;
    state.hRatio = frame.height / imageFrame.height;
  });

  useElementListener("resize", id, ({ position, frame }) => {
    const {
      beginningFrame,
      beginningImageFrame,
      wRatio,
      hRatio
    } = stateRef.current;
    const { vertical, horizontal } = resolvePosition(position);
    let newFrame;

    if (horizontal !== null && vertical !== null) {
      newFrame = {
        width:
          beginningImageFrame!.width +
          (frame.width - beginningFrame!.width) / wRatio!,
        height:
          beginningImageFrame!.height +
          (frame.height - beginningFrame!.height) / hRatio!,
        x: beginningImageFrame!.x * (frame.width / beginningFrame!.width),
        y: beginningImageFrame!.y * (frame.height / beginningFrame!.height)
      };
    } else {
      newFrame = { ...imageFrame };
      if (horizontal === LEFT) {
        newFrame.x =
          beginningImageFrame!.x + frame.width - beginningFrame!.width;
      }
      if (vertical === TOP) {
        newFrame.y =
          beginningImageFrame!.y + frame.height - beginningFrame!.height;
      }
    }

    dispatch(updateElement(id, { imageFrame: newFrame }));
  });

  useElementListener("resizeEnd", id, () => {
    const state = stateRef.current;
    state.beginningFrame = null;
    state.beginningImageFrame = null;
    state.wRatio = null;
    state.hRatio = null;
  });
};
