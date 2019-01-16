import { MouseEvent, useCallback, useMemo } from "react";
import Victor from "victor";
import { useRawResize } from "../../../hooks/useRawResize";
import { RECT_VERTICES, CORNER_INDEXES } from "../../../math/rect";
import { transform } from "../../../math/affineTransformation";
import { Frame } from "../type";

const TOP_LEFT = new Victor(0, 0);

export const useInnerResize = (
  setFrame: (frame: Frame) => void,
  setImageFrame: (frame: Frame) => void,
  onInnerResizeEnd: () => void,
  getOffset: (event: { original: MouseEvent }) => { x: number; y: number },
  frame: Frame,
  imageFrame: Frame,
  outerBoxPosition: Victor,
  angle: number,
  zoom: number
) => {
  const resizeDownHandlers: {
    [position: string]: (event: MouseEvent) => void;
  } = {};
  const resizeMoveHandlers: ((event: MouseEvent) => void)[] = ([] = []);
  const resizeUpHandlers: ((event: MouseEvent) => void)[] = ([] = []);

  const positions = CORNER_INDEXES.map(index => RECT_VERTICES[index]);
  for (let i = 0; i < positions.length; i++) {
    const position = positions[i];
    const [theResizeDown, theResizeMove, theResizeUp] = useRawResize(
      position as any,
      frame,
      angle,
      false,
      {
        zoom,
        getOffset,
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
