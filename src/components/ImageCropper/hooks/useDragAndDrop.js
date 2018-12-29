import Victor from "victor";
import { useRef } from "react";
import { useDragAndDrop as useDrag } from "../../../hooks/useDragAndDrop";

export const useDragAndDrop = (
  setImageFrame,
  setOuterPosition,
  dragMouseEnd,
  imageFrame,
  outerBoxPosition,
  angle
) => {
  const stateRef = useRef({
    previousPoint: null
  });

  const [dragMouseDown, dragMouseMove, dragMouseUp] = useDrag({
    onMouseDown({ original }) {
      // TODO: may be can removed later, after stop canvas event handler
      // copy from canvas useDragAndDrop
      original.stopPropagation();

      stateRef.current.previousPoint = { x: original.pageX, y: original.pageY };
    },
    onMouseUp() {
      stateRef.current.previousPoint = null;
    },
    onDrag({ original }) {
      // copy from canvas useDragAndDrop
      const { previousPoint } = stateRef.current;
      const { pageX, pageY } = original;

      const dx = pageX - previousPoint.x;
      const dy = pageY - previousPoint.y;
      const v = new Victor(dx, dy);
      v.rotate(-angle);

      setImageFrame({
        ...imageFrame,
        x: imageFrame.x + v.x,
        y: imageFrame.y + v.y
      });

      setOuterPosition({
        x: outerBoxPosition.x + dx,
        y: outerBoxPosition.y + dy
      });

      previousPoint.x = pageX;
      previousPoint.y = pageY;
    },
    onDragEnd() {
      dragMouseEnd();
    }
  });

  return { dragMouseDown, dragMouseMove, dragMouseUp };
};
