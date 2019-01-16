import { MouseEvent, useCallback, useMemo } from "react";
import Victor from "victor";
import { useRawResize } from "../../../hooks/useRawResize";
import { RECT_VERTICES, CORNER_INDEXES } from "../../../math/rect";
import { transform } from "../../../math/affineTransformation";
import { Frame } from "../type";

const TOP_LEFT = new Victor(0, 0);

export const useOuterResize = (
  setOuterPosition: (position: Victor) => void,
  setImageFrame: (frame: Frame) => void,
  onOuterResizeEnd: () => void,
  getOffset: (event: { original: MouseEvent }) => { x: number; y: number },
  outerBoxFrame: Frame,
  frame: Frame,
  angle: number,
  zoom: number
) => {
  const resizeDownHandlers: {
    [position: string]: (event: MouseEvent) => void;
  } = {};
  const resizeMoveHandlers: ((event: MouseEvent) => void)[] = [];
  const resizeUpHandlers: ((event: MouseEvent) => void)[] = [];

  const positions = CORNER_INDEXES.map(index => RECT_VERTICES[index]);
  for (let i = 0; i < positions.length; i++) {
    const position = positions[i];
    const [theResizeDown, theResizeMove, theResizeUp] = useRawResize(
      position as any,
      outerBoxFrame,
      angle,
      true,
      {
        zoom,
        getOffset,
        onResize({ frame: newFrame }) {
          setOuterPosition(new Victor(newFrame.x, newFrame.y));

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
