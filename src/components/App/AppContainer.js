import React, { useEffect, useReducer } from "react";

import { Canvas } from "../Canvas";
import { SelectionBox } from "../SelectionBox";

import { Page } from "../Page";
import { reducer } from "./reducer";
import { initialState } from "./initialState";
import { getComponentsOfElementPanel } from "./selectors/getComponentsOfElementPanel";
import { selectElements } from "./selectors/selectElements";
import { shouldResizeKeepAspectRatio } from "./selectors/shouldResizeKeepAspectRatio";
import { getSelectedElements } from "./selectors/getSelectedElements";

export const AppContainer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    dispatch({ type: undefined });
  }, []);
  // TODO: find a way remove detection
  if (!state.selections) return null;

  const elements = selectElements(state);

  const selections = getSelectedElements(state);
  const { controlBox, pages } = state;

  return (
    <Canvas
      state={state}
      dispatch={dispatch}
      controlBox={controlBox}
      elements={elements}
      selections={selections}
      resizeKeepAspectRatio={shouldResizeKeepAspectRatio(state)}
    >
      {(resizeMouseDown, rotateMouseDown) => {
        const canvasElements = [];

        canvasElements.push(
          pages.allIds.map(pageId => {
            const page = pages.byId[pageId];

            const pageElements = elements.filter(({ page }) => page === pageId);
            const pageSelections = selections.filter(
              ({ page }) => page === pageId
            );

            let controlBoxPageId = null;
            const showControlBox =
              pageSelections.length === 0 || !controlBox.show
                ? false
                : pageSelections.every(({ page }) => {
                    if (controlBoxPageId === null) {
                      if (page !== pageId) {
                        return false;
                      }
                      controlBoxPageId = page;
                    }

                    return controlBoxPageId === page;
                  });

            const resizeHandlerPosition =
              selections.length > 1 ? "corner" : "all";

            // TODO: cache pageElements to aviod redraw
            return (
              <Page
                key={pageId}
                {...page}
                id={pageId}
                dispatch={dispatch}
                elements={pageElements}
                controlBox={
                  showControlBox && controlBox.show ? controlBox : null
                }
                resizeHandlerPosition={resizeHandlerPosition}
                resizeMouseDown={resizeMouseDown}
                rotateMouseDown={rotateMouseDown}
              />
            );
          })
        );

        canvasElements.push(
          <SelectionBox
            key="selection-box"
            frame={state.selectionBox}
            elements={elements}
          />
        );

        canvasElements.push(
          <div
            key="element-panel"
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
        );

        return canvasElements;
      }}
    </Canvas>
  );
};
