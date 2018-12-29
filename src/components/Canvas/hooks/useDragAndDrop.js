import { useRef } from "react";
import { useDragAndDrop as useRawDragAndDrop } from "../../../hooks/useDragAndDrop";
import { updateControlBox, updateElement } from "../CanvasAction";

export const useDragAndDrop = (dispatch, selectedElements, controlBoxFrame) => {
  const stateRef = useRef({
    previousPoint: null,
    beginningFrame: null
  });

  return useRawDragAndDrop({
    onMouseDown({ original }) {
      original.stopPropagation();
    },
    onDragStart() {
      stateRef.current.beginningFrame = { ...controlBoxFrame };
    },
    onDragEnd() {
      stateRef.current.beginningFrame = null;
    },
    onDrag({ dx, dy }) {
      const { beginningFrame } = stateRef.current;

      // move elements
      selectedElements.forEach(({ id, frame }) => {
        dispatch(
          updateElement(id, {
            frame: {
              ...frame,
              x: frame.x + dx,
              y: frame.y + dy
            }
          })
        );
      });

      // move control box
      beginningFrame.x += dx;
      beginningFrame.y += dy;
      dispatch(updateControlBox({ frame: { ...beginningFrame } }));
    }
  });
};
