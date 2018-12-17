import { verticesOfElement } from "../element";
import { HORIZONTAL, VERTICAL, normalizeNormal } from "./vector";

export const isOverlapByAABB = (vertices1, vertices2) =>
  vertices1[3].x < vertices2[1].x &&
  vertices1[1].x > vertices2[3].x &&
  vertices1[3].y < vertices2[1].y &&
  vertices1[1].y > vertices2[3].y;

export const overlapCache = elements =>
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
  });

export const overlapedIdsByCache = (comparedVertices, overlapCache) => {
  const overlapedIds = [];

  overlapCache.forEach(row => {
    let isOverlap;
    const { id, vertices, angle, axes } = row;
    if (angle === 0) {
      isOverlap = isOverlapByAABB(comparedVertices, vertices);
    } else {
      // Separating Axis Theorem is used to detect rotated rectangles
      // ref: http://www.dyn4j.org/2010/01/sat/#sat-top
      // ref: https://gamedevelopment.tutsplus.com/tutorials/collision-detection-using-the-separating-axis-theorem--gamedev-169
      isOverlap = [HORIZONTAL, VERTICAL].every(axis => {
        const p1 = projectionOfPolygron(comparedVertices, axis);
        const p2 = projectionOfPolygron(vertices, axis);
        return isProjectionOverlap(p1, p2);
      });

      if (isOverlap) {
        isOverlap = axes.every(axis => {
          const p1 = projectionOfPolygron(comparedVertices, axis);
          const p2 = projectionOfPolygron(vertices, axis);
          return isProjectionOverlap(p1, p2);
        });
      }
    }

    if (isOverlap) {
      overlapedIds.push(id);
    }
  });

  return overlapedIds;
};

const projectionOfPolygron = (vertices, axis) => {
  let min = axis.dot(vertices[0]);
  let max = min;
  vertices.forEach(vertex => {
    // NOTE: the axis must be normalized to get accurate projections
    const p = axis.dot(vertex);
    if (p < min) {
      min = p;
    } else if (p > max) {
      max = p;
    }
  });

  return {
    min,
    max
  };
};

const isProjectionOverlap = (p1, p2) => p2.max >= p1.min && p1.max >= p2.min;
