import { useRef } from "react";
import { useDragAndDrop } from "../../../hook/useDragAndDrop";
import { setSelections } from "../CanvasAction";
import { createSelection } from "../../../element";

export default (dispatch, elementStore, selections) => {
  const draggedRef = useRef(null);

  const selectElement = targetElement => {
    const id = targetElement.closest(".element").dataset.id;
    const element = elementStore.byId[id];
    const selection = createSelection(element);
    dispatch(setSelections([selection]));
  };

  const [selectMouseDown, selectMouseMove, selectMouseUp] = useDragAndDrop({
    onMouseDown({ original }) {
      original.stopPropagation();

      draggedRef.current = false;

      if (selections.length < 2) {
        selectElement(original.target);
      }
    },
    onDrag() {
      draggedRef.current = true;
    },
    onDragEnd({ target }) {
      if (selections.length > 1 && !draggedRef.current) {
        selectElement(target);
      }
      draggedRef.current = null;
    }
  });

  return { selectMouseDown, selectMouseMove, selectMouseUp };
};
