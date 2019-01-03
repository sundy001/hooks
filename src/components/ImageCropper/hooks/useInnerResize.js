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
  const innerResizeMouseDown = {};
  const resizeMoveHandlers = [];
  const resizeUpHandlers = [];

  CORNER_INDEXES.map(index => RECT_VERTICES[index]).forEach(position => {
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

    innerResizeMouseDown[position] = theResizeDown;
    resizeMoveHandlers.push(theResizeMove);
    resizeUpHandlers.push(theResizeUp);
  });

  const innerResizeMouseMove = event => {
    resizeMoveHandlers.forEach(handler => {
      handler(event);
    });
  };

  const innerResizeMouseUp = event => {
    resizeUpHandlers.forEach(handler => {
      handler(event);
    });
  };

  return { innerResizeMouseDown, innerResizeMouseMove, innerResizeMouseUp };
};
