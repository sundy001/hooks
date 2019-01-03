import { useRef } from "react";
import Victor from "victor";

export const useSelectionBeginningValue = (
  selectedElements,
  controlBoxFrame
) => {
  const beginningValueRef = useRef(null);

  const saveValue = () => {
    const beginningValue = {};

    if (selectedElements.length > 1) {
      selectedElements.forEach(({ id, frame, angle }) => {
        beginningValue[id] = {
          width: frame.width,
          height: frame.height,
          offset: new Victor(
            frame.x - controlBoxFrame.x,
            frame.y - controlBoxFrame.y
          ),
          angle
        };
      });
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

  const getValue = () => {
    return beginningValueRef.current;
  };

  const clearValue = () => {
    beginningValueRef.current = null;
  };

  return { saveValue, getValue, clearValue };
};
