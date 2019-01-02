import { useRef } from "react";
import { useDrag } from "../hooks/useDrag";
import { setSelections, clearSelections } from "./actions";

export const useSelect = (
  dispatch,
  shouldDeselect,
  selections,
  { onDeselect }
) => {
  const stateRef = useRef({
    mouseDowned: true,
    dragged: null
  });

  const [selectMouseDown, selectMouseMove, selectMouseUp] = useDrag({
    onMouseDown({ original }) {
      const state = stateRef.current;
      state.dragged = false;
      state.mouseDowned = true;
      state.shouldDeselect = shouldDeselect(original);

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
      stateRef.current.shouldDeselect = false;
    },
    onMouseUp({ original }) {
      const state = stateRef.current;
      const { mouseDowned, dragged, shouldDeselect } = state;
      const element = original.target.closest(".element");

      if (
        !dragged &&
        mouseDowned &&
        element !== null &&
        selections.length > 1
      ) {
        dispatch(setSelections([Number(element.dataset.id)]));
      } else if (shouldDeselect) {
        dispatch(clearSelections());
        if (onDeselect) {
          onDeselect();
        }
      }

      stateRef.current.dragged = null;
      stateRef.current.mouseDowned = false;
      state.shouldDeselect = null;
    }
  });

  return { selectMouseDown, selectMouseMove, selectMouseUp };
};
