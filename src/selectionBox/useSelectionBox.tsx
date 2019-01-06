import { useRef } from "react";
import { useDrag } from "../hooks/useDrag";
import { verticesOfRect } from "../math/frame";
import { getOverlapCache, detectOverlapByCache } from "../overlapDetection";

export const useSelectionBox: (
  shouldSelect: any,
  elements: any,
  options: { zoom?: number; getOffset?: any; onSelect?: any; onSelectEnd?: any }
) => any = (
  shouldSelect,
  elements,
  { zoom, getOffset, onSelect, onSelectEnd } = {}
) => {
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
      const offsettedElements = elements.map(({ id, frame, angle, page }) => {
        const offset = getOffset ? getOffset(page) : { x: 0, y: 0 };
        return {
          id,
          frame: {
            ...frame,
            x: frame.x * zoom + offset.x,
            y: frame.y * zoom + offset.y
          },
          angle
        };
      });
      stateRef.current.overlapCache = getOverlapCache(offsettedElements);
    },
    onDragEnd() {
      if (onSelectEnd) {
        onSelectEnd(stateRef.current.selectedElements);
      }
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

      if (onSelect) {
        onSelect({ selectedElements, frame });
      }
    }
  });

  return { selectBoxMouseDown, selectBoxMouseMove, selectBoxMouseUp };
};
