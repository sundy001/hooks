import { useRef } from "react";
import { useRotate } from "../../../hook/useRotate";
import { useSelectionBeginningValue } from "../../../hook/useSelectionBeginningValue";
import { updateControlBox, updateElement } from "../CanvasAction";
import { rotationTransform } from "../../../math/affineTransformation";

export default (
  dispatch,
  elementStore,
  selections,
  controlBoxFrame,
  controlBoxAngle
) => {
  const stateRef = useRef({
    beginningControlBoxAngle: null
  });
  const { getValue, clearValue, updateOffset } = useSelectionBeginningValue(
    elementStore,
    selections,
    controlBoxFrame
  );

  const rotateHandler = useRotate(controlBoxFrame, controlBoxAngle, {
    onMouseDown({ original }) {
      original.stopPropagation();

      const state = stateRef.current;
      state.beginningControlBoxAngle = controlBoxAngle;
    },
    onRotate({ angle: newAngle }) {
      const beginningValue = getValue();

      // rotate elements
      selections.forEach(({ id }) => {
        const { frame } = elementStore.byId[id];
        const { x: newX, y: newY } = rotationTransform(
          beginningValue[id].offset,
          frame,
          beginningValue[id].angle,
          controlBoxFrame,
          newAngle
        );

        dispatch(
          updateElement(id, {
            angle: newAngle + beginningValue[id].angle,
            frame: { ...frame, x: newX, y: newY }
          })
        );
      });

      // rotate control box
      const { beginningControlBoxAngle } = stateRef.current;
      dispatch(
        updateControlBox({ angle: beginningControlBoxAngle + newAngle })
      );
    },
    onRotateEnd() {
      clearValue();

      const state = stateRef.current;
      state.beginningControlBoxAngle = null;
    }
  });

  return {
    ...rotateHandler,
    rotateResize: updateOffset
  };
};
