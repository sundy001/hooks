import Victor from "victor";
import { useResize } from "../../../hook/useResize";
import { useSelectionBeginingValue } from "../../../hook/useSelectionBeginingValue";
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
  const { getBeginingValue, clearBeginingValue } = useSelectionBeginingValue(
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
      {
        onMouseDown({ original }) {
          original.stopPropagation();
        },
        onResize({ frame, beginingWidth, beginingHeight }) {
          const beginingValue = getBeginingValue();
          const hRatio = frame.width / beginingWidth;
          const vRatio = frame.height / beginingHeight;

          selections.forEach(({ id }) => {
            const newWidth = beginingValue[id].width * hRatio;
            const newHeight = beginingValue[id].height * vRatio;

            const { x: offsetX, y: offsetY } = beginingValue[id].offset;
            const { x: newX, y: newY } = rotationTransform(
              new Victor(offsetX * hRatio, offsetY * vRatio),
              { width: newWidth, height: newHeight },
              beginingValue[id].angle,
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
          clearBeginingValue();
        }
      }
    );

    resizeMouseDown[position] = theResizeDown;
    resizeMoveHandlers.push(theResizeMove);
    resizeUpHandlers.push(theResizeUp);
  });

  return { resizeMouseDown, resizeMouseMove, resizeMouseUp };
};
