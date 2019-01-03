import { useRef } from "react";
import { useDrag } from "./useDrag";

export const useRawRotate = (
  { x, y, width, height },
  { onMouseDown, onRotateStart, onRotate, onRotateEnd } = {}
) => {
  const stateRef = useRef({
    beginningX: null,
    beginningY: null
  });
  const [rotateMouseDown, rotateMouseMove, rotateMouseUp] = useDrag({
    onMouseDown(event) {
      if (onMouseDown) {
        onMouseDown(event);
      }

      const state = stateRef.current;
      state.beginningX = event.original.pageX;
      state.beginningY = event.original.pageY;
    },
    onDragStart(event) {
      if (onRotateStart) {
        onRotateStart(event);
      }
    },
    onDrag(event) {
      if (!onRotate) {
        return;
      }
      const { pageX, pageY } = event.original;
      const { beginningX, beginningY } = stateRef.current;

      const newAngle = -angleOfThreePoints(
        beginningX,
        beginningY,
        x + width / 2,
        y + height / 2,
        pageX,
        pageY
      );

      onRotate({
        ...event,
        angle: newAngle
      });
    },
    onMouseUp(event) {
      const state = stateRef.current;
      state.beginningX = event.original.pageX;
      state.beginningY = event.original.pageY;
    },
    onDragEnd(event) {
      if (onRotateEnd) {
        onRotateEnd(event);
      }
    }
  });

  return { rotateMouseDown, rotateMouseMove, rotateMouseUp };
};

// (x1, y1) is the middle point
// (x0, y0), (x2, y2) are the ends of the line
const angleOfThreePoints = (x0, y0, x1, y1, x2, y2) => {
  return Math.atan2(y0 - y1, x0 - x1) - Math.atan2(y2 - y1, x2 - x1);
};
