import Victor from "victor";

export const RECT_VERTICES = [
  "top",
  "top-right",
  "right",
  "bottom-right",
  "bottom",
  "bottom-left",
  "left",
  "top-left"
];

export const ALL_INDEXES = [0, 1, 2, 3, 4, 5, 6, 7];

export const EDGE_INDEXES = [0, 2, 4, 6];

export const CORNER_INDEXES = [1, 3, 5, 7];

export const resolvePosition = vertex => {
  const token = vertex.split("-");
  let vertical = null;
  let horizontal = null;
  if (token.length === 1) {
    if (token[0] === "top" || token[0] === "bottom") {
      vertical = token[0];
    } else if (token[0] === "right" || token[0] === "left") {
      horizontal = token[0];
    }
  } else {
    vertical = token[0];
    horizontal = token[1];
  }

  return {
    vertical,
    horizontal
  };
};

export const indexesOfEdge = index => [
  (index + 1 + RECT_VERTICES.length) % RECT_VERTICES.length,
  (index - 1 + RECT_VERTICES.length) % RECT_VERTICES.length
];

export const indexOfOppositeVertex = index =>
  (index + 4 + RECT_VERTICES.length) % RECT_VERTICES.length;

export const vertexOfOriginRect = (index, width, height) => {
  switch (index) {
    case 0:
      return new Victor(width / 2, 0);
    case 1:
      return new Victor(width, 0);
    case 2:
      return new Victor(width, height / 2);
    case 3:
      return new Victor(width, height);
    case 4:
      return new Victor(width / 2, height);
    case 5:
      return new Victor(0, height);
    case 6:
      return new Victor(0, height / 2);
    case 7:
      return new Victor(0, 0);
    default:
      // TODO: write error
      throw new Error();
  }
};
