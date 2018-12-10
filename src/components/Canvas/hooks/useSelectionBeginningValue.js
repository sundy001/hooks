import { useRef } from "react";
import Victor from "victor";

export const useSelectionBeginningValue = (
  elementStore,
  selections,
  controlBoxFrame
) => {
  const beginningValueRef = useRef(null);

  const saveValue = () => {
    const beginningValue = {};

    if (selections.length > 1) {
      selections.forEach(id => {
        const { frame, angle } = elementStore.byId[id];

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
      const id = selections[0];
      const { frame } = elementStore.byId[id];
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
