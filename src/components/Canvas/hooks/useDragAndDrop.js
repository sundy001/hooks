import { useRef } from "react";
import { useDragAndDrop } from "../../../hook/useDragAndDrop";
import { updateControlBox, updateElement } from "../CanvasAction";

export default (dispatch, elementStore, selections, controlBoxFrame) => {
  const stateRef = useRef({
    previousPoint: null,
    beginningFrame: null
  });

  const [dragMouseDown, dragMouseMove, dragMouseUp] = useDragAndDrop({
    onMouseDown({ original }) {
      original.stopPropagation();

      stateRef.current.previousPoint = { x: original.pageX, y: original.pageY };
    },
    onDragStart() {
      stateRef.current.beginningFrame = { ...controlBoxFrame };
    },
    onDrag({ original }) {
      const { previousPoint, beginningFrame } = stateRef.current;

      const { pageX, pageY } = original;
      const dx = pageX - previousPoint.x;
      const dy = pageY - previousPoint.y;
      previousPoint.x = pageX;
      previousPoint.y = pageY;

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

      beginningFrame.x += dx;
      beginningFrame.y += dy;
      dispatch(updateControlBox({ frame: { ...beginningFrame } }));
    },
    onMouseUp() {
      stateRef.current.previousPoint = null;
    },
    onDragEnd() {
      stateRef.current.beginningFrame = null;
    }
  });

  return { dragMouseDown, dragMouseMove, dragMouseUp };
};
