import { useRef } from "react";
import Victor from "victor";

export const useSelectionBeginningValue = (
  selectedElements: ReadonlyArray<
    Readonly<{
      id: number;
      frame: Readonly<Frame>;
      angle: number;
    }>
  >,
  controlBoxFrame: Readonly<Frame>
) => {
  const beginningValueRef = useRef<ElementsCache | null>(null);

  const saveValue = () => {
    const beginningValue: ElementsCache = {};

    if (selectedElements.length > 1) {
      for (let i = 0; i < selectedElements.length; i++) {
        const { id, frame, angle } = selectedElements[i];
        beginningValue[id] = {
          width: frame.width,
          height: frame.height,
          offset: new Victor(
            frame.x - controlBoxFrame.x,
            frame.y - controlBoxFrame.y
          ),
          angle
        };
      }
    } else {
      const { id, frame } = selectedElements[0];
      beginningValue[id] = {
        width: frame.width,
        height: frame.height,
        angle: 0,
        offset: new Victor(0, 0)
      };
    }

    beginningValueRef.current = beginningValue;
  };

  const getValue = (): Readonly<ElementsCache> => {
    return beginningValueRef.current!;
  };

  const clearValue = () => {
    beginningValueRef.current = null;
  };

  return { saveValue, getValue, clearValue };
};

type Frame = {
  width: number;
  height: number;
  x: number;
  y: number;
};

type ElementsCache = {
  [id: string]: {
    width: number;
    height: number;
    offset: Victor;
    angle: number;
  };
};
