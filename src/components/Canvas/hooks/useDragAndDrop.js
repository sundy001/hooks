import { useRef } from "react";
import { useDragAndDrop } from "../../../hook/useDragAndDrop";
import { updateControlBox, updateElement } from "../CanvasAction";

export default (dispatch, elementStore, selections, controlBoxFrame) => {
  const beginningFrameRef = useRef(null);

  const [dragMouseDown, dragMouseMove, dragMouseUp] = useDragAndDrop({
    onMouseDown({ original }) {
      original.stopPropagation();
    },
    onDragStart() {
      beginningFrameRef.current = { ...controlBoxFrame };
    },
    onDrag({ dx, dy }) {
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
      const beginningFrame = beginningFrameRef.current;
      beginningFrame.x += dx;
      beginningFrame.y += dy;
      dispatch(updateControlBox({ frame: { ...beginningFrame } }));
    },
    onDragEnd() {
      beginningFrameRef.current = null;
    }
  });

  return { dragMouseDown, dragMouseMove, dragMouseUp };
};
