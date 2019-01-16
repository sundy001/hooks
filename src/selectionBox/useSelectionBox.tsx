import { MouseEvent, useRef } from "react";
import Victor from "victor";
import { useDrag } from "../hooks/useDrag";
import { getOverlapCache, detectOverlapByCache } from "../overlapDetection";
import { DeepReadonlyArray } from "../utilType";

export const useSelectionBox = (
  shouldSelect: (event: MouseEvent) => boolean,
  elements: DeepReadonlyArray<{
    id: number;
    frame: Frame;
    angle: number;
    page: number;
  }>,
  {
    zoom = 1,
    getOffset,
    onSelect,
    onSelectEnd
  }: {
    zoom?: number;
    getOffset?: (page: number) => { x: number; y: number };
    onSelect?: (event: { selectedElements: number[]; frame: Frame }) => void;
    onSelectEnd?: (selectedElements: number[]) => void;
  } = {}
) => {
  const stateRef = useRef<{
    shouldSelect: boolean | null;
    beginningX: number | null;
    beginningY: number | null;
    overlapCache: any;
    selectedElements: number[] | null;
  }>({
    shouldSelect: null,
    beginningX: null,
    beginningY: null,
    overlapCache: null,
    selectedElements: null
  });

  const [selectBoxMouseDown, selectBoxMouseMove, selectBoxMouseUp] = useDrag({
    onMouseDown({ original }) {
      const state = stateRef.current;
      state.shouldSelect = shouldSelect(original);
      state.beginningX = original.pageX;
      state.beginningY = original.pageY;
    },
    onMouseUp(event) {
      const state = stateRef.current;
      state.shouldSelect = null;
      state.beginningX = event.original.pageX;
      state.beginningY = event.original.pageY;
    },

    shouldDrag() {
      return stateRef.current.shouldSelect!;
    },

    onDragStart() {
      const offsettedElements = elements.map(({ id, frame, angle, page }) => {
        const offset = getOffset ? getOffset(page) : { x: 0, y: 0 };
        return {
          id,
          frame: {
            ...frame,
            x: frame.x * zoom + offset.x,
            y: frame.y * zoom + offset.y
          },
          angle
        };
      });
      stateRef.current.overlapCache = getOverlapCache(offsettedElements);
    },
    onDragEnd() {
      if (onSelectEnd) {
        onSelectEnd(stateRef.current.selectedElements!);
      }
      stateRef.current.selectedElements = null;
      stateRef.current.overlapCache = null;
    },

    onDrag({ original }) {
      const { pageX, pageY } = original;
      const { beginningX, beginningY, overlapCache } = stateRef.current;
      const { vertices: selectionVertices, size } = verticesOfRect(
        { x: beginningX!, y: beginningY! },
        { x: pageX, y: pageY }
      );

      const selectedElements = detectOverlapByCache(
        selectionVertices,
        overlapCache
      );
      stateRef.current.selectedElements = selectedElements;

      const frame = {
        x: selectionVertices[3].x,
        y: selectionVertices[3].y,
        width: size.width,
        height: size.height
      };

      if (onSelect) {
        onSelect({ selectedElements, frame });
      }
    }
  });

  return { selectBoxMouseDown, selectBoxMouseMove, selectBoxMouseUp };
};

const verticesOfRect = (fix: Position, diagonal: Position) => {
  const vertices: [Victor, Victor, Victor, Victor] = [] as any;
  vertices[3] = new Victor(
    Math.min(fix.x, diagonal.x),
    Math.min(fix.y, diagonal.y)
  );
  vertices[1] = new Victor(
    Math.max(fix.x, diagonal.x),
    Math.max(fix.y, diagonal.y)
  );

  const size = vertices[1].clone().subtract(vertices[3]);
  vertices[0] = vertices[3].clone().addX(size);
  vertices[2] = vertices[3].clone().addY(size);

  return {
    size: {
      width: size.x,
      height: size.y
    },
    vertices
  };
};

type Position = Readonly<{ x: number; y: number }>;

type Frame = {
  width: number;
  height: number;
  x: number;
  y: number;
};
