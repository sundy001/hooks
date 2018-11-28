// TODO: write comment
// (x1, y1) is the middle point
export const angleOfThreePoints = (x0, y0, x1, y1, x2, y2) => {
  return Math.atan2(y0 - y1, x0 - x1) - Math.atan2(y2 - y1, x2 - x1);
};