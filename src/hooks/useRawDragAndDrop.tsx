import { useRef } from "react";
import { useDrag } from "./useDrag";

export const useRawDragAndDrop = ({
  zoom = 1,
  shouldDrag,
  onDragStart,
  onDragEnd,
  onDrag
}: {
  zoom?: number;
  shouldDrag?: (event: MouseEvent) => boolean;
  onDragStart?: Callback;
  onDragEnd?: Callback;
  onDrag?: Callback<{ dx: number; dy: number }>;
} = {}) => {
  const previousPointRef = useRef<null | { x: number; y: number }>(null);

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
      const dx = (pageX - previousPoint!.x) / zoom;
      const dy = (pageY - previousPoint!.y) / zoom;
      previousPoint!.x = pageX;
      previousPoint!.y = pageY;

      callCallbackIfExist(onDrag, event.original, { dx, dy });
    },
    onDragEnd(event) {
      callCallbackIfExist(onDragEnd, event.original);
    }
  });

  return { dragMouseDown, dragMouseMove, dragMouseUp };
};

type Callback<extra = {}> = (
  event: {
    original: MouseEvent;
  } & extra
) => void;
