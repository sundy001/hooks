import Victor from "victor";
import { useResize } from "../../../hooks/useResize";
import { RECT_VERTICES, CORNER_INDEXES } from "../../../math/rect";
import { transform } from "../../../math/affineTransformation";

export const useOuterResize = (
  setOuterPosition,
  setImageFrame,
  outerResizeEnd,
  outerBoxFrame,
  frame,
  angle
) => {
  const outerResizeMouseDown = {};
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
        },
        onResizeEnd() {
          outerResizeEnd();
        }
      }
    );

    outerResizeMouseDown[position] = theResizeDown;
    resizeMoveHandlers.push(theResizeMove);
    resizeUpHandlers.push(theResizeUp);
  });

  const outerResizeMouseMove = event => {
    resizeMoveHandlers.forEach(handler => {
      handler(event);
    });
  };

  const outerResizeMouseUp = event => {
    resizeUpHandlers.forEach(handler => {
      handler(event);
    });
  };

  return { outerResizeMouseDown, outerResizeMouseMove, outerResizeMouseUp };
};
