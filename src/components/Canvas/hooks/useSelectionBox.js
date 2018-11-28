import { useSelectionBox } from "../../../hook/useSelectionBox";
import { updateSelectionBox, setSelections } from "../CanvasAction";

export default (dispatch, elements) =>
  useSelectionBox(elements, {
    onDrag({ selectedElements, frame }) {
      dispatch(updateSelectionBox(frame));
    },
    onSelectEnd(selectedElements) {
      dispatch(setSelections(selectedElements));
      dispatch(updateSelectionBox({ x: 0, y: 0, width: 0, height: 0 }));
    }
  });
