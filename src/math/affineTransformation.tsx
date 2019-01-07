import Victor from "victor";

// transform the given vertex to actual cordination system
// ref: https://gamedev.stackexchange.com/questions/16719/what-is-the-correct-order-to-multiply-scale-rotation-and-translation-matrices-f
export const transform = (
  vertex: RVictor,
  { x, y, width, height }: Frame,
  angle: number
) => {
  const half = new Victor(width / 2, height / 2);

  return (
    vertex
      .clone()
      // rotate vertex by angle at origin
      .subtract(half)
      .rotate(angle)
      .add(half)
      // translate vertex
      .add(new Victor(x, y))
  );
};

export const getDisplacementInControlBox = (
  elementOffset: RVictor, // element position in control box coordinate system
  { width, height }: Readonly<{ width: number; height: number }>, // size of element
  elementAngle: number,
  controlBoxFrame: Frame,
  controlBoxAngle: number
) => {
  const elementHalfSize = new Victor(width / 2, height / 2);
  const controlBoxHalfSize = new Victor(
    controlBoxFrame.width / 2,
    controlBoxFrame.height / 2
  );

  // rotate vertex by the total angle (element angle + control box angle)
  const rotatedOrigin = new Victor(0, 0)
    .subtract(elementHalfSize)
    .rotate(elementAngle + controlBoxAngle)
    .add(elementHalfSize);

  return (
    new Victor(0, 0)
      // rotate vertex by element angle at origin
      .subtract(elementHalfSize)
      .rotate(elementAngle)
      .add(elementHalfSize)
      // move vertex by element position in control box coordinate system
      .add(elementOffset)
      // rotate vertex by control box angle at origin
      .subtract(controlBoxHalfSize)
      .rotate(controlBoxAngle)
      .add(controlBoxHalfSize)
      // translate vertex by control box position
      .add(new Victor(controlBoxFrame.x, controlBoxFrame.y))
      // compare rotated vertex at origin
      .subtract(rotatedOrigin)
  );
};

export const getDisplacement = (
  rawVertex: RVictor,
  width: number,
  height: number,
  angle: number,
  targetVertex: RVictor
) => {
  const half = new Victor(width / 2, height / 2);

  // rotate vertex at origin
  const rotatedRawVertex = rawVertex
    .clone()
    .subtract(half)
    .rotate(angle)
    .add(half);

  // compare target vertex with the rotated vertex
  return targetVertex.clone().subtract(rotatedRawVertex);
};

type Frame = Readonly<{ x: number; y: number; width: number; height: number }>;
type RVictor = Readonly<Victor>;
