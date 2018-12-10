import { useDragAndDrop } from "./useDragAndDrop";
import { angleOfThreePoints } from "../math/angle";

export const useRotate = (
  { x, y, width, height },
  { onMouseDown, onRotateStart, onRotate, onRotateEnd } = {}
) => {
  const [rotateMouseDown, rotateMouseMove, rotateMouseUp] = useDragAndDrop({
    onMouseDown(event) {
      if (onMouseDown) {
        onMouseDown(event);
      }
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
      const {
        beginningX,
        beginningY,
        original: { pageX, pageY }
      } = event;

      const newAngle =
        // beginningAngle -
        -angleOfThreePoints(
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
    onDragEnd(event) {
      if (onRotateEnd) {
        onRotateEnd(event);
      }
    }
  });

  return { rotateMouseDown, rotateMouseMove, rotateMouseUp };
};
