import { useRef } from "react";
import { useSelectionBeginningValue } from "./useSelectionBeginningValue";
import { useRawRotate } from "./useRawRotate";
import { getDisplacementInControlBox } from "../math/affineTransformation";

export const useRotate: (
  elements: any,
  controlBoxFrame: any,
  controlBoxAngle: number,
  options: { zoom?: number; getOffset?: any; onRotate?: any }
) => any = (
  elements,
  controlBoxFrame,
  controlBoxAngle,
  { zoom, getOffset, onRotate } = {}
) => {
  const stateRef = useRef({
    beginningControlBoxAngle: null
  });
  const { saveValue, getValue, clearValue } = useSelectionBeginningValue(
    elements,
    controlBoxFrame
  );

  return useRawRotate(controlBoxFrame, {
    zoom,
    getOffset,
    onRotateStart() {
      stateRef.current.beginningControlBoxAngle = controlBoxAngle;
      saveValue();
    },
    onRotate({ angle }) {
      const beginningValue = getValue();
      const { beginningControlBoxAngle } = stateRef.current;

      const event: any = { elements: [] };

      // rotate elements
      for (let i = 0; i < elements.length; i++) {
        const { id, frame } = elements[i];
        const { x: newX, y: newY } = getDisplacementInControlBox(
          beginningValue[id].offset,
          frame,
          beginningValue[id].angle,
          controlBoxFrame,
          angle
        );

        const beginningAngle =
          elements.length === 1
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