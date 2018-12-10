import { useMemo, useRef } from "react";

export const useDragAndDrop = ({
  onMouseDown,
  onMouseUp,
  shouldDrag,
  onDragStart,
  onDrag,
  onDragEnd
} = {}) => {
  const callbackRef = useRef();
  callbackRef.current = {
    onMouseDown,
    onMouseUp,
    shouldDrag,
    onDragStart,
    onDrag,
    onDragEnd
  };

  const stateRef = useRef({
    target: null,
    isMouseDown: false,
    isMouseMove: false,
    shouldDragChecked: null
  });

  const callCallbackIfExist = (callback, event) => {
    if (!callback) {
      return;
    }

    callback({
      target: stateRef.current.target,
      original: event
    });
  };

  const dragEndCleanUp = () => {
    const state = stateRef.current;
    state.target = null;
    state.isMouseDown = false;
    state.isMouseMove = false;
    state.shouldDragChecked = null;
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
      callCallbackIfExist(callbackRef.current.onMouseUp, event);
      if (stateRef.current.isMouseMove) {
        callCallbackIfExist(callbackRef.current.onDragEnd, event);
      }

      dragEndCleanUp();
    },
    []
  );

  const handleMouseMove = useMemo(
    () => event => {
      const state = stateRef.current;
      const { shouldDragChecked, isMouseDown } = state;
      const { shouldDrag, onDrag } = callbackRef.current;

      if (!isMouseDown) return;
      if (!state.isMouseMove) {
        callCallbackIfExist(callbackRef.current.onDragStart, event);
      }

      state.isMouseMove = true;

      if (shouldDrag && !shouldDragChecked) {
        state.shouldDragChecked = true;
        if (!shouldDrag(event)) {
          dragEndCleanUp();
          return;
        }
      }

      callCallbackIfExist(onDrag, event);
    },
    []
  );

  return [handleMouseDown, handleMouseMove, handleMouseUp];
};
