import Victor from "victor";
import { useRef } from "react";
import { useResize } from "../../../hook/useResize";
import { useSelectionBeginningValue } from "./useSelectionBeginningValue";
import { RECT_VERTICES } from "../../../math/rect";
import { updateControlBox, updateElement } from "../CanvasAction";
import { rotationTransform } from "../../../math/affineTransformation";
import { emit } from "../../../eventBus";

export default (
  dispatch,
  selectedElements,
  controlBoxFrame,
  controlBoxAngle
) => {
  const resizePositionRef = useRef(null);
  const { saveValue, getValue, clearValue } = useSelectionBeginningValue(
    selectedElements,
    controlBoxFrame
  );

  const resizeMouseDown = {};
  const resizeMoveHandlers = [];
  const resizeUpHandlers = [];

  const resizeMouseMove = event => {
    resizeMoveHandlers.forEach(handler => {
      handler(event);
    });
  };

  const resizeMouseUp = event => {
    resizeUpHandlers.forEach(handler => {
      handler(event);
    });
  };

  RECT_VERTICES.forEach(position => {
    const [theResizeDown, theResizeMove, theResizeUp] = useResize(
      position,
      controlBoxFrame,
      controlBoxAngle,
      selectedElements.length > 1,
      {
        onMouseDown({ original }) {
          original.stopPropagation();
        },
        onResizeStart() {
          resizePositionRef.current = position;
          saveValue();

          selectedElements.forEach(({ id }) => {
            emit("resizeStart", { id, position });
          });
        },
        onResize({ frame, beginningWidth, beginningHeight }) {
          const beginningValue = getValue();
          const hRatio = frame.width / beginningWidth;
          const vRatio = frame.height / beginningHeight;

          selectedElements.forEach(({ id }) => {
            const newWidth = beginningValue[id].width * hRatio;
            const newHeight = beginningValue[id].height * vRatio;

            const { x: offsetX, y: offsetY } = beginningValue[id].offset;
            const { x: newX, y: newY } = rotationTransform(
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
          });

          dispatch(updateControlBox({ frame }));
        },
        onResizeEnd() {
          const position = resizePositionRef.current;
          resizePositionRef.current = null;
          clearValue();

          selectedElements.forEach(({ id }) => {
            emit("resizeEnd", { id, position });
          });
        }
      }
    );

    resizeMouseDown[position] = theResizeDown;
    resizeMoveHandlers.push(theResizeMove);
    resizeUpHandlers.push(theResizeUp);
  });

  return {
    resizeMouseDown,
    resizeMouseMove,
    resizeMouseUp
  };
};
