import { useRef } from "react";
import { useDrag } from "../hooks/useDrag";
import { verticesOfRect } from "../math/frame";
import { getOverlapCache, detectOverlapByCache } from "../overlapDetection";

export const useSelectionBox = (
  shouldSelect,
  elements,
  { onSelect, onSelectEnd } = {}
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
        const pageElement = document.querySelector(`.page[data-id="${page}"]`);
        const rect = pageElement.getBoundingClientRect();

        let scrollElement =
          ((scrollElement = document.documentElement) ||
            (scrollElement = document.body.parentNode)) &&
          typeof scrollElement.scrollLeft == "number"
            ? scrollElement
            : document.body;

        return {
          id,
          frame: {
            ...frame,
            x: frame.x + rect.left + scrollElement.scrollLeft,
            y: frame.y + rect.top + scrollElement.scrollTop
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
