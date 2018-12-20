import { useSelectionBox as useRawSelectionBox } from "../../../hooks/useSelectionBox";
import { updateSelectionBox, setSelections } from "../CanvasAction";

export const useSelectionBox = (dispatch, elements) =>
  useRawSelectionBox(elements, {
    onDrag({ frame }) {
      dispatch(updateSelectionBox(frame));
    },
    onSelectEnd(selectedElements) {
      dispatch(setSelections(selectedElements));
      dispatch(updateSelectionBox({ x: 0, y: 0, width: 0, height: 0 }));
    }
  });
