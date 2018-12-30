import Victor from "victor";
import { useDragAndDrop as useRawDragAndDrop } from "../../../hooks/useDragAndDrop";

export const useDragAndDrop = (
  setImageFrame,
  setOuterPosition,
  onDragMouseEnd,
  imageFrame,
  outerBoxPosition,
  angle
) => {
  return useRawDragAndDrop({
    onMouseDown({ original }) {
      original.stopPropagation();
    },
    onDrag({ dx, dy }) {
      const imageFrameOffset = new Victor(dx, dy).rotate(-angle);

      setImageFrame({
        ...imageFrame,
        x: imageFrame.x + imageFrameOffset.x,
        y: imageFrame.y + imageFrameOffset.y
      });

      setOuterPosition({
        x: outerBoxPosition.x + dx,
        y: outerBoxPosition.y + dy
      });
    },
    onDragEnd() {
      onDragMouseEnd();
    }
  });
};
