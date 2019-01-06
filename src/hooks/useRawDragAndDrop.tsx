import { useRef } from "react";
import { useDrag } from "./useDrag";

export const useRawDragAndDrop: (
  options?: {
    zoom?: number;
    shouldDrag?: any;
    onDragStart?: any;
    onDragEnd?: any;
    onDrag?: any;
  }
) => any = ({ zoom = 1, shouldDrag, onDragStart, onDragEnd, onDrag }) => {
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
      const dx = (pageX - previousPoint.x) / zoom;
      const dy = (pageY - previousPoint.y) / zoom;
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
