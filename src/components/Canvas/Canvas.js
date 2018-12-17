import "./Canvas.scss";
import React, { useCallback, useReducer } from "react";
import ControlBox from "../ControlBox";
import SelectionBox from "../SelectionBox";
import { createElements } from "./createElements";
import initialState from "./initialState";
import { selectAllElements } from "../../selector/selectAllElements";
import { selectSelectedElements } from "../../selector/selectSelectedElements";
import rootReducer from "./CanvasReducer";
import useDragAndDrop from "./hooks/useDragAndDrop";
import useRotate from "./hooks/useRotate";
import useResize from "./hooks/useResize";
import useSelectionBox from "./hooks/useSelectionBox";
import useDeselect from "./hooks/useDeselect";
import useSelect from "./hooks/useSelect";

const Canvas = () => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  // selectors
  const elements = selectAllElements(state);
  const selectedElements = selectSelectedElements(state);
  const { frame: controlBoxFrame, angle: controlBoxAngle } = state.controlBox;
  const { selectionBox: selectionBoxFrame, selections } = state;
  const selectedIdStr = selections.reduce(
    (prevId, { id }) => prevId + "-" + id,
    ""
  );

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

  const {
    resizeMouseDown,
    resizeMouseMove,
    resizeMouseUp,
    resizePosition
  } = useResize(dispatch, selectedElements, controlBoxFrame, controlBoxAngle);

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
    elements,
    onChildrenMouseDown,
    resizePosition
  );

  // control box
  children.push(
    <ControlBox
      key={`control-frame${selectedIdStr}`}
      frame={controlBoxFrame}
      angle={controlBoxAngle}
      // TODO: when the logic become complicated, move it to selector
      resizeHandlerPosition={selections.length > 1 ? "corner" : "all"}
      rotateMouseDown={rotateMouseDown}
      resizeMouseDown={resizeMouseDown}
    />
  );

  // selection box
  children.push(
    <SelectionBox
      key="selection-frame"
      frame={selectionBoxFrame}
      elements={elements}
    />
  );

  // canvas
  const onCanvasMouseDown = useCallback(event => {
    selectBoxMouseDown(event);
    deselectMouseDown(event);
  }, []);
  const onCanvasMouseMove = useCallback(event => {
    dragMouseMove(event);
    selectMouseMove(event);
    rotateMouseMove(event);
    resizeMouseMove(event);
    selectBoxMouseMove(event);
    deselectMouseMove(event);
  }, []);
  const onCanvasMouseUp = useCallback(event => {
    dragMouseUp(event);
    selectMouseUp(event);
    rotateMouseUp(event);
    resizeMouseUp(event);
    selectBoxMouseUp(event);
    deselectMouseUp(event);
  }, []);
  return (
    <div
      className="canvas"
      onMouseDown={onCanvasMouseDown}
      onMouseMove={onCanvasMouseMove}
      onMouseUp={onCanvasMouseUp}
    >
      {children}
    </div>
  );
};

export default Canvas;
