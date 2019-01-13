import { MouseEvent, useRef } from "react";
import { useDrag } from "./useDrag";

export const useRawRotate = (
  { x, y, width, height }: Readonly<Frame>,
  {
    zoom = 1,
    onRotateStart,
    onRotate,
    onRotateEnd,
    getOffset
  }: {
    zoom?: number;
    onRotateStart?: (event: { original: MouseEvent }) => void;
    onRotate?: (event: { original: MouseEvent; angle: number }) => void;
    onRotateEnd?: (event: { original: MouseEvent }) => void;
    getOffset?: (event: { original: MouseEvent }) => { x: number; y: number };
  } = {}
) => {
  const stateRef = useRef<{
    beginningX: null | number;
    beginningY: null | number;
  }>({
    beginningX: null,
    beginningY: null
  });
  const [rotateMouseDown, rotateMouseMove, rotateMouseUp] = useDrag({
    onMouseDown(event) {
      const offset = getOffset ? getOffset(event) : { x: 0, y: 0 };
      const state = stateRef.current;
      state.beginningX = event.original.pageX - offset.x;
      state.beginningY = event.original.pageY - offset.y;
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

      const offset = getOffset ? getOffset(event) : { x: 0, y: 0 };
      const { pageX, pageY } = event.original;
      const newAngle = -angleOfThreePoints(
        stateRef.current.beginningX!,
        stateRef.current.beginningY!,
        (x + width / 2) * zoom,
        (y + height / 2) * zoom,
        pageX - offset.x,
        pageY - offset.y
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
const angleOfThreePoints = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  return Math.atan2(y0 - y1, x0 - x1) - Math.atan2(y2 - y1, x2 - x1);
};

type Frame = Readonly<{
  width: number;
  height: number;
  x: number;
  y: number;
}>;
