import Victor from "victor";
import { vertexOfOriginRect } from "./rect";

// reference: https://gamedev.stackexchange.com/questions/16719/what-is-the-correct-order-to-multiply-scale-rotation-and-translation-matrices-f
export const transform = (vertex, { x, y, width, height }, angle) => {
  const translate = new Victor(x, y);
  if (angle === 0) {
    return vertex.clone().add(translate);
  }

  const half = new Victor(width / 2, height / 2);
  return (
    vertex
      .clone()
      // rotate element by angle at origin
      .subtract(half)
      .rotate(angle)
      .add(half)
      // translate element
      .add(translate)
  );
};

// TODO: rename rotationTransform and frameDisplament
export const rotationTransform = (
  controlBoxOffset,
  { width, height }, // size of element
  elementAngle,
  controlBoxFrame,
  controlBoxAngle
) => {
  const elementHalfSize = new Victor(width / 2, height / 2);
  const controlBoxHalfSize = new Victor(
    controlBoxFrame.width / 2,
    controlBoxFrame.height / 2
  );

  // rotate element at origin
  const rotatedOrigin = vertexOfOriginRect(7, width, height)
    .subtract(elementHalfSize)
    .rotate(elementAngle + controlBoxAngle)
    .add(elementHalfSize);

  return (
    vertexOfOriginRect(7, width, height)
      // rotate element by element angle at origin
      .subtract(elementHalfSize)
      .rotate(elementAngle)
      .add(elementHalfSize)
      // move according control box coordinate system
      .add(controlBoxOffset)
      // rotate control box by control box angle at origin
      .subtract(controlBoxHalfSize)
      .rotate(controlBoxAngle)
      .add(controlBoxHalfSize)
      // translate control box
      .add(new Victor(controlBoxFrame.x, controlBoxFrame.y))
      // compare rotated element at origin
      .subtract(rotatedOrigin)
  );
};

export const frameDisplament = (vertex, width, height, angle, target) => {
  const half = new Victor(width / 2, height / 2);

  // rotate element at origin
  const rotatedOrigin = vertex
    .clone()
    .subtract(half)
    .rotate(angle)
    .add(half);

  // compare rotated element at origin
  return target.clone().subtract(rotatedOrigin);
};
