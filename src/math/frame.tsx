export const multiple = (
  { x, y, width, height }: Readonly<Frame>,
  scale: number
): Frame => ({
  x: x * scale,
  y: y * scale,
  width: width * scale,
  height: height * scale
});

type Frame = { x: number; y: number; width: number; height: number };
