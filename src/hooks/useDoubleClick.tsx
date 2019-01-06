import { useRef } from "react";
import { useDrag } from "./useDrag";

const DOUBLE_CLICK_INTERVAL = 500;

export const useDoubleClick = onDoubleClick => {
  const stateRef = useRef({
    clickPosition: null,
    consecutiveClickCount: 0,
    doubleClickTimer: null,
    mouseDowned: true,
    dragged: null
  });

  const clearDoubleClickData = () => {
    const state = stateRef.current;
    state.clickPosition = null;
    state.consecutiveClickCount = 0;
    state.doubleClickTimer = null;
  };

  const restartDoubleClickTimer = () => {
    const state = stateRef.current;

    if (state.doubleClickTimer !== null) {
      clearTimeout(state.doubleClickTimer);
    }

    state.doubleClickTimer = setTimeout(() => {
      clearDoubleClickData();
    }, DOUBLE_CLICK_INTERVAL);
  };

  const [
    doubleClickMouseDown,
    doubleClickMouseMove,
    doubleClickMouseUp
  ] = useDrag({
    onMouseDown() {
      stateRef.current.dragged = false;
      stateRef.current.mouseDowned = true;
    },
    onDragStart() {
      stateRef.current.dragged = true;
    },
    onMouseUp({ original }) {
      const { target, pageX, pageY } = original;
      const state = stateRef.current;
      const { clickPosition, mouseDowned, dragged } = state;

      const element = (target as HTMLElement).closest(
        ".element"
      ) as HTMLElement;
      const isClickPositionDifferent =
        clickPosition !== null &&
        (clickPosition.x !== pageX || clickPosition.y !== pageY);
      if (isClickPositionDifferent || !mouseDowned || dragged) {
        clearDoubleClickData();
      }

      if (!dragged && mouseDowned && element !== null) {
        state.consecutiveClickCount++;

        if (state.consecutiveClickCount === 1) {
          state.clickPosition = { x: pageX, y: pageY };
        } else if (state.consecutiveClickCount === 2) {
          onDoubleClick(Number(element.dataset.id));
        }

        restartDoubleClickTimer();
      }

      state.dragged = null;
      state.mouseDowned = false;
    }
  });

  return {
    doubleClickMouseDown,
    doubleClickMouseMove,
    doubleClickMouseUp
  };
};
