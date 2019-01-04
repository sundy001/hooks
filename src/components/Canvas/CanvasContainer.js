import "./Canvas.scss";
import React, { useCallback, memo } from "react";

import { ControlBox } from "../ControlBox";
import { SelectionBox } from "../SelectionBox";

import { updateElements } from "../App/actions";

import { emit } from "../../eventBus";
import { useResize } from "../../hooks/useResize";
import { useRotate } from "../../hooks/useRotate";
import { useDoubleClick } from "../../hooks/useDoubleClick";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { useSelect, setSelections } from "../../selections";
import { hideControlBox, updateControlBox } from "../../controlBox";
import {
  useSelectionBox,
  updateSelectionBox,
  hideSelectionBox
} from "../../selectionBox";

// TODO extract offset logic later
const toPageCoordinate = (nextElementStates, pageOffsetById) => {
  return nextElementStates.map(({ id, frame, angle }) => ({
    id,
    angle,
    frame: {
      ...frame,
      x: frame.x - pageOffsetById[id].x,
      y: frame.y - pageOffsetById[id].y
    }
  }));
};

export const CanvasContainer = memo(
  ({
    dispatch,
    elements,
    pageOffsetById,
    selectionIds,
    controlBox,
    selectionBoxFrame,
    resizeKeepAspectRatio,
    children
  }) => {
    const selectionById = {};
    for (let i = 0; i < selectionIds.length; i++) {
      selectionById[selectionIds[i]] = true;
    }

    const selection = [];
    const offsettedElements = [];
    for (let i = 0; i < elements.length; i++) {
      const { id, frame, angle } = elements[i];
      const element = {
        id,
        frame: {
          ...frame,
          x: frame.x + pageOffsetById[id].x,
          y: frame.y + pageOffsetById[id].y
        },
        angle
      };

      offsettedElements.push(element);

      if (selectionById[id]) {
        selection.push(element);
      }
    }

    // hooks
    const { selectMouseDown, selectMouseMove, selectMouseUp } = useSelect(
      dispatch,
      event =>
        event.target.classList.contains("canvas") ||
        event.target.classList.contains("page"),
      selectionIds,
      {
        onDeselect() {
          dispatch(hideControlBox());
        }
      }
    );

    const {
      doubleClickMouseDown,
      doubleClickMouseMove,
      doubleClickMouseUp
    } = useDoubleClick(id => {
      emit("doubleClick", { id });
    });

    const { dragMouseDown, dragMouseMove, dragMouseUp } = useDragAndDrop(
      event => Boolean(event.target.closest(".element")),
      selection,
      controlBox.frame,
      {
        onDrag({ elements, controlBoxPosition }) {
          elements = toPageCoordinate(elements, pageOffsetById);
          dispatch(updateElements(elements));
          dispatch(
            updateControlBox({
              frame: { ...controlBox.frame, ...controlBoxPosition }
            })
          );
        }
      }
    );

    const { rotateMouseDown, rotateMouseMove, rotateMouseUp } = useRotate(
      selection,
      controlBox.frame,
      controlBox.angle,
      {
        onRotate({ elements, controlBoxAngle }) {
          elements = toPageCoordinate(elements, pageOffsetById);
          dispatch(updateElements(elements));
          dispatch(
            updateControlBox({
              angle: controlBoxAngle
            })
          );
        }
      }
    );

    const { resizeMouseDown, resizeMouseMove, resizeMouseUp } = useResize(
      selection,
      controlBox.frame,
      controlBox.angle,
      resizeKeepAspectRatio,
      {
        onResizeStart({ elements, position }) {
          for (let i = 0; i < elements.length; i++) {
            emit("resizeStart", {
              id: elements[i].id,
              position: position
            });
          }
        },
        onResize({ elements, controlBoxFrame, position }) {
          elements = toPageCoordinate(elements, pageOffsetById);
          dispatch(updateElements(elements));
          dispatch(
            updateControlBox({
              frame: controlBoxFrame
            })
          );

          for (let i = 0; i < elements.length; i++) {
            emit("resize", {
              id: elements[i].id,
              position: position,
              frame: elements[i].frame
            });
          }
        },
        onResizeEnd({ elements, position }) {
          for (let i = 0; i < elements.length; i++) {
            emit("resizeEnd", {
              id: elements[i].id,
              position: position
            });
          }
        }
      }
    );

    const {
      selectBoxMouseDown,
      selectBoxMouseMove,
      selectBoxMouseUp
    } = useSelectionBox(
      event =>
        event.target.classList.contains("canvas") ||
        event.target.classList.contains("page"),
      offsettedElements,
      {
        onSelectEnd(selectedElements) {
          dispatch(setSelections(selectedElements));
          dispatch(hideSelectionBox());
        },
        onSelect({ frame }) {
          dispatch(updateSelectionBox(frame));
        }
      }
    );

    // canvas
    return (
      <div
        className="canvas"
        onMouseDown={useCallback(event => {
          selectBoxMouseDown(event);
          dragMouseDown(event);
          selectMouseDown(event);
          doubleClickMouseDown(event);
        }, [])}
        onMouseMove={useCallback(event => {
          dragMouseMove(event);
          selectMouseMove(event);
          rotateMouseMove(event);
          resizeMouseMove(event);
          selectBoxMouseMove(event);
          doubleClickMouseMove(event);
        }, [])}
        onMouseUp={useCallback(event => {
          dragMouseUp(event);
          selectMouseUp(event);
          rotateMouseUp(event);
          resizeMouseUp(event);
          selectBoxMouseUp(event);
          doubleClickMouseUp(event);
        }, [])}
      >
        {children}
        <SelectionBox frame={selectionBoxFrame} elements={offsettedElements} />

        <ControlBox
          show={controlBox.show}
          frame={controlBox.frame}
          angle={controlBox.angle}
          // TODO: when the logic become complicated, move it to selector
          resizeHandlerPosition={selection.length > 1 ? "corner" : "all"}
          onRotateMouseDown={rotateMouseDown}
          onResizeMouseDown={resizeMouseDown}
        />
      </div>
    );
  }
);

CanvasContainer.displayName = "CanvasContainer";
