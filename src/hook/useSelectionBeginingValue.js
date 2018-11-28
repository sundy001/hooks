import { useRef } from "react";
import Victor from "victor";

export const useSelectionBeginingValue = (
  elementStore,
  selections,
  controlBoxFrame
) => {
  const beginingValueRef = useRef(null);

  const saveBeginingValue = () => {
    const beginingValue = {};

    if (selections.length > 1) {
      selections.forEach(({ id }) => {
        const { frame, angle } = elementStore.byId[id];

        beginingValue[id] = {
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
      beginingValue[id] = {
        width: frame.width,
        height: frame.height,
        angle: 0,
        offset: new Victor(0, 0)
      };
    }

    return beginingValue;
  };

  const getBeginingValue = () => {
    if (beginingValueRef.current === null) {
      beginingValueRef.current = saveBeginingValue();
    }

    return beginingValueRef.current;
  };

  const clearBeginingValue = () => {
    beginingValueRef.current = null;
  };

  return { getBeginingValue, clearBeginingValue };
};
