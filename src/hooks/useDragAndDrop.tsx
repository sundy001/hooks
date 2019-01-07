import { useRef } from "react";
import { useRawDragAndDrop } from "./useRawDragAndDrop";

export const useDragAndDrop = (
  shouldDrag: (event: MouseEvent) => boolean,
  elements: ReadonlyArray<
    Readonly<{
      id: number;
      frame: Readonly<Frame>;
      angle: number;
    }>
  >,
  controlBoxFrame: Readonly<Frame>,
  {
    zoom,
    onDrag
  }: { zoom?: number; onDrag?: (event: OnDragEvent) => void } = {}
) => {
  const beginningPositionRef = useRef<null | { x: number; y: number }>(null);

  return useRawDragAndDrop({
    zoom,
    shouldDrag,

    onDragStart() {
      beginningPositionRef.current = {
        x: controlBoxFrame.x,
        y: controlBoxFrame.y
      };
    },
    onDragEnd() {
      beginningPositionRef.current = null;
    },

    onDrag({ dx, dy }) {
      if (elements.length === 0) {
        return;
      }

      // move control box
      beginningPositionRef.current!.x += dx;
      beginningPositionRef.current!.y += dy;

      const event: OnDragEvent = {
        elements: [],
        controlBoxPosition: { ...beginningPositionRef.current! }
      };

      // move elements
      for (let i = 0; i < elements.length; i++) {
        event.elements.push({
          id: elements[i].id,
          frame: {
            ...elements[i].frame,
            x: elements[i].frame.x + dx,
            y: elements[i].frame.y + dy
          }
        });
      }

      if (onDrag) {
        onDrag(event);
      }
    }
  });
};

type Frame = {
  width: number;
  height: number;
  x: number;
  y: number;
};

type OnDragEvent = {
  controlBoxPosition: { x: number; y: number };
  elements: { id: number; frame: Frame }[];
};
