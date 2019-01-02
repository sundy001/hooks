import { useRef } from "react";
import { useDrag } from "./useDrag";

export const useRawDragAndDrop = ({
  onMouseDown,
  shouldDrag,
  onDragStart,
  onDragEnd,
  onDrag
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
    shouldDrag,

    onMouseDown(event) {
      previousPointRef.current = {
        x: event.original.pageX,
        y: event.original.pageY
      };

      callCallbackIfExist(onMouseDown, event.original);
    },
    onMouseUp() {
      previousPointRef.current = null;
    },

    onDragStart(event) {
      callCallbackIfExist(onDragStart, event.original);
    },
    onDrag(event) {
      const previousPoint = previousPointRef.current;
      const pageX = event.original.pageX;
      const pageY = event.original.pageY;
      const dx = pageX - previousPoint.x;
      const dy = pageY - previousPoint.y;
      previousPoint.x = pageX;
      previousPoint.y = pageY;

      callCallbackIfExist(onDrag, event.original, { dx, dy });
    },
    onDragEnd(event) {
      callCallbackIfExist(onDragEnd, event.original);
    }
  });

  return { dragMouseDown, dragMouseMove, dragMouseUp };
};
