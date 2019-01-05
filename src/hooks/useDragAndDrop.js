import { useRef } from "react";
import { useRawDragAndDrop } from "./useRawDragAndDrop";

export const useDragAndDrop = (
  shouldDrag,
  elements,
  controlBoxFrame,
  { onDrag } = {}
) => {
  const beginningPositionRef = useRef(null);

  return useRawDragAndDrop({
    shouldDrag,

    onDragStart() {
      beginningPositionRef.current = {
        x: controlBoxFrame.x,
        y: controlBoxFrame.y
      };
    },
    onDragEnd() {
      beginningPositionRef.current = null;
    },

    onDrag({ dx, dy }) {
      if (elements.length === 0) {
        return;
      }

      const event = { elements: [] };

      // move elements
      for (let i = 0; i < elements.length; i++) {
        event.elements.push({
          id: elements[i].id,
          frame: {
            ...elements[i].frame,
            x: elements[i].frame.x + dx,
            y: elements[i].frame.y + dy
          }
        });
      }

      // move control box
      beginningPositionRef.current.x += dx;
      beginningPositionRef.current.y += dy;

      event.controlBoxPosition = { ...beginningPositionRef.current };

      if (onDrag) {
        onDrag(event);
      }
    }
  });
};
