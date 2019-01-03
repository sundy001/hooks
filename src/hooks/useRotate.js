import { useRef } from "react";
import { useSelectionBeginningValue } from "./useSelectionBeginningValue";
import { useRawRotate } from "./useRawRotate";
import { getDisplacementInControlBox } from "../math/affineTransformation";

export const useRotate = (
  selectedElements,
  controlBoxFrame,
  controlBoxAngle,
  { onRotate } = {}
) => {
  const stateRef = useRef({
    beginningControlBoxAngle: null
  });
  const { saveValue, getValue, clearValue } = useSelectionBeginningValue(
    selectedElements,
    controlBoxFrame
  );

  return useRawRotate(controlBoxFrame, {
    onMouseDown({ original }) {
      original.stopPropagation();
    },
    onRotateStart() {
      stateRef.current.beginningControlBoxAngle = controlBoxAngle;
      saveValue();
    },
    onRotate({ angle }) {
      const beginningValue = getValue();
      const { beginningControlBoxAngle } = stateRef.current;

      const event = { elements: [] };

      // rotate elements
      for (let i = 0; i < selectedElements.length; i++) {
        const { id, frame } = selectedElements[i];
        const { x: newX, y: newY } = getDisplacementInControlBox(
          beginningValue[id].offset,
          frame,
          beginningValue[id].angle,
          controlBoxFrame,
          angle
        );

        const beginningAngle =
          selectedElements.length === 1
            ? beginningControlBoxAngle
            : beginningValue[id].angle;

        event.elements.push({
          id,
          angle: beginningAngle + angle,
          frame: { ...frame, x: newX, y: newY }
        });
      }

      event.controlBoxAngle = beginningControlBoxAngle + angle;

      if (onRotate) {
        onRotate(event);
      }
    },
    onRotateEnd() {
      clearValue();

      const state = stateRef.current;
      state.beginningControlBoxAngle = null;
    }
  });
};
