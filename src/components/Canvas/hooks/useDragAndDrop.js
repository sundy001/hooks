import { useRef } from "react";
import { useDragAndDrop as useRawDragAndDrop } from "../../../hooks/useDragAndDrop";
import { updateControlBox, updateElement } from "../CanvasAction";

export const useDragAndDrop = (dispatch, selectedElements, controlBoxFrame) => {
  const beginningFrameRef = useRef(null);

  return useRawDragAndDrop({
    onMouseDown({ original }) {
      original.stopPropagation();
    },
    onDragStart() {
      beginningFrameRef.current = { ...controlBoxFrame };
    },
    onDragEnd() {
      beginningFrameRef.current = null;
    },
    onDrag({ dx, dy }) {
      const beginningFrame = beginningFrameRef.current;

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
