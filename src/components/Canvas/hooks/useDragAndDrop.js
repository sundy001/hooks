import { useRef } from "react";
import { useDragAndDrop } from "../../../hook/useDragAndDrop";
import { updateControlBox, updateElement } from "../CanvasAction";

export default (dispatch, elementStore, selections, controlBoxFrame) => {
  const beginingFrameRef = useRef(null);

  const [dragMouseDown, dragMouseMove, dragMouseUp] = useDragAndDrop({
    onMouseDown({ original }) {
      original.stopPropagation();
    },
    onDrag({ dx, dy }) {
      if (beginingFrameRef.current === null) {
        beginingFrameRef.current = { ...controlBoxFrame };
      }

      // move elements
      selections.forEach(({ id }) => {
        const frame = elementStore.byId[id].frame;
        const newFrame = {
          ...frame,
          x: frame.x + dx,
          y: frame.y + dy
        };

        dispatch(updateElement(id, { frame: newFrame }));
      });

      // move control box
      const beginingFrame = beginingFrameRef.current;
      beginingFrame.x += dx;
      beginingFrame.y += dy;
      dispatch(updateControlBox({ frame: { ...beginingFrame } }));
    },
    onDragEnd() {
      beginingFrameRef.current = null;
    }
  });

  return { dragMouseDown, dragMouseMove, dragMouseUp };
};
