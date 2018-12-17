import { useRef } from "react";
import { useDragAndDrop } from "../../../hook/useDragAndDrop";
import { setSelections } from "../CanvasAction";

export default (dispatch, selections) => {
  const draggedRef = useRef(null);

  const [selectMouseDown, selectMouseMove, selectMouseUp] = useDragAndDrop({
    onMouseDown({ original }) {
      original.stopPropagation();

      draggedRef.current = false;

      // check the element is not if it has been selected
      const elementHTMLElement = original.target.closest(".element");
      if (elementHTMLElement !== null) {
        const element = selections.find(
          id => id === parseInt(elementHTMLElement.dataset.id)
        );
        if (element === undefined) {
          dispatch(setSelections([elementHTMLElement.dataset.id]));
        }
      }
    },
    onDragStart() {
      draggedRef.current = true;
    },
    onMouseUp({ original }) {
      const element = original.target.closest(".element");
      if (selections.length > 1 && !draggedRef.current && element !== null) {
        dispatch(setSelections([element.dataset.id]));
      }

      draggedRef.current = null;
    }
  });

  return { selectMouseDown, selectMouseMove, selectMouseUp };
};
