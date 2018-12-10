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
    beginningX: null,
    beginningY: null
  });

  const callCallbackIfExist = (callback, event) => {
    if (!callback) {
      return;
    }

    let { previousPoint } = stateRef.current;
    const { target, beginningX, beginningY } = stateRef.current;
    const { pageX: x, pageY: y } = event;

    if (previousPoint === null) {
      previousPoint = stateRef.current.previousPoint = { x, y };
    }
    const dx = x - previousPoint.x;
    const dy = y - previousPoint.y;

    callback({
      beginningX,
      beginningY,
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
    state.beginningX = null;
    state.beginningY = null;
  };

  // useMemo to ensure handleMouseDown always return the same callback
  const handleMouseDown = useMemo(
    () => event => {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();

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
      const { shouldDragChecked, isMouseDown, beginningX, beginningY } = state;
      const { shouldDrag, onDrag } = callbackRef.current;

      if (!isMouseDown) return;

      if (shouldDrag && !shouldDragChecked) {
        state.shouldDragChecked = true;
        if (!shouldDrag(event)) {
          dragEndCleanUp();
          return;
        }
      }

      if (beginningX === null) {
        state.beginningX = event.pageX;
      }
      if (beginningY === null) {
        state.beginningY = event.pageY;
      }

      callCallbackIfExist(onDrag, event);
    },
    []
  );

  return [handleMouseDown, handleMouseMove, handleMouseUp];
};
