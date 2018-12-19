import Victor from "victor";
import { useResize } from "../../../hook/useResize";
import { RECT_VERTICES, CORNER_INDEXES } from "../../../math/rect";
import { transform } from "../../../math/affineTransformation";

export default (
  setOuterPosition,
  setImageFrame,
  outerBoxFrame,
  frame,
  angle
) => {
  const resizeMouseDown = {};
  const resizeMoveHandlers = [];
  const resizeUpHandlers = [];

  CORNER_INDEXES.map(index => RECT_VERTICES[index]).forEach(position => {
    const [theResizeDown, theResizeMove, theResizeUp] = useResize(
      position,
      outerBoxFrame,
      angle,
      true,
      {
        onMouseDown({ original }) {
          original.stopPropagation();
        },
        onResize({ frame: newFrame }) {
          setOuterPosition({ x: newFrame.x, y: newFrame.y });

          const topLeft = transform(new Victor(0, 0), newFrame, angle);
          const frameTopLeft = transform(new Victor(0, 0), frame, angle);
          setImageFrame({
            ...newFrame,
            ...topLeft.subtract(frameTopLeft).rotate(-angle)
          });
        }
      }
    );

    resizeMouseDown[position] = theResizeDown;
    resizeMoveHandlers.push(theResizeMove);
    resizeUpHandlers.push(theResizeUp);
  });

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

  return { resizeMouseDown, resizeMouseMove, resizeMouseUp };
};
