import Victor from "victor";
import { useRawDragAndDrop } from "../../../hooks/useRawDragAndDrop";
import { Frame } from "../type";

export const useDragAndDrop = (
  setImageFrame: (frame: Frame) => void,
  setOuterPosition: (position: Victor) => void,
  onDragMouseEnd: () => void,
  imageFrame: Frame,
  outerBoxPosition: Readonly<{ x: number; y: number }>,
  angle: number,
  zoom: number
) => {
  return useRawDragAndDrop({
    zoom,
    shouldDrag(event) {
      return (event.target as HTMLElement).classList.contains(
        "image-container__image"
      );
    },
    onDrag({ dx, dy }) {
      const imageFrameOffset = new Victor(dx, dy).rotate(-angle);

      setImageFrame({
        ...imageFrame,
        x: imageFrame.x + imageFrameOffset.x,
        y: imageFrame.y + imageFrameOffset.y
      });

      setOuterPosition(
        new Victor(outerBoxPosition.x + dx, outerBoxPosition.y + dy)
      );
    },
    onDragEnd() {
      onDragMouseEnd();
    }
  });
};
