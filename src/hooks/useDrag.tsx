import { MouseEvent, useCallback, useRef } from "react";

export const useDrag = ({
  onMouseDown,
  onMouseUp,
  shouldDrag,
  onDragStart,
  onDrag,
  onDragEnd
}: {
  onMouseDown?: Callback;
  onMouseUp?: Callback;
  shouldDrag?: (event: MouseEvent) => boolean;
  onDragStart?: Callback;
  onDrag?: Callback;
  onDragEnd?: Callback;
} = {}) => {
  const callbacks = {
    onMouseDown,
    onMouseUp,
    shouldDrag,
    onDragStart,
    onDrag,
    onDragEnd
  };
  const callbackRef = useRef(callbacks);
  callbackRef.current = callbacks;

  const stateRef = useRef<{
    target: HTMLElement | null;
    isMouseDown: boolean;
    isMouseMove: boolean;
    shouldDragChecked: boolean | null;
  }>({
    target: null,
    isMouseDown: false,
    isMouseMove: false,
    shouldDragChecked: null
  });

  const callCallbackIfExist = (
    callback: Callback | undefined,
    event: MouseEvent
  ) => {
    if (!callback) {
      return;
    }

    callback({
      target: stateRef.current.target!,
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

  // useCallback to ensure handleMouseDown always return the same callback
  const handleMouseDown = useCallback((event: MouseEvent) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();

    const state = stateRef.current;
    state.isMouseDown = true;
    state.target = event.target as HTMLElement;

    callCallbackIfExist(callbackRef.current.onMouseDown, event);
  }, []);

  const handleMouseUp = useCallback((event: MouseEvent) => {
    callCallbackIfExist(callbackRef.current.onMouseUp, event);
    if (stateRef.current.isMouseMove) {
      callCallbackIfExist(callbackRef.current.onDragEnd, event);
    }

    dragEndCleanUp();
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    const state = stateRef.current;
    const { shouldDragChecked, isMouseDown } = state;
    const { shouldDrag, onDrag } = callbackRef.current;

    if (!isMouseDown) return;

    if (shouldDrag && !shouldDragChecked) {
      state.shouldDragChecked = true;
      if (!shouldDrag(event)) {
        dragEndCleanUp();
        return;
      }
    }

    if (!state.isMouseMove) {
      callCallbackIfExist(callbackRef.current.onDragStart, event);
    }

    state.isMouseMove = true;

    callCallbackIfExist(onDrag, event);
  }, []);

  return [handleMouseDown, handleMouseMove, handleMouseUp];
};

type Callback = (event: { target: HTMLElement; original: MouseEvent }) => void;
