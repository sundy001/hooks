import { useCallback, useMemo } from "react";
import Victor from "victor";
import { useSelectionBeginningValue } from "./useSelectionBeginningValue";
import { useRawResize } from "./useRawResize";
import { RECT_VERTICES } from "../math/rect";
import { getDisplacementInControlBox } from "../math/affineTransformation";

export const useResize = (
  selectedElements,
  controlBoxFrame,
  controlBoxAngle,
  shouldKeepAsepectRatio,
  { onResizeStart, onResize, onResizeEnd } = {}
) => {
  const { saveValue, getValue, clearValue } = useSelectionBeginningValue(
    selectedElements,
    controlBoxFrame
  );

  const resizeMoveHandlers = [];
  const resizeUpHandlers = [];
  const resizeDownHandlers = {};

  for (let i = 0; i < RECT_VERTICES.length; i++) {
    const position = RECT_VERTICES[i];
    const [theResizeDown, theResizeMove, theResizeUp] = useRawResize(
      position,
      controlBoxFrame,
      controlBoxAngle,
      shouldKeepAsepectRatio,
      {
        onMouseDown({ original }) {
          original.stopPropagation();
        },
        onResizeStart() {
          saveValue();

          if (onResizeStart) {
            const event = { position, elements: [] };
            for (let i = 0; i < selectedElements.length; i++) {
              event.elements.push({
                id: selectedElements[i].id
              });
            }
            onResizeStart(event);
          }
        },
        onResize({ frame, beginningWidth, beginningHeight }) {
          const beginningValue = getValue();
          const hRatio = frame.width / beginningWidth;
          const vRatio = frame.height / beginningHeight;

          const event = { position, elements: [] };

          for (let i = 0; i < selectedElements.length; i++) {
            const { id } = selectedElements[i];
            const newWidth = beginningValue[id].width * hRatio;
            const newHeight = beginningValue[id].height * vRatio;

            const { x: offsetX, y: offsetY } = beginningValue[id].offset;
            const { x: newX, y: newY } = getDisplacementInControlBox(
              new Victor(offsetX * hRatio, offsetY * vRatio),
              { width: newWidth, height: newHeight },
              beginningValue[id].angle,
              frame,
              0
            );

            const newFrame = {
              x: newX,
              y: newY,
              width: newWidth,
              height: newHeight
            };

            event.elements.push({
              id,
              frame: newFrame
            });
          }

          event.controlBoxFrame = frame;

          if (onResize) {
            onResize(event);
          }
        },
        onResizeEnd() {
          clearValue();

          if (onResizeEnd) {
            const event = { position, elements: [] };
            for (let i = 0; i < selectedElements.length; i++) {
              event.elements.push({
                id: selectedElements[i].id
              });
            }
            onResizeEnd(event);
          }
        }
      }
    );

    resizeDownHandlers[position] = theResizeDown;
    resizeMoveHandlers.push(theResizeMove);
    resizeUpHandlers.push(theResizeUp);
  }

  const resizeMouseDown = useMemo(() => resizeDownHandlers, []);

  const resizeMouseMove = useCallback(event => {
    for (let i = 0; i < resizeMoveHandlers.length; i++) {
      resizeMoveHandlers[i](event);
    }
  }, []);

  const resizeMouseUp = useCallback(event => {
    for (let i = 0; i < resizeUpHandlers.length; i++) {
      resizeUpHandlers[i](event);
    }
  }, []);

  return {
    resizeMouseDown,
    resizeMouseMove,
    resizeMouseUp
  };
};
