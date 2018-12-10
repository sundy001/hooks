import { useRef } from "react";
import { useDragAndDrop } from "./useDragAndDrop";
import { verticesOfRect } from "../math/frame";
import { createSelection } from "../element";
import {
  overlapCache,
  overlapedElementsByCache
} from "../math/overlapDetection";

export const useSelectionBox = (
  elements,
  { shouldSelect, onDrag, onSelectEnd } = {}
) => {
  const stateRef = useRef({
    beginningX: null,
    beginningY: null,
    elementInfo: null,
    selectedElements: null
  });

  const [
    selectBoxMouseDown,
    selectBoxMouseMove,
    selectBoxMouseUp
  ] = useDragAndDrop({
    shouldDrag(event) {
      return shouldSelect ? shouldSelect(event) : true;
    },
    onMouseDown({ original }) {
      const state = stateRef.current;
      state.beginningX = original.pageX;
      state.beginningY = original.pageY;
    },
    onDragStart() {
      stateRef.current.elementInfo = overlapCache(elements);
    },
    onDrag({ original }) {
      const { pageX, pageY } = original;
      const { beginningX, beginningY, elementInfo } = stateRef.current;
      const { vertices: selectionVertices, size } = verticesOfRect(
        { x: beginningX, y: beginningY },
        { x: pageX, y: pageY }
      );

      const selectedElements = overlapedElementsByCache(
        selectionVertices,
        elementInfo
      ).map(createSelection);
      stateRef.current.selectedElements = selectedElements;

      if (onDrag) {
        const frame = {
          x: selectionVertices[3].x,
          y: selectionVertices[3].y,
          width: size.width,
          height: size.height
        };

        onDrag({ frame, selectedElements });
      }
    },
    onMouseUp(event) {
      const state = stateRef.current;
      state.beginningX = event.original.pageX;
      state.beginningY = event.original.pageY;
    },
    onDragEnd() {
      if (onSelectEnd) {
        onSelectEnd([...stateRef.current.selectedElements]);
      }

      stateRef.current.selectedElements = null;
      stateRef.current.elementInfo = null;
    }
  });

  return { selectBoxMouseDown, selectBoxMouseMove, selectBoxMouseUp };
};
