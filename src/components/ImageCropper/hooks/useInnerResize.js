import Victor from "victor";
import { useResize } from "../../../hooks/useResize";
import { RECT_VERTICES, CORNER_INDEXES } from "../../../math/rect";
import { transform } from "../../../math/affineTransformation";

export const useInnerResize = (
  setFrame,
  setImageFrame,
  innerResizeEnd,
  frame,
  imageFrame,
  outerBoxPosition,
  angle
) => {
  const innerResizeMouseDown = {};
  const resizeMoveHandlers = [];
  const resizeUpHandlers = [];

  CORNER_INDEXES.map(index => RECT_VERTICES[index]).forEach(position => {
    const [theResizeDown, theResizeMove, theResizeUp] = useResize(
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
            new Victor(0, 0),
            {
              ...imageFrame,
              ...outerBoxPosition
            },
            angle
          );
          const frameTopLeft = transform(new Victor(0, 0), newFrame, angle);

          setImageFrame({
            ...imageFrame,
            ...outerTopLeft.subtract(frameTopLeft).rotate(-angle)
          });
        },
        onResizeEnd() {
          innerResizeEnd();
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
