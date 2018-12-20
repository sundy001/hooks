import { useRef } from "react";
import { resolvePosition, TOP, LEFT } from "../../../../math/rect";
import { useElementListener } from "../../hooks/useEventListener";

export const useResize = (id, setImageFrame, frame, imageFrame) => {
  const stateRef = useRef({
    beginningFrame: null,
    beginningImageFrame: null,
    ratio: null
  });

  useElementListener("resizeStart", id, () => {
    const state = stateRef.current;
    state.beginningFrame = frame;
    state.beginningImageFrame = imageFrame;
    state.ratio = frame.width / imageFrame.width;
  });

  useElementListener("resize", id, ({ position, frame }) => {
    const { beginningFrame, beginningImageFrame, ratio } = stateRef.current;
    const { vertical, horizontal } = resolvePosition(position);
    let newFrame;

    if (horizontal !== null && vertical !== null) {
      newFrame = {
        width:
          beginningImageFrame.width +
          (frame.width - beginningFrame.width) / ratio,
        height:
          beginningImageFrame.height +
          (frame.height - beginningFrame.height) / ratio,
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
    const state = stateRef.current;
    state.beginningFrame = null;
    state.beginningImageFrame = null;
    state.ratio = null;
  });
};
