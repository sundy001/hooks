import { useRef } from "react";
import { useDragAndDrop } from "./useDragAndDrop";
import { angleOfThreePoints } from "../math/angle";

export const useRotate = (
  { x, y, width, height },
  { onMouseDown, onRotateStart, onRotate, onRotateEnd } = {}
) => {
  const stateRef = useRef({
    beginningX: null,
    beginningY: null
  });
  const [rotateMouseDown, rotateMouseMove, rotateMouseUp] = useDragAndDrop({
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
