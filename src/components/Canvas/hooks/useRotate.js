import { useRef } from "react";
import { useRotate } from "../../../hooks/useRotate";
import { useSelectionBeginningValue } from "./useSelectionBeginningValue";
import { updateControlBox, updateElement } from "../CanvasAction";
import { rotationTransform } from "../../../math/affineTransformation";

export default (
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

  return useRotate(controlBoxFrame, {
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
      selectedElements.forEach(({ id, frame }) => {
        const { x: newX, y: newY } = rotationTransform(
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
      });

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
