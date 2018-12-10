import Victor from "victor";
import { useRef } from "react";
import { useDragAndDrop } from "./useDragAndDrop";
import {
  RECT_VERTICES,
  indexOfOppositeVertex,
  vertexOfOriginRect,
  resolvePosition,
  indexesOfEdge
} from "../math/rect";
import { minDistanceFromVertexToLine } from "../math/vector";
import { transform, frameDisplament } from "../math/affineTransformation";

export const useResize = (
  position,
  frame,
  angle,
  keepAsepectRatio,
  { onMouseDown, onResizeStart, onResize, onResizeEnd } = {}
) => {
  const stateRef = useRef({
    beginningWidth: null,
    beginningHeight: null
  });

  const callCallbackIfExist = (callback, event, frame) => {
    const { beginningWidth, beginningHeight } = stateRef.current;

    callback({
      ...event,
      frame,
      beginningWidth,
      beginningHeight
    });
  };

  return useDragAndDrop({
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

      let virtualPosition;
      if (keepAsepectRatio) {
        virtualPosition = mousePositionKeepAspectRatio(
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
          : axisDistance(
              vertical,
              frame,
              angle,
              virtualPosition.x,
              virtualPosition.y
            );

      let newWidth;
      if (keepAsepectRatio) {
        const { beginningWidth, beginningHeight } = stateRef.current;
        newWidth = (newHeight * beginningWidth) / beginningHeight;
      } else {
        newWidth =
          horizontal === null
            ? frame.width
            : axisDistance(horizontal, frame, angle, pageX, pageY);
      }

      const { x: newX, y: newY } = newXY(
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

const mousePositionKeepAspectRatio = (position, frame, angle, mX, mY) => {
  const index = RECT_VERTICES.indexOf(position);
  const oppositeIndex = indexOfOppositeVertex(index);
  const [vertex, oppositeVertex] = [index, oppositeIndex].map(i =>
    transform(vertexOfOriginRect(i, frame.width, frame.height), frame, angle)
  );

  const axis = vertex
    .clone()
    .subtract(oppositeVertex)
    .normalize();

  const distance = axis.dot(new Victor(mX, mY)) - axis.dot(oppositeVertex);

  return axis
    .clone()
    .multiply(new Victor(distance, distance))
    .add(oppositeVertex);
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

const newXY = (position, frame, angle, hDistance, vDistance) => {
  const positionIndex = RECT_VERTICES.indexOf(position);
  const oppositeIndex = indexOfOppositeVertex(positionIndex);
  const oppositeVertex = transform(
    vertexOfOriginRect(oppositeIndex, frame.width, frame.height),
    frame,
    angle
  );

  return frameDisplament(
    vertexOfOriginRect(oppositeIndex, hDistance, vDistance), //  raw vertex
    hDistance,
    vDistance,
    angle,
    oppositeVertex // target vertex
  );
};
