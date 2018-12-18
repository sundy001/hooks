import { useRef } from "react";
import { useDragAndDrop } from "../../../hook/useDragAndDrop";
import { setSelections } from "../CanvasAction";
import { emit } from "../../../eventBus";

const DOUBLE_CLICK_INTERVAL = 500;

export default (dispatch, selections) => {
  const stateRef = useRef({
    clickPosition: null,
    consecutiveClickCount: 0,
    doubleClickTimer: null,
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

  const [selectMouseDown, selectMouseMove, selectMouseUp] = useDragAndDrop({
    onMouseDown({ original }) {
      original.stopPropagation();

      const state = stateRef.current;
      state.dragged = false;

      const elementHTMLElement = original.target.closest(".element");
      if (elementHTMLElement !== null) {
        const element = selections.find(
          id => id === Number(elementHTMLElement.dataset.id)
        );
        if (element === undefined) {
          dispatch(setSelections([elementHTMLElement.dataset.id]));
        }
      }
    },
    onDragStart() {
      stateRef.current.dragged = true;
    },
    onMouseUp({ original }) {
      const { target, pageX, pageY } = original;
      const state = stateRef.current;

      const element = target.closest(".element");

      if (
        state.clickPosition !== null &&
        (state.clickPosition.x !== pageX || state.clickPosition.y !== pageY)
      ) {
        clearDoubleClickData();
      }

      if (!state.dragged && element !== null) {
        if (selections.length > 1) {
          dispatch(setSelections([element.dataset.id]));
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
    }
  });

  return { selectMouseDown, selectMouseMove, selectMouseUp };
};
