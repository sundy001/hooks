import "./Canvas.scss";
import React, { Suspense, useCallback, useReducer } from "react";
import { ControlBox } from "../ControlBox";
import { SelectionBox } from "../SelectionBox";
import { createElements } from "./createElements";
import { initialState } from "./initialState";
import { selectAllElements } from "./selectors/selectAllElements";
import { selectSelectedElements } from "./selectors/selectSelectedElements";
import { reducer } from "./CanvasReducer";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { useRotate } from "./hooks/useRotate";
import { useResize } from "./hooks/useResize";
import { useSelectionBox } from "./hooks/useSelectionBox";
import { useDeselect } from "./hooks/useDeselect";
import { useSelect } from "./hooks/useSelect";
import {
  copyElements,
  setSelections,
  deleteElements,
  startCroppingImage,
  stopCroppingImage
} from "./CanvasAction";

export const CanvasContainer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // selectors
  const elements = selectAllElements(state);
  const selectedElements = selectSelectedElements(state);
  const {
    frame: controlBoxFrame,
    angle: controlBoxAngle,
    show: showControlBox
  } = state.controlBox;
  const shouldKeepAspectRatio = selectedElements.length > 1;
  const { selectionBox: selectionBoxFrame, selections } = state;

  // hooks
  const { dragMouseDown, dragMouseMove, dragMouseUp } = useDragAndDrop(
    dispatch,
    selectedElements,
    controlBoxFrame
  );

  const { selectMouseDown, selectMouseMove, selectMouseUp } = useSelect(
    dispatch,
    selections
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
    shouldKeepAspectRatio
  );

  const {
    selectBoxMouseDown,
    selectBoxMouseMove,
    selectBoxMouseUp
  } = useSelectionBox(dispatch, elements);

  const { deselectMouseDown, deselectMouseMove, deselectMouseUp } = useDeselect(
    dispatch
  );

  // create elements
  const onChildrenMouseDown = useCallback(event => {
    dragMouseDown(event);
    selectMouseDown(event);
  }, []);
  const children = createElements(
    dispatch,
    elements,
    state.raise,
    onChildrenMouseDown
  );

  const toolButtons = [];
  if (selectedElements.length > 0) {
    toolButtons.push(
      <button
        key="copy"
        onClick={() => {
          dispatch(copyElements());

          // TODO: need to think about how the get new Id
          const selectionLength = state.selections.length;
          const newElementIds = [];
          let maxId = Math.max(...state.elements.allIds);
          for (let i = 0; i < selectionLength; i++) {
            newElementIds.push(++maxId);
          }
          dispatch(setSelections(newElementIds));
        }}
      >
        Copy
      </button>
    );

    toolButtons.push(
      <button
        key="delete"
        onClick={() => {
          dispatch(deleteElements(state.selections));
        }}
      >
        Delete
      </button>
    );
  }
  if (selectedElements.length === 1) {
    if (selectedElements[0].name === "Image") {
      if (selectedElements[0].isCropping) {
        toolButtons.push(
          <button
            key="end"
            onClick={() => {
              dispatch(stopCroppingImage(selectedElements[0].id));
            }}
          >
            End
          </button>
        );
      } else {
        toolButtons.push(
          <button
            key="crop"
            onClick={() => {
              dispatch(startCroppingImage(selectedElements[0].id));
            }}
          >
            Crop
          </button>
        );
      }
    } else if (selectedElements[0].name === "Test") {
    }
  } else if (selectedElements.length > 1) {
  }

  // canvas
  return (
    <div
      className="canvas"
      onMouseDown={useCallback(event => {
        selectBoxMouseDown(event);
        deselectMouseDown(event);
      }, [])}
      onMouseMove={useCallback(event => {
        dragMouseMove(event);
        selectMouseMove(event);
        rotateMouseMove(event);
        resizeMouseMove(event);
        selectBoxMouseMove(event);
        deselectMouseMove(event);
      }, [])}
      onMouseUp={useCallback(event => {
        dragMouseUp(event);
        selectMouseUp(event);
        rotateMouseUp(event);
        resizeMouseUp(event);
        selectBoxMouseUp(event);
        deselectMouseUp(event);
      }, [])}
    >
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      <SelectionBox frame={selectionBoxFrame} elements={elements} />
      <ControlBox
        show={showControlBox}
        frame={controlBoxFrame}
        angle={controlBoxAngle}
        // TODO: when the logic become complicated, move it to selector
        resizeHandlerPosition={selections.length > 1 ? "corner" : "all"}
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
        {toolButtons}
      </div>
    </div>
  );
};
