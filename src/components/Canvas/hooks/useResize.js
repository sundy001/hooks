import Victor from "victor";
import { useResize } from "../../../hook/useResize";
import { useSelectionBeginningValue } from "./useSelectionBeginningValue";
import { RECT_VERTICES } from "../../../math/rect";
import { updateControlBox, updateElement } from "../CanvasAction";
import { rotationTransform } from "../../../math/affineTransformation";

export default (
  dispatch,
  elementStore,
  selections,
  controlBoxFrame,
  controlBoxAngle
) => {
  const { saveValue, getValue, clearValue } = useSelectionBeginningValue(
    elementStore,
    selections,
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
      selections.length > 1,
      {
        onMouseDown({ original }) {
          original.stopPropagation();
        },
        onResizeStart() {
          saveValue();
        },
        onResize({ frame, beginningWidth, beginningHeight }) {
          const beginningValue = getValue();
          const hRatio = frame.width / beginningWidth;
          const vRatio = frame.height / beginningHeight;

          selections.forEach(id => {
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

            dispatch(
              updateElement(id, {
                frame: {
                  x: newX,
                  y: newY,
                  width: newWidth,
                  height: newHeight
                }
              })
            );
          });

          dispatch(updateControlBox({ frame }));
        },
        onResizeEnd() {
          clearValue();
        }
      }
    );

    resizeMouseDown[position] = theResizeDown;
    resizeMoveHandlers.push(theResizeMove);
    resizeUpHandlers.push(theResizeUp);
  });

  return { resizeMouseDown, resizeMouseMove, resizeMouseUp };
};
