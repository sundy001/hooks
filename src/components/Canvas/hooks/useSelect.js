import { useRef } from "react";
import { useDragAndDrop } from "../../../hook/useDragAndDrop";
import { setSelections } from "../CanvasAction";
import { createSelection } from "../../../element";

export default (dispatch, elementStore, selections) => {
  const draggedRef = useRef(null);

  const selectElement = id => {
    const selection = createSelection(elementStore.byId[id]);
    dispatch(setSelections([selection]));
  };

  const [selectMouseDown, selectMouseMove, selectMouseUp] = useDragAndDrop({
    onMouseDown({ original }) {
      original.stopPropagation();

      draggedRef.current = false;

      if (selections.length < 2) {
        selectElement(original.target.dataset.id);
      }
    },
    onDragStart() {
      draggedRef.current = true;
    },
    onMouseUp({ original }) {
      const element = original.target.closest(".element");
      if (selections.length > 1 && !draggedRef.current && element !== null) {
        selectElement(element.dataset.id);
      }

      draggedRef.current = null;
    }
  });

  return { selectMouseDown, selectMouseMove, selectMouseUp };
};
