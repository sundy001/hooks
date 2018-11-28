import { useState } from "react";
import { useDragAndDrop } from "./useDragAndDrop";
import { angleOfThreePoints } from "../math/angle";

export const useRotate = (
  { x, y, width, height },
  angle,
  { onMouseDown, onRotate, onRotateEnd } = {}
) => {
  const [beginAngle, setBeginAngle] = useState(null);

  const [rotateMouseDown, rotateMouseMove, rotateMouseUp] = useDragAndDrop({
    onMouseDown(event) {
      if (onMouseDown) {
        onMouseDown(event);
      }
    },
    onDrag(event) {
      const {
        beginingX,
        beginingY,
        original: { pageX, pageY }
      } = event;
      if (!onRotate) {
        return;
      }

      if (beginAngle === null) {
        setBeginAngle(angle);
      }

      const newAngle =
        (beginAngle !== null ? beginAngle : angle) -
        angleOfThreePoints(
          beginingX,
          beginingY,
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

      setBeginAngle(null);
    }
  });

  return { rotateMouseDown, rotateMouseMove, rotateMouseUp };
};
