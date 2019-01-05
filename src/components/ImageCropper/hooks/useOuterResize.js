import { useCallback, useMemo } from "react";
import Victor from "victor";
import { useRawResize } from "../../../hooks/useRawResize";
import { RECT_VERTICES, CORNER_INDEXES } from "../../../math/rect";
import { transform } from "../../../math/affineTransformation";

const TOP_LEFT = new Victor(0, 0);

export const useOuterResize = (
  setOuterPosition,
  setImageFrame,
  onOuterResizeEnd,
  getOffset,
  outerBoxFrame,
  frame,
  angle
) => {
  const resizeDownHandlers = {};
  const resizeMoveHandlers = [];
  const resizeUpHandlers = [];

  const positions = CORNER_INDEXES.map(index => RECT_VERTICES[index]);
  for (let i = 0; i < positions.length; i++) {
    const position = positions[i];
    const [theResizeDown, theResizeMove, theResizeUp] = useRawResize(
      position,
      outerBoxFrame,
      angle,
      true,
      {
        getOffset,
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

    resizeDownHandlers[position] = theResizeDown;
    resizeMoveHandlers.push(theResizeMove);
    resizeUpHandlers.push(theResizeUp);
  }

  const outerResizeMouseDown = useMemo(() => resizeDownHandlers, []);

  const outerResizeMouseMove = useCallback(event => {
    for (let i = 0; i < resizeMoveHandlers.length; i++) {
      resizeMoveHandlers[i](event);
    }
  }, []);

  const outerResizeMouseUp = useCallback(event => {
    for (let i = 0; i < resizeUpHandlers.length; i++) {
      resizeUpHandlers[i](event);
    }
  }, []);

  return { outerResizeMouseDown, outerResizeMouseMove, outerResizeMouseUp };
};
