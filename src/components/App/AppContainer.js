import React, { Suspense, useEffect, useReducer } from "react";

import { Canvas } from "../Canvas";
import { ControlBox } from "../ControlBox";
import { SelectionBox } from "../SelectionBox";

import { Page } from "../Page";
import { reducer } from "./reducer";
import { initialState } from "./initialState";
import { getComponentsOfElementPanel } from "./selectors/getComponentsOfElementPanel";
import { selectElements } from "./selectors/selectElements";
import { shouldResizeKeepAspectRatio } from "./selectors/shouldResizeKeepAspectRatio";
import { createElements } from "./createElements";
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
  const { controlBox, pages, selections: selectionIds } = state;

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

            return (
              <Page
                key={pageId}
                id={pageId}
                width={page.width}
                height={page.height}
                backgroundColor={page.backgroundColor}
              >
                <Suspense fallback={<div>Loading...</div>}>
                  {createElements(dispatch, pageElements)}
                </Suspense>
                {showControlBox && (
                  <ControlBox
                    show={controlBox.show}
                    frame={controlBox.frame}
                    angle={controlBox.angle}
                    // TODO: when the logic become complicated, move it to selector
                    resizeHandlerPosition={
                      selections.length > 1 ? "corner" : "all"
                    }
                    onRotateMouseDown={rotateMouseDown}
                    onResizeMouseDown={resizeMouseDown}
                  />
                )}
              </Page>
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
