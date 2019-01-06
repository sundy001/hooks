export const getFrameStyle = (frame, angle?: number) => ({
  width: `${frame.width}px`,
  height: `${frame.height}px`,
  transform:
    `translate(${frame.x}px, ${frame.y}px)` +
    (angle !== undefined ? ` rotate(${angle}rad)` : "")
});
