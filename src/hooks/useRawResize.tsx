import Victor from "victor";
import { useRef } from "react";
import { useDrag } from "./useDrag";
import {
  RECT_VERTICES,
  Position,
  indexOfOppositeVertex,
  vertexOfOriginRect,
  resolvePosition,
  indexesOfEdge
} from "../math/rect";
import { transform, getDisplacement } from "../math/affineTransformation";
import { multiple } from "../math/frame";

export const useRawResize = (
  position: Position,
  frame: Readonly<Frame>,
  angle: number,
  shouldKeepAspectRatio: boolean,
  {
    zoom = 1,
    getOffset,
    onResizeStart,
    onResize,
    onResizeEnd
  }: {
    zoom?: number;
    getOffset?: (event: { original: MouseEvent }) => { x: number; y: number };
    onResizeStart?: (event: { original: MouseEvent }) => void;
    onResize?: (
      event: {
        original: MouseEvent;
        frame: Frame;
        wRatio: number;
        hRatio: number;
      }
    ) => void;
    onResizeEnd?: (event: { original: MouseEvent }) => void;
  } = {}
) => {
  const stateRef = useRef<{
    beginningWidth: number | null;
    beginningHeight: number | null;
  }>({
    beginningWidth: null,
    beginningHeight: null
  });

  const callCallbackIfExist = (
    callback: any,
    event: { original: MouseEvent },
    frame?: Frame
  ) => {
    if (!callback) {
      return;
    }

    if (frame) {
      const { beginningWidth, beginningHeight } = stateRef.current;
      const wRatio = frame.width / beginningWidth!;
      const hRatio = frame.height / beginningHeight!;

      callback({
        ...event,
        frame,
        wRatio,
        hRatio
      });
    } else {
      callback(event);
    }
  };

  return useDrag({
    onDragStart(event) {
      const state = stateRef.current;
      state.beginningWidth = frame.width;
      state.beginningHeight = frame.height;

      if (onResizeStart) {
        callCallbackIfExist(onResizeStart, event);
      }
    },
    onDrag(event) {
      const offset = getOffset ? getOffset(event) : { x: 0, y: 0 };
      const pageX = event.original.pageX - offset.x;
      const pageY = event.original.pageY - offset.y;
      const { vertical, horizontal } = resolvePosition(position);
      const keepAspectRatio =
        vertical !== null && horizontal !== null && shouldKeepAspectRatio;
      const scaledFrame = multiple(frame, zoom);

      let virtualPosition: { x: number; y: number };
      if (keepAspectRatio) {
        virtualPosition = getMousePositionKeepAspectRatio(
          position,
          scaledFrame,
          angle,
          pageX,
          pageY
        );
      } else {
        virtualPosition = { x: pageX, y: pageY };
      }

      const newHeight =
        vertical === null
          ? frame.height
          : Math.trunc(
              axisDistance(
                vertical,
                scaledFrame,
                angle,
                virtualPosition.x,
                virtualPosition.y
              ) / zoom
            );

      let newWidth: number;
      if (keepAspectRatio) {
        newWidth =
          (newHeight * stateRef.current.beginningWidth!) /
          stateRef.current.beginningHeight!;
      } else {
        newWidth =
          horizontal === null
            ? frame.width
            : Math.trunc(
                axisDistance(horizontal, scaledFrame, angle, pageX, pageY) /
                  zoom
              );
      }

      const { x: newX, y: newY } = getNewPosition(
        position,
        frame,
        angle,
        newWidth,
        newHeight
      );

      callCallbackIfExist(onResize, event, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      });
    },
    onDragEnd(event) {
      if (onResizeEnd) {
        callCallbackIfExist(onResizeEnd, event);
      }

      const state = stateRef.current;
      state.beginningWidth = null;
      state.beginningHeight = null;
    }
  });
};

const getMousePositionKeepAspectRatio = (
  position: Position,
  frame: Readonly<Frame>,
  angle: number,
  mX: number,
  mY: number
) => {
  const index = RECT_VERTICES.indexOf(position);
  const oppositeIndex = indexOfOppositeVertex(index);
  const [vertex, oppositeVertex] = [index, oppositeIndex].map(i =>
    transform(vertexOfOriginRect(i, frame.width, frame.height), frame, angle)
  );

  // calculate normalized diagonal vector
  const axis = vertex
    .clone()
    .subtract(oppositeVertex)
    .normalize();

  const mousePosition = new Victor(mX, mY);
  // axis.dot(mousePosition): length of mouse position project on diagonal axis
  // axis.dot(oppositeVertex): length of opposite vertex project on diagonal axis
  // subtraction is distance(scalar) between mouse and opposite vertex
  const distance = axis.dot(mousePosition) - axis.dot(oppositeVertex);

  return axis.multiply(new Victor(distance, distance)).add(oppositeVertex);
};

const axisDistance = (
  token: Position,
  frame: Readonly<Frame>,
  angle: number,
  mX: number,
  mY: number
) => {
  const index = RECT_VERTICES.indexOf(token);
  const oppositeIndex = indexOfOppositeVertex(index);
  const edgeVertices = indexesOfEdge(oppositeIndex).map(i =>
    transform(vertexOfOriginRect(i, frame.width, frame.height), frame, angle)
  );

  return minDistanceFromVertexToLine(
    edgeVertices[0],
    edgeVertices[1],
    new Victor(mX, mY)
  );
};

// base of the fact that the opposite vertex of the resize handler does not change position
// calculate the new position of element
const getNewPosition = (
  position: Position,
  frame: Readonly<Frame>,
  angle: number,
  hDistance: number,
  vDistance: number
) => {
  const positionIndex = RECT_VERTICES.indexOf(position);
  const oppositeIndex = indexOfOppositeVertex(positionIndex);
  const oppositeVertex = transform(
    vertexOfOriginRect(oppositeIndex, frame.width, frame.height),
    frame,
    angle
  );

  return getDisplacement(
    vertexOfOriginRect(oppositeIndex, hDistance, vDistance), //  raw vertex
    hDistance,
    vDistance,
    angle,
    oppositeVertex // target vertex
  );
};

// reference: https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
// v, w are two ends of the line
// p is the vertex
export const minDistanceFromVertexToLine = (
  v: Victor,
  w: Victor,
  p: Victor
) => {
  const l2 = v.distanceSq(w);
  if (l2 === 0) return p.distance(v);

  const t = Math.max(
    0,
    Math.min(
      1,
      p
        .clone()
        .subtract(v)
        .dot(w.clone().subtract(v)) / l2
    )
  );
  const projection = v.clone().add(
    w
      .clone()
      .subtract(v)
      .multiply(new Victor(t, t))
  );
  return p.distance(projection);
};

export type Frame = {
  width: number;
  height: number;
  x: number;
  y: number;
};
