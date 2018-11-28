import { useRef } from "react";
import { useDragAndDrop } from "./useDragAndDrop";

export const useDeselect = (shouldDeselect, { onDeselect } = {}) => {
  const shouldDeselectRef = useRef(null);

  const [
    deselectMouseDown,
    deselectMouseMove,
    deselectMouseUp
  ] = useDragAndDrop({
    onMouseDown(event) {
      shouldDeselectRef.current = shouldDeselect(event);
    },

    onDrag() {
      shouldDeselectRef.current = false;
    },

    onDragEnd() {
      if (shouldDeselectRef.current) {
        onDeselect();
      }

      shouldDeselectRef.current = null;
    }
  });

  return {
    deselectMouseDown,
    deselectMouseMove,
    deselectMouseUp
  };
};
