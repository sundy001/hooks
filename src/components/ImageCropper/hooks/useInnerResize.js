import { useCallback, useMemo } from "react";
import Victor from "victor";
import { useRawResize } from "../../../hooks/useRawResize";
import { RECT_VERTICES, CORNER_INDEXES } from "../../../math/rect";
import { transform } from "../../../math/affineTransformation";

const TOP_LEFT = new Victor(0, 0);

export const useInnerResize = (
  setFrame,
  setImageFrame,
  onInnerResizeEnd,
  frame,
  imageFrame,
  outerBoxPosition,
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
      frame,
      angle,
      false,
      {
        onMouseDown({ original }) {
          original.stopPropagation();
        },
        onResize({ frame: newFrame }) {
          setFrame(newFrame);

          const outerTopLeft = transform(
            TOP_LEFT,
            {
              ...imageFrame,
              ...outerBoxPosition
            },
            angle
          );

          const frameTopLeft = transform(TOP_LEFT, newFrame, angle);
          setImageFrame({
            ...imageFrame,
            ...outerTopLeft.subtract(frameTopLeft).rotate(-angle)
          });
        },
        onResizeEnd() {
          onInnerResizeEnd();
        }
      }
    );

    resizeDownHandlers[position] = theResizeDown;
    resizeMoveHandlers.push(theResizeMove);
    resizeUpHandlers.push(theResizeUp);
  }

  const innerResizeMouseDown = useMemo(() => resizeDownHandlers, []);

  const innerResizeMouseMove = useCallback(event => {
    for (let i = 0; i < resizeMoveHandlers.length; i++) {
      resizeMoveHandlers[i](event);
    }
  }, []);

  const innerResizeMouseUp = useCallback(event => {
    for (let i = 0; i < resizeUpHandlers.length; i++) {
      resizeUpHandlers[i](event);
    }
  }, []);

  return { innerResizeMouseDown, innerResizeMouseMove, innerResizeMouseUp };
};
