import { useRef } from "react";
import { useDragAndDrop } from "./useDragAndDrop";
import Victor from "victor";
import {
  RECT_VERTICES,
  indexesOfOppositeEdge,
  indexOfOppositeVertex,
  vertexOfOriginRect,
  resolvePosition
} from "../math/rect";
import { minDistanceFromVertexToLine } from "../vector";
import { transform, frameDisplament } from "../math/affineTransformation";

export const useResize = (
  position,
  frame,
  angle,
  { onMouseDown, onResize, onResizeEnd } = {}
) => {
  const stateRef = useRef({
    beginingWidth: null,
    beginingHeight: null
  });

  const callCallbackIfExist = (callback, event, frame) => {
    const { beginingWidth, beginingHeight } = stateRef.current;

    callback({
      ...event,
      frame,
      beginingWidth,
      beginingHeight
    });
  };

  return useDragAndDrop({
    onMouseDown(event) {
      if (onMouseDown) {
        callCallbackIfExist(onMouseDown, event);
      }

      const state = stateRef.current;
      state.beginingWidth = frame.width;
      state.beginingHeight = frame.height;
    },
    onDrag(event) {
      const {
        original: { pageX, pageY }
      } = event;
      const { vertical, horizontal } = resolvePosition(position);
      const { beginingWidth, beginingHeight } = stateRef.current;
      const beginingWHRatio = beginingWidth / beginingHeight;

      let newHeight =
        vertical === null
          ? frame.height
          : axisDistance(vertical, frame, angle, pageX, pageY);


      let newWidth =
        horizontal === null
          ? frame.width
          : axisDistance(horizontal, frame, angle, pageX, pageY);

      // TODO keep ratio and resize 
      // const newWHRatio = newWidth / newHeight;
      // const diff = newWHRatio - beginingWHRatio;
      // console.log(diff);
      // if (diff > 0) {
      //   console.log("a");
      //   newWidth = newHeight * beginingWHRatio;
      // } else if (diff < 0) {
      //   console.log({width: newWidth, height: newHeight, newHeight: newWidth / beginingWHRatio});
      //   newWidth = Math.min(newHeight, newWidth) * beginingWHRatio;
      //   newHeight = newWidth / beginingWHRatio;
      // }

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
      state.beginingWidth = null;
      state.beginingHeight = null;
    }
  });
};

const axisDistance = (token, frame, angle, mX, mY) => {
  const index = RECT_VERTICES.indexOf(token);

  const edgeVertices = indexesOfOppositeEdge(index).map(i =>
    transform(vertexOfOriginRect(i, frame.width, frame.height), frame, angle)
  );

  console.log(edgeVertices[0], edgeVertices[1])

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
