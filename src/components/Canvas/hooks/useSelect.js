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
      const element = selections.find(
        id => id === parseInt(original.target.dataset.id)
      );
      if (element === undefined) {
        dispatch(setSelections([original.target.dataset.id]));
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
