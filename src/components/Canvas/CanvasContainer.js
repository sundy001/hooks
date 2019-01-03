import "./Canvas.scss";
import React, { Suspense, useCallback, memo } from "react";

import { ControlBox } from "../ControlBox";
import { SelectionBox } from "../SelectionBox";

import { updateElements } from "./actions";

import { createElements } from "./createElements";

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

export const CanvasContainer = memo(
  ({
    dispatch,
    elements,
    selection,
    controlBox,
    selectionBoxFrame,
    resizeKeepAspectRatio
  }) => {
    const selectionIds = selection.map(({ id }) => id);

    // hooks
    const { selectMouseDown, selectMouseMove, selectMouseUp } = useSelect(
      dispatch,
      event => event.target.classList.contains("canvas"),
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
      event => event.target.classList.contains("canvas"),
      elements,
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

    const children = createElements(dispatch, elements);

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
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <SelectionBox frame={selectionBoxFrame} elements={elements} />

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
