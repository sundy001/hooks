import { useCallback, useMemo } from "react";
import Victor from "victor";
import { useSelectionBeginningValue } from "./useSelectionBeginningValue";
import { updateElement } from "../CanvasAction";
import { useResize as useRawResize } from "../../../hooks/useResize";
import { RECT_VERTICES } from "../../../math/rect";
import { getDisplacementInControlBox } from "../../../math/affineTransformation";
import { emit } from "../../../eventBus";
import { updateControlBox } from "../../../controlBox";

export const useResize = (
  dispatch,
  selectedElements,
  controlBoxFrame,
  controlBoxAngle,
  shouldKeepAsepectRatio
) => {
  const { saveValue, getValue, clearValue } = useSelectionBeginningValue(
    selectedElements,
    controlBoxFrame
  );

  const resizeMoveHandlers = [];
  const resizeUpHandlers = [];
  const resizeDownHandlers = {};
  const resizeMouseDown = useMemo(() => resizeDownHandlers, []);

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

          for (let i = 0; i < selectedElements.length; i++) {
            emit("resizeStart", { id: selectedElements[i].id, position });
          }
        },
        onResize({ frame, beginningWidth, beginningHeight }) {
          const beginningValue = getValue();
          const hRatio = frame.width / beginningWidth;
          const vRatio = frame.height / beginningHeight;

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

            dispatch(
              updateElement(id, {
                frame: newFrame
              })
            );

            emit("resize", { id, position, frame: newFrame });
          }

          dispatch(updateControlBox({ frame }));
        },
        onResizeEnd() {
          clearValue();

          for (let i = 0; i < selectedElements.length; i++) {
            emit("resizeEnd", { id: selectedElements[i].id, position });
          }
        }
      }
    );

    resizeDownHandlers[position] = theResizeDown;
    resizeMoveHandlers.push(theResizeMove);
    resizeUpHandlers.push(theResizeUp);
  }

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
