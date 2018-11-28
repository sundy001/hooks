import { transform } from "./math/affineTransformation";
import { CORNER_INDEXES, vertexOfOriginRect } from "./math/rect";

export const verticesOfElement = ({ frame, angle }) =>
  CORNER_INDEXES.map(index =>
    transform(
      vertexOfOriginRect(index, frame.width, frame.height),
      frame,
      angle
    )
  );

export const createSelection = element => ({
  id: element.id,
  vertices: verticesOfElement(element)
});
