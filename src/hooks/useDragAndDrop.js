import { useRef } from "react";
import { useRawDragAndDrop } from "./useRawDragAndDrop";
import { useSelectionBeginningValue } from "./useSelectionBeginningValue";

export const useDragAndDrop = (
  shouldDrag,
  elements,
  controlBoxFrame,
  { onDrag } = {}
) => {
  const { saveValue, getValue, clearValue } = useSelectionBeginningValue(
    elements,
    controlBoxFrame
  );
  const beginningPositionRef = useRef(null);

  return useRawDragAndDrop({
    shouldDrag,

    onDragStart() {
      saveValue();
      beginningPositionRef.current = {
        x: controlBoxFrame.x,
        y: controlBoxFrame.y
      };
    },
    onDragEnd() {
      clearValue();
      beginningPositionRef.current = null;
    },

    onDrag({ dx, dy }) {
      if (elements.length === 0) {
        return;
      }

      const beginningValue = getValue();
      const event = { elements: [] };

      // move control box
      beginningPositionRef.current.x += dx;
      beginningPositionRef.current.y += dy;

      // move elements
      for (let i = 0; i < elements.length; i++) {
        const { offset, width, height } = beginningValue[elements[i].id];
        event.elements.push({
          id: elements[i].id,
          frame: {
            x: beginningPositionRef.current.x + offset.x,
            y: beginningPositionRef.current.y + offset.y,
            width,
            height
          }
        });
      }

      event.controlBoxPosition = { ...beginningPositionRef.current };

      if (onDrag) {
        onDrag(event);
      }
    }
  });
};
