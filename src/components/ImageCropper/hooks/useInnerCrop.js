import Victor from "victor";
import { useResize } from "../../../hook/useResize";
import { RECT_VERTICES, CORNER_INDEXES } from "../../../math/rect";
import { transform } from "../../../math/affineTransformation";

export default (setFrame, setImageFrame, frame, imageFrame, angle) => {
  const cropMouseDown = {};
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

          setImageFrame({
            ...imageFrame
          });
        }
      }
    );

    cropMouseDown[position] = theResizeDown;
    resizeMoveHandlers.push(theResizeMove);
    resizeUpHandlers.push(theResizeUp);
  });

  const cropMouseMove = event => {
    resizeMoveHandlers.forEach(handler => {
      handler(event);
    });
  };

  const cropMouseUp = event => {
    resizeUpHandlers.forEach(handler => {
      handler(event);
    });
  };

  return { cropMouseDown, cropMouseMove, cropMouseUp };
};
