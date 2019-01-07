export const getFrameStyle = (
  frame: { width: number; height: number; x: number; y: number },
  angle?: number
) => ({
  width: `${frame.width}px`,
  height: `${frame.height}px`,
  transform:
    `translate(${frame.x}px, ${frame.y}px)` +
    (angle !== undefined ? ` rotate(${angle}rad)` : "")
});
