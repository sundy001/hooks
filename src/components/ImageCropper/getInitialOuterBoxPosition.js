import Victor from "victor";
import { transform, frameDisplacement } from "../../math/affineTransformation";

export const getInitialOuterBoxPosition = (frame, imageFrame, angle) => () => {
  const { x, y, width, height } = imageFrame;
  const offset = new Victor(x, y);
  offset.rotate(angle);

  const targetVertex = transform(new Victor(0, 0), frame, angle);
  targetVertex.add(offset);

  return frameDisplacement(
    new Victor(0, 0), //  raw vertex
    width,
    height,
    angle,
    targetVertex // target vertex
  );
};
