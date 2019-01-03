import { useRef } from "react";
import { useSelectionBeginningValue } from "./useSelectionBeginningValue";
import { updateElement } from "../CanvasAction";
import { useRotate as useRawRotate } from "../../../hooks/useRotate";
import { getDisplacementInControlBox } from "../../../math/affineTransformation";
import { updateControlBox } from "../../../controlBox";

export const useRotate = (
  dispatch,
  selectedElements,
  controlBoxFrame,
  controlBoxAngle
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

        dispatch(
          updateElement(id, {
            angle: beginningAngle + angle,
            frame: { ...frame, x: newX, y: newY }
          })
        );
      }

      // rotate control box
      dispatch(updateControlBox({ angle: beginningControlBoxAngle + angle }));
    },
    onRotateEnd() {
      clearValue();

      const state = stateRef.current;
      state.beginningControlBoxAngle = null;
    }
  });
};
