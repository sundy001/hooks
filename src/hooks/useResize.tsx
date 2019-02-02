import { MouseEvent, useCallback, useMemo } from "react";
import Victor from "victor";
import { useSelectionBeginningValue } from "./useSelectionBeginningValue";
import { useRawResize } from "./useRawResize";
import { RECT_VERTICES } from "../math/rect";
import { getDisplacementInControlBox } from "../math/affineTransformation";
import { DeepReadonlyArray } from "../utilType";

export const useResize = (
  elements: DeepReadonlyArray<{
    id: number;
    frame: Frame;
    angle: number;
  }>,
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
    getOffset?: (event: { original: MouseEvent }) => { x: number; y: number };
    onResizeStart?: (event: UseResizeEvent) => void;
    onResize?: (event: OnResizeEvent) => void;
    onResizeEnd?: (event: UseResizeEvent) => void;
  } = {}
) => {
  const { saveValue, getValue, clearValue } = useSelectionBeginningValue(
    elements,
    controlBoxFrame
  );

  const resizeMoveHandlers: ((event: MouseEvent) => void)[] = [];
  const resizeUpHandlers: ((event: MouseEvent) => void)[] = [];
  const resizeDownHandlers: {
    [position: string]: (event: MouseEvent) => void;
  } = {};

  for (let i = 0; i < RECT_VERTICES.length; i++) {
    const position = RECT_VERTICES[i];
    const [theResizeDown, theResizeMove, theResizeUp] = useRawResize(
      position,
      controlBoxFrame,
      controlBoxAngle,
      shouldKeepAspectRatio,
      {
        zoom,
        getOffset,
        onResizeStart() {
          saveValue();

          if (onResizeStart) {
            const event: UseResizeEvent = {
              position,
              elements: []
            };
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
          const event: OnResizeEvent = {
            position,
            elements: [],
            controlBoxFrame: frame
          };

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

          if (onResize) {
            onResize(event);
          }
        },
        onResizeEnd() {
          clearValue();

          if (onResizeEnd) {
            const event: UseResizeEvent = {
              position,
              elements: []
            };
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

type UseResizeEvent = { position: string; elements: { id: number }[] };
type OnResizeEvent = {
  position: string;
  elements: { id: number; frame: Frame }[];
  controlBoxFrame: Frame;
};
type Frame = {
  width: number;
  height: number;
  x: number;
  y: number;
};
