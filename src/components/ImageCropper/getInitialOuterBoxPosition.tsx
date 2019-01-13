import Victor from "victor";

import { Frame } from "./type";

import { transform, getDisplacement } from "../../math/affineTransformation";

const TOP_LEFT = new Victor(0, 0);

export const getInitialOuterBoxPosition = (
  frame: Frame,
  imageFrame: Frame,
  angle: number
) => () => {
  const { x, y, width, height } = imageFrame;
  const offset = new Victor(x, y);
  offset.rotate(angle);

  const targetVertex = transform(TOP_LEFT, frame, angle);
  targetVertex.add(offset);

  return getDisplacement(
    TOP_LEFT, //  raw vertex
    width,
    height,
    angle,
    targetVertex // target vertex
  );
};
