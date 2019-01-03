import "./Canvas.scss";
import React, { Suspense, useCallback, useReducer, memo } from "react";

import { ControlBox } from "../ControlBox";
import { SelectionBox } from "../SelectionBox";

import { initialState } from "./initialState";
import { updateElements } from "./actions";
import { reducer } from "./reducer";

import { createElements } from "./createElements";
import { selectAllElements } from "./selectors/selectAllElements";
import { selectSelectedElements } from "./selectors/selectSelectedElements";
import { shouldKeepAspectRatio } from "./selectors/shouldKeepAspectRatio";
import { getComponentsOfElementPanel } from "./selectors/getComponentsOfElementPanel";

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

export const CanvasContainer = memo(() => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // selectors
  const elements = selectAllElements(state);
  const selectedElements = selectSelectedElements(state);
  const {
    frame: controlBoxFrame,
    angle: controlBoxAngle,
    show: showControlBox
  } = state.controlBox;
  const { selectionBox: selectionBoxFrame, selections } = state;

  // hooks
  const { selectMouseDown, selectMouseMove, selectMouseUp } = useSelect(
    dispatch,
    event => event.target.classList.contains("canvas"),
    selections,
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
    selectedElements,
    controlBoxFrame,
    {
      onDrag({ elements, controlBoxPosition }) {
        dispatch(updateElements(elements));
        dispatch(
          updateControlBox({
            frame: { ...controlBoxFrame, ...controlBoxPosition }
          })
        );
      }
    }
  );

  const { rotateMouseDown, rotateMouseMove, rotateMouseUp } = useRotate(
    selectedElements,
    controlBoxFrame,
    controlBoxAngle,
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
    selectedElements,
    controlBoxFrame,
    controlBoxAngle,
    shouldKeepAspectRatio(state),
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

  const children = createElements(dispatch, elements, state.raise);

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
        show={showControlBox}
        frame={controlBoxFrame}
        angle={controlBoxAngle}
        // TODO: when the logic become complicated, move it to selector
        resizeHandlerPosition={selectedElements.length > 1 ? "corner" : "all"}
        onRotateMouseDown={rotateMouseDown}
        onResizeMouseDown={resizeMouseDown}
      />
      <div
        style={{
          background: "yellow",
          position: "absolute",
          left: 0,
          right: 0
        }}
      >
        {getComponentsOfElementPanel(dispatch, state)}
      </div>
    </div>
  );
});

CanvasContainer.displayName = "CanvasContainer";
