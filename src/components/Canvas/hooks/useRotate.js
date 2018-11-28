import { useMemo } from "react";
import { useRotate } from "../../../hook/useRotate";
import { useSelectionBeginingValue } from "../../../hook/useSelectionBeginingValue";
import { updateControlBox, updateElement } from "../CanvasAction";
import { rotationTransform } from "../../../math/affineTransformation";

export default (
  dispatch,
  elementStore,
  selections,
  controlBoxFrame,
  controlBoxAngle
) => {
  const { getBeginingValue, clearBeginingValue } = useSelectionBeginingValue(
    elementStore,
    selections,
    controlBoxFrame
  );

  const rotateHandler = useRotate(controlBoxFrame, controlBoxAngle, {
    onMouseDown({ original }) {
      original.stopPropagation();
    },
    onRotate({ angle: newAngle }) {
      const beginingValue = getBeginingValue();

      // rotate elements
      selections.forEach(({ id }) => {
        const { frame } = elementStore.byId[id];
        const { x: newX, y: newY } = rotationTransform(
          beginingValue[id].offset,
          frame,
          beginingValue[id].angle,
          controlBoxFrame,
          newAngle
        );

        dispatch(
          updateElement(id, {
            angle: newAngle + beginingValue[id].angle,
            frame: { ...frame, x: newX, y: newY }
          })
        );
      });

      // rotate control box
      dispatch(updateControlBox({ angle: newAngle }));
    }
  });

  return {
    ...rotateHandler,
    rotateReselect: useMemo(
      () => () => {
        clearBeginingValue();
      },
      []
    )
  };
};
