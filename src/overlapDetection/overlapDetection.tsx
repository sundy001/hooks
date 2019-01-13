import Victor from "victor";
import { HORIZONTAL, VERTICAL, normalizeNormal } from "./vector";
import { transform } from "../math/affineTransformation";
import { CORNER_INDEXES, vertexOfOriginRect } from "../math/rect";

export const isOverlapByAABB = (
  vertices1: VictorTuple,
  vertices2: VictorTuple
) =>
  vertices1[3].x < vertices2[1].x &&
  vertices1[1].x > vertices2[3].x &&
  vertices1[3].y < vertices2[1].y &&
  vertices1[1].y > vertices2[3].y;

export const getOverlapCache = (
  elements: ReadonlyArray<
    Readonly<{
      id: number;
      frame: Readonly<Frame>;
      angle: number;
    }>
  >
) =>
  elements.map(element => {
    const vertices = verticesOfElement(element);
    const axes =
      element.angle === 0
        ? []
        : [
            normalizeNormal(vertices[0], vertices[1]),
            normalizeNormal(vertices[1], vertices[2])
          ];

    return {
      id: element.id,
      angle: element.angle,
      vertices,
      axes
    };
  }) as OverlapCache;

export const detectOverlapByCache = (
  comparedVertices: VictorTuple,
  overlapCache: OverlapCache
) => {
  const overlapedIds: number[] = [];

  for (let i = 0; i < overlapCache.length; i++) {
    const row = overlapCache[i];
    let isOverlap: boolean;
    const { id, vertices, angle, axes } = row;
    if (angle === 0) {
      isOverlap = isOverlapByAABB(comparedVertices, vertices);
    } else {
      // Separating Axis Theorem is used to detect rotated rectangles
      // ref: http://www.dyn4j.org/2010/01/sat/#sat-top
      // ref: https://gamedevelopment.tutsplus.com/tutorials/collision-detection-using-the-separating-axis-theorem--gamedev-169
      isOverlap = [HORIZONTAL, VERTICAL].every(axis => {
        const p1 = getProjectionOfPolygron(comparedVertices, axis);
        const p2 = getProjectionOfPolygron(vertices, axis);
        return isProjectionOverlap(p1, p2);
      });

      if (isOverlap) {
        isOverlap = axes.every(axis => {
          const p1 = getProjectionOfPolygron(comparedVertices, axis);
          const p2 = getProjectionOfPolygron(vertices, axis);
          return isProjectionOverlap(p1, p2);
        });
      }
    }

    if (isOverlap) {
      overlapedIds.push(id);
    }
  }

  return overlapedIds;
};

const getProjectionOfPolygron = (
  vertices: ReadonlyArray<RVictor>,
  axis: RVictor
) => {
  let min = axis.dot(vertices[0]);
  let max = min;
  for (let i = 0; i < vertices.length; i++) {
    // NOTE: the axis must be normalized to get accurate projections
    const p = axis.dot(vertices[i]);
    if (p < min) {
      min = p;
    } else if (p > max) {
      max = p;
    }
  }

  return {
    min,
    max
  };
};

const isProjectionOverlap = (
  p1: Readonly<{ min: number; max: number }>,
  p2: Readonly<{ min: number; max: number }>
) => p2.max >= p1.min && p1.max >= p2.min;

export const verticesOfElement = ({
  frame,
  angle
}: {
  frame: Frame;
  angle: number;
}) =>
  CORNER_INDEXES.map(index =>
    transform(
      vertexOfOriginRect(index, frame.width, frame.height),
      frame,
      angle
    )
  ) as VictorTuple;

type RVictor = Readonly<Victor>;

type VictorTuple = [RVictor, RVictor, RVictor, RVictor];

type Frame = Readonly<{
  width: number;
  height: number;
  x: number;
  y: number;
}>;

type OverlapCache = ReadonlyArray<{
  id: number;
  angle: number;
  vertices: VictorTuple;
  axes: ReadonlyArray<Victor>;
}>;
