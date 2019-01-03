import Victor from "victor";
import { useRawResize } from "../../../hooks/useRawResize";
import { RECT_VERTICES, CORNER_INDEXES } from "../../../math/rect";
import { transform } from "../../../math/affineTransformation";

const TOP_LEFT = new Victor(0, 0);

export const useOuterResize = (
  setOuterPosition,
  setImageFrame,
  onOuterResizeEnd,
  outerBoxFrame,
  frame,
  angle
) => {
  const outerResizeMouseDown = {};
  const resizeMoveHandlers = [];
  const resizeUpHandlers = [];

  CORNER_INDEXES.map(index => RECT_VERTICES[index]).forEach(position => {
    const [theResizeDown, theResizeMove, theResizeUp] = useRawResize(
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

          const topLeft = transform(TOP_LEFT, newFrame, angle);
          const frameTopLeft = transform(TOP_LEFT, frame, angle);
          setImageFrame({
            ...newFrame,
            ...topLeft.subtract(frameTopLeft).rotate(-angle)
          });
        },
        onResizeEnd() {
          onOuterResizeEnd();
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
