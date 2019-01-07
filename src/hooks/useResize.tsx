import { useCallback, useMemo } from "react";
import Victor from "victor";
import { useSelectionBeginningValue } from "./useSelectionBeginningValue";
import { useRawResize, Frame } from "./useRawResize";
import { RECT_VERTICES } from "../math/rect";
import { getDisplacementInControlBox } from "../math/affineTransformation";

export const useResize = (
  elements: ReadonlyArray<
    Readonly<{
      id: number;
      frame: Readonly<Frame>;
      angle: number;
    }>
  >,
  controlBoxFrame: Readonly<Frame>,
  controlBoxAngle: number,
  shouldKeepAspectRatio: boolean,
  {
    zoom,
    getOffset,
    onResizeStart,
    onResize,
    onResizeEnd
  }: {
    zoom?: number;
    getOffset?: any;
    onResizeStart?: any;
    onResize?: any;
    onResizeEnd?: any;
  } = {}
) => {
  const { saveValue, getValue, clearValue } = useSelectionBeginningValue(
    elements,
    controlBoxFrame
  );

  const resizeMoveHandlers = [];
  const resizeUpHandlers = [];
  const resizeDownHandlers = {};

  for (let i = 0; i < RECT_VERTICES.length; i++) {
    const position = RECT_VERTICES[i];
    const [theResizeDown, theResizeMove, theResizeUp] = useRawResize(
      position as any,
      controlBoxFrame,
      controlBoxAngle,
      shouldKeepAspectRatio,
      {
        zoom,
        getOffset,
        onResizeStart() {
          saveValue();

          if (onResizeStart) {
            const event = { position, elements: [] };
            for (let i = 0; i < elements.length; i++) {
              event.elements.push({
                id: elements[i].id
              });
            }
            onResizeStart(event);
          }
        },
        onResize({ frame, wRatio, hRatio }) {
          const beginningValue = getValue();
          const event: any = { position, elements: [] };

          for (let i = 0; i < elements.length; i++) {
            const { id } = elements[i];
            const newWidth = beginningValue[id].width * wRatio;
            const newHeight = beginningValue[id].height * hRatio;

            const { x: offsetX, y: offsetY } = beginningValue[id].offset;
            const { x: newX, y: newY } = getDisplacementInControlBox(
              new Victor(offsetX * wRatio, offsetY * hRatio),
              { width: newWidth, height: newHeight },
              beginningValue[id].angle,
              frame,
              0
            );

            const newFrame = {
              x: newX,
              y: newY,
              width: newWidth,
              height: newHeight
            };

            event.elements.push({
              id,
              frame: newFrame
            });
          }
          event.controlBoxFrame = frame;

          if (onResize) {
            onResize(event);
          }
        },
        onResizeEnd() {
          clearValue();

          if (onResizeEnd) {
            const event = { position, elements: [] };
            for (let i = 0; i < elements.length; i++) {
              event.elements.push({
                id: elements[i].id
              });
            }
            onResizeEnd(event);
          }
        }
      }
    );

    resizeDownHandlers[position] = theResizeDown;
    resizeMoveHandlers.push(theResizeMove);
    resizeUpHandlers.push(theResizeUp);
  }

  const resizeMouseDown = useMemo(() => resizeDownHandlers, []);

  const resizeMouseMove = useCallback(event => {
    for (let i = 0; i < resizeMoveHandlers.length; i++) {
      resizeMoveHandlers[i](event);
    }
  }, []);

  const resizeMouseUp = useCallback(event => {
    for (let i = 0; i < resizeUpHandlers.length; i++) {
      resizeUpHandlers[i](event);
    }
  }, []);

  return {
    resizeMouseDown,
    resizeMouseMove,
    resizeMouseUp
  };
};
