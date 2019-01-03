import "./Canvas.scss";
import React, { Suspense, useCallback, useReducer, memo } from "react";
import { ControlBox } from "../ControlBox";
import { SelectionBox } from "../SelectionBox";
import { createElements } from "./createElements";
import { initialState } from "./initialState";
import { selectAllElements } from "./selectors/selectAllElements";
import { selectSelectedElements } from "./selectors/selectSelectedElements";
import { reducer } from "./CanvasReducer";
import { useRotate } from "./hooks/useRotate";
import { useResize } from "./hooks/useResize";
import { useSelectionBox } from "./hooks/useSelectionBox";
import { shouldKeepAspectRatio } from "./selectors/shouldKeepAspectRatio";
import { getComponentsOfElementPanel } from "./selectors/getComponentsOfElementPanel";
import { useSelect } from "../../selections";
import { useDoubleClick } from "../../hooks/useDoubleClick";
import { emit } from "../../eventBus";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { hideControlBox, updateControlBox } from "../../controlBox";
import { updateElements } from "./CanvasAction";

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
    event => {
      dispatch(updateElements(event.elements));
      dispatch(
        updateControlBox({
          frame: { ...controlBoxFrame, ...event.controlBoxPosition }
        })
      );
    },
    event => Boolean(event.target.closest(".element")),
    selectedElements,
    controlBoxFrame
  );

  const { rotateMouseDown, rotateMouseMove, rotateMouseUp } = useRotate(
    dispatch,
    selectedElements,
    controlBoxFrame,
    controlBoxAngle
  );

  const { resizeMouseDown, resizeMouseMove, resizeMouseUp } = useResize(
    dispatch,
    selectedElements,
    controlBoxFrame,
    controlBoxAngle,
    shouldKeepAspectRatio(state)
  );

  const {
    selectBoxMouseDown,
    selectBoxMouseMove,
    selectBoxMouseUp
  } = useSelectionBox(
    dispatch,
    event => event.target.classList.contains("canvas"),
    elements
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
