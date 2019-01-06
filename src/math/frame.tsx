import Victor from "victor";

export const sizeOfRectVertices = (topLeft: Victor, bottomRight: Victor) => {
  const { x: width, y: height } = bottomRight.clone().subtract(topLeft);
  return { width, height };
};

export const verticesOfRect = (fix: Position, diagonal: Position) => {
  const vertices: [Victor, Victor, Victor, Victor] = [] as any;
  vertices[3] = new Victor(
    Math.min(fix.x, diagonal.x),
    Math.min(fix.y, diagonal.y)
  );
  vertices[1] = new Victor(
    Math.max(fix.x, diagonal.x),
    Math.max(fix.y, diagonal.y)
  );

  const size = sizeOfRectVertices(vertices[3], vertices[1]);
  const sizeVictor = new Victor(size.width, size.height);
  vertices[0] = vertices[3].clone().addX(sizeVictor);
  vertices[2] = vertices[3].clone().addY(sizeVictor);

  return {
    size,
    vertices
  };
};

export const multiple = (
  { x, y, width, height }: Frame,
  scale: number
): Frame => ({
  x: x * scale,
  y: y * scale,
  width: width * scale,
  height: height * scale
});

type Position = { x: number; y: number };
type Frame = { x: number; y: number; width: number; height: number };
