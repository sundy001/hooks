import { useRef } from "react";
import Victor from "victor";

export const useSelectionBeginningValue = (
  elementStore,
  selections,
  controlBoxFrame
) => {
  const beginningValueRef = useRef(null);

  const saveBeginningValue = () => {
    const beginningValue = {};

    if (selections.length > 1) {
      selections.forEach(({ id }) => {
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
      const id = selections[0].id;
      const { frame } = elementStore.byId[id];
      beginningValue[id] = {
        width: frame.width,
        height: frame.height,
        angle: 0,
        offset: new Victor(0, 0)
      };
    }

    return beginningValue;
  };

  const getValue = () => {
    if (beginningValueRef.current === null) {
      beginningValueRef.current = saveBeginningValue();
    }

    return beginningValueRef.current;
  };

  const updateOffset = () => {
    if (
      beginningValueRef.current === null ||
      Object.keys(beginningValueRef.current).length === 1
    ) {
      return;
    }
    selections.forEach(({ id }) => {
      const { frame } = elementStore.byId[id];
      const beginningValue = beginningValueRef.current;
      beginningValue[id].offset.x = frame.x - controlBoxFrame.x;
      beginningValue[id].offset.y = frame.y - controlBoxFrame.y;
    });
  };

  const clearValue = () => {
    beginningValueRef.current = null;
  };

  return { getValue, clearValue, updateOffset };
};
