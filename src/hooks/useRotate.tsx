import { useRef } from "react";
import { useSelectionBeginningValue } from "./useSelectionBeginningValue";
import { useRawRotate } from "./useRawRotate";
import { getDisplacementInControlBox } from "../math/affineTransformation";

export const useRotate = (
  elements: ReadonlyArray<
    Readonly<{
      id: number;
      frame: Readonly<Frame>;
      angle: number;
    }>
  >,
  controlBoxFrame: Readonly<Frame>,
  controlBoxAngle: number,
  {
    zoom,
    getOffset,
    onRotate
  }: {
    zoom?: number;
    getOffset?: (event: { original: MouseEvent }) => { x: number; y: number };
    onRotate?: (event: OnRotateEvent) => void;
  } = {}
) => {
  const stateRef = useRef<{
    beginningControlBoxAngle: number | null;
  }>({
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

      const event: OnRotateEvent = {
        elements: [],
        controlBoxAngle: beginningControlBoxAngle! + angle
      };

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
            ? beginningControlBoxAngle!
            : beginningValue[id].angle;

        event.elements.push({
          id,
          angle: beginningAngle + angle,
          frame: { ...frame, x: newX, y: newY }
        });
      }

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

type Frame = {
  width: number;
  height: number;
  x: number;
  y: number;
};

type OnRotateEvent = {
  controlBoxAngle: number;
  elements: { id: number; angle: number; frame: Frame }[];
};
