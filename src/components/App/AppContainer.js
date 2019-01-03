import React, { useEffect, useReducer } from "react";
import { Canvas } from "../Canvas";
import { Page } from "../Page";
import { reducer } from "./reducer";
import { initialState } from "./initialState";
import { getComponentsOfElementPanel } from "./selectors/getComponentsOfElementPanel";
import { selectElements } from "./selectors/selectElements";
import { selectSelectedElements } from "./selectors/selectSelectedElements";
import { shouldResizeKeepAspectRatio } from "./selectors/shouldResizeKeepAspectRatio";

export const AppContainer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    dispatch({ type: undefined });
  }, []);
  // TODO: find a way remove detection
  if (!state.selections) return null;

  return (
    <div>
      <Canvas
        state={state}
        dispatch={dispatch}
        controlBox={state.controlBox}
        selectionBoxFrame={state.selectionBox}
        elements={selectElements(state)}
        selection={selectSelectedElements(state)}
        resizeKeepAspectRatio={shouldResizeKeepAspectRatio(state)}
      />
      <div
        style={{
          background: "yellow",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0
        }}
      >
        {getComponentsOfElementPanel(dispatch, state)}
      </div>
    </div>
  );
  // return <Page width={500} height={500} />;
};
