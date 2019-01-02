import { useRef } from "react";
import { updateSelectionBox } from "../CanvasAction";
import { setSelections } from "../../../selections";
import { useDrag } from "../../../hooks/useDrag";
import { verticesOfRect } from "../../../math/frame";
import {
  getOverlapCache,
  detectOverlapByCache
} from "../../../overlapDetection";

export const useSelectionBox = (dispatch, shouldSelect, elements) => {
  const stateRef = useRef({
    shouldSelect: null,
    beginningX: null,
    beginningY: null,
    overlapCache: null,
    selectedElements: null
  });

  const [selectBoxMouseDown, selectBoxMouseMove, selectBoxMouseUp] = useDrag({
    onMouseDown({ original }) {
      const state = stateRef.current;
      state.shouldSelect = shouldSelect(original);
      state.beginningX = original.pageX;
      state.beginningY = original.pageY;
    },
    onMouseUp(event) {
      const state = stateRef.current;
      state.shouldSelect = null;
      state.beginningX = event.original.pageX;
      state.beginningY = event.original.pageY;
    },

    shouldDrag() {
      return stateRef.current.shouldSelect;
    },

    onDragStart() {
      stateRef.current.overlapCache = getOverlapCache(elements);
    },
    onDragEnd() {
      dispatch(setSelections(stateRef.current.selectedElements));
      dispatch(updateSelectionBox({ x: 0, y: 0, width: 0, height: 0 }));

      stateRef.current.selectedElements = null;
      stateRef.current.overlapCache = null;
    },

    onDrag({ original }) {
      const { pageX, pageY } = original;
      const { beginningX, beginningY, overlapCache } = stateRef.current;
      const { vertices: selectionVertices, size } = verticesOfRect(
        { x: beginningX, y: beginningY },
        { x: pageX, y: pageY }
      );

      const selectedElements = detectOverlapByCache(
        selectionVertices,
        overlapCache
      );
      stateRef.current.selectedElements = selectedElements;

      const frame = {
        x: selectionVertices[3].x,
        y: selectionVertices[3].y,
        width: size.width,
        height: size.height
      };

      dispatch(updateSelectionBox(frame));
    }
  });

  return { selectBoxMouseDown, selectBoxMouseMove, selectBoxMouseUp };
};
