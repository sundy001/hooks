import { useRef } from "react";
import { useDrag } from "./useDrag";

export const useDragAndDrop = ({
  onMouseDown,
  onDragStart,
  onDrag,
  onDragEnd
}) => {
  const previousPointRef = useRef(null);

  const callCallbackIfExist = (callback, event, delta = {}) => {
    if (!callback) {
      return;
    }

    callback({
      original: event,
      ...delta
    });
  };

  const [dragMouseDown, dragMouseMove, dragMouseUp] = useDrag({
    onMouseDown({ original }) {
      previousPointRef.current = {
        x: original.pageX,
        y: original.pageY
      };

      callCallbackIfExist(onMouseDown, original);
    },
    onMouseUp() {
      previousPointRef.current = null;
    },

    onDragStart({ original }) {
      callCallbackIfExist(onDragStart, original);
    },
    onDrag({ original }) {
      const previousPoint = previousPointRef.current;
      const { pageX, pageY } = original;
      const dx = pageX - previousPoint.x;
      const dy = pageY - previousPoint.y;
      previousPoint.x = pageX;
      previousPoint.y = pageY;

      callCallbackIfExist(onDrag, original, { dx, dy });
    },
    onDragEnd({ original }) {
      callCallbackIfExist(onDragEnd, original);
    }
  });

  return { dragMouseDown, dragMouseMove, dragMouseUp };
};
