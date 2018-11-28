import { useMemo, useRef } from "react";

export const useDragAndDrop = ({
  shouldDrag,
  onMouseDown,
  onDrag,
  onDragEnd
} = {}) => {
  const callbackRef = useRef();
  callbackRef.current = {
    onMouseDown,
    shouldDrag,
    onDrag,
    onDragEnd
  };

  const stateRef = useRef({
    target: null,
    isMouseDown: false,
    shouldDragChecked: null,
    previousPoint: null,
    beginingX: null,
    beginingY: null
  });

  const callCallbackIfExist = (callback, event) => {
    if (!callback) {
      return;
    }

    let { previousPoint } = stateRef.current;
    const { target, beginingX, beginingY } = stateRef.current;
    const { pageX: x, pageY: y } = event;

    if (previousPoint === null) {
      previousPoint = stateRef.current.previousPoint = { x, y };
    }
    const dx = x - previousPoint.x;
    const dy = y - previousPoint.y;

    callback({
      beginingX,
      beginingY,
      dx,
      dy,
      target,
      original: event
    });

    previousPoint.x = x;
    previousPoint.y = y;
  };

  const dragEndCleanUp = () => {
    const state = stateRef.current;
    state.target = null;
    state.isMouseDown = false;
    state.shouldDragChecked = null;
    state.previousPoint = null;
    state.beginingX = null;
    state.beginingY = null;
  };

  // useMemo to ensure handleMouseDown always return the same callback
  const handleMouseDown = useMemo(
    () => event => {
      if (event.button !== 0) {
        return;
      }
      
      const state = stateRef.current;
      state.isMouseDown = true;
      state.target = event.target;

      callCallbackIfExist(callbackRef.current.onMouseDown, event);
    },
    []
  );

  const handleMouseUp = useMemo(
    () => event => {
      if (!stateRef.current.isMouseDown) return;

      callCallbackIfExist(callbackRef.current.onDragEnd, event);

      dragEndCleanUp();
    },
    []
  );

  const handleMouseMove = useMemo(
    () => event => {
      const state = stateRef.current;
      const { shouldDragChecked, isMouseDown, beginingX, beginingY } = state;
      const { shouldDrag, onDrag } = callbackRef.current;

      if (!isMouseDown) return;

      if (shouldDrag && !shouldDragChecked) {
        state.shouldDragChecked = true;
        if (!shouldDrag(event)) {
          dragEndCleanUp();
          return;
        }
      }

      if (beginingX === null) {
        state.beginingX = event.pageX;
      }
      if (beginingY === null) {
        state.beginingY = event.pageY;
      }

      callCallbackIfExist(onDrag, event);
    },
    []
  );

  return [handleMouseDown, handleMouseMove, handleMouseUp];
};
