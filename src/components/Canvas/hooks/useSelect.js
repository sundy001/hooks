import { useRef } from "react";
import { useDrag } from "../../../hooks/useDrag";
import { setSelections } from "../CanvasAction";
import { emit } from "../../../eventBus";

const DOUBLE_CLICK_INTERVAL = 500;

export const useSelect = (dispatch, selections) => {
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

  const [selectMouseDown, selectMouseMove, selectMouseUp] = useDrag({
    onMouseDown({ original }) {
      original.stopPropagation();

      const state = stateRef.current;
      state.dragged = false;
      state.mouseDowned = true;

      const elementHTMLElement = original.target.closest(".element");
      if (elementHTMLElement !== null) {
        const elementId = Number(elementHTMLElement.dataset.id);
        const element = selections.find(id => id === elementId);
        if (element === undefined) {
          dispatch(setSelections([elementId]));
        }
      }
    },
    onDragStart() {
      stateRef.current.dragged = true;
    },
    onMouseUp({ original }) {
      const { target, pageX, pageY } = original;
      const state = stateRef.current;
      const { clickPosition, mouseDowned, dragged } = state;

      const element = target.closest(".element");
      const isClickPositionDifferent =
        clickPosition !== null &&
        (clickPosition.x !== pageX || clickPosition.y !== pageY);

      if (isClickPositionDifferent || !mouseDowned) {
        clearDoubleClickData();
      }

      if (!dragged && mouseDowned && element !== null) {
        if (selections.length > 1) {
          dispatch(setSelections([Number(element.dataset.id)]));
        }

        state.consecutiveClickCount++;

        if (state.consecutiveClickCount === 1) {
          state.clickPosition = { x: pageX, y: pageY };
        }

        restartDoubleClickTimer();
      }

      if (state.consecutiveClickCount === 2) {
        emit("doubleClick", { id: Number(element.dataset.id) });
        restartDoubleClickTimer();
      }

      state.dragged = null;
      state.mouseDowned = false;
    }
  });

  return { selectMouseDown, selectMouseMove, selectMouseUp };
};
