import Victor from "victor";
import { useRef } from "react";
import { useDrag } from "./useDrag";
import {
  RECT_VERTICES,
  indexOfOppositeVertex,
  vertexOfOriginRect,
  resolvePosition,
  indexesOfEdge
} from "../math/rect";
import { transform, getDisplacement } from "../math/affineTransformation";

export const useResize = (
  position,
  frame,
  angle,
  shouldKeepAsepectRatio,
  { onMouseDown, onResizeStart, onResize, onResizeEnd } = {}
) => {
  const stateRef = useRef({
    beginningWidth: null,
    beginningHeight: null
  });

  const callCallbackIfExist = (callback, event, frame) => {
    if (!callback) {
      return;
    }

    const { beginningWidth, beginningHeight } = stateRef.current;

    callback({
      ...event,
      frame,
      beginningWidth,
      beginningHeight
    });
  };

  return useDrag({
    onMouseDown(event) {
      // TODO: check position and keepAsepectRatio compatability
      if (onMouseDown) {
        callCallbackIfExist(onMouseDown, event);
      }
    },
    onDragStart(event) {
      const state = stateRef.current;
      state.beginningWidth = frame.width;
      state.beginningHeight = frame.height;

      if (onResizeStart) {
        callCallbackIfExist(onResizeStart, event);
      }
    },
    onDrag(event) {
      const { pageX, pageY } = event.original;
      const { vertical, horizontal } = resolvePosition(position);
      const keepAsepectRatio =
        vertical !== null && horizontal !== null && shouldKeepAsepectRatio;

      let virtualPosition;
      if (keepAsepectRatio) {
        virtualPosition = getMousePositionKeepAspectRatio(
          position,
          frame,
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
                frame,
                angle,
                virtualPosition.x,
                virtualPosition.y
              )
            );

      let newWidth;
      if (keepAsepectRatio) {
        const { beginningWidth, beginningHeight } = stateRef.current;
        newWidth = (newHeight * beginningWidth) / beginningHeight;
      } else {
        newWidth =
          horizontal === null
            ? frame.width
            : Math.trunc(axisDistance(horizontal, frame, angle, pageX, pageY));
      }

      const { x: newX, y: newY } = getNewPosition(
        position,
        frame,
        angle,
        newWidth,
        newHeight
      );

      if (onResize) {
        const frame = { x: newX, y: newY, width: newWidth, height: newHeight };
        callCallbackIfExist(onResize, event, frame);
      }
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

const getMousePositionKeepAspectRatio = (position, frame, angle, mX, mY) => {
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
  // subtraction result is distance(scalar) between mouse and opposite vertex
  const distance = axis.dot(mousePosition) - axis.dot(oppositeVertex);

  return axis.multiply(new Victor(distance, distance)).add(oppositeVertex);
};

const axisDistance = (token, frame, angle, mX, mY) => {
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
const getNewPosition = (position, frame, angle, hDistance, vDistance) => {
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
export const minDistanceFromVertexToLine = (v, w, p) => {
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
