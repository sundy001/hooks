import Victor from "victor";
import { useRawDragAndDrop } from "../../../hooks/useRawDragAndDrop";

export const useDragAndDrop = (
  setImageFrame,
  setOuterPosition,
  onDragMouseEnd,
  imageFrame,
  outerBoxPosition,
  angle,
  zoom
) => {
  return useRawDragAndDrop({
    zoom,
    shouldDrag(event) {
      return event.target.classList.contains("image-container__image");
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
