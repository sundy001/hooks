import React, {
  ReactNode,
  Reducer,
  useCallback,
  useEffect,
  useReducer
} from "react";

import { Canvas } from "../Canvas";
import { SelectionBox } from "../SelectionBox";

import { Page } from "../Page";
import { reducer } from "./reducer";
import { initialState } from "./initialState";
import { getComponentsOfElementPanel } from "./selectors/getComponentsOfElementPanel";
import { selectElements } from "./selectors/selectElements";
import { shouldResizeKeepAspectRatio } from "./selectors/shouldResizeKeepAspectRatio";
import { getSelectedElements } from "./selectors/getSelectedElements";
import { updateZoom, Action } from "./actions";
import { State } from "./type";

export const AppContainer = () => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(
    reducer,
    initialState as any
  );
  useEffect(() => {
    dispatch({ type: undefined } as any);
  }, []);
  // TODO: find a way remove detection
  if (!state.selections) return null;

  const elements = selectElements(state);

  const selections = getSelectedElements(state);
  const { controlBox, pages, zoom } = state;

  return (
    <Canvas
      dispatch={dispatch}
      controlBox={controlBox}
      elements={elements}
      zoom={zoom}
      selections={selections}
      resizeKeepAspectRatio={shouldResizeKeepAspectRatio(state)}
    >
      {controlBoxElement => {
        const canvasElements: ReactNode[] = [];

        canvasElements.push(
          pages.allIds.map(pageId => {
            const page = pages.byId[pageId];

            const pageElements = elements.filter(({ page }) => page === pageId);
            const pageSelections = selections.filter(
              ({ page }) => page === pageId
            );

            let controlBoxPageId: number | null = null;
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

            // TODO: cache pageElements to avoid redraw
            return (
              <Page
                key={pageId}
                {...page}
                id={pageId}
                dispatch={dispatch}
                zoom={zoom}
                elements={pageElements}
                controlBox={
                  showControlBox && controlBox.show ? controlBoxElement : null
                }
              />
            );
          })
        );

        canvasElements.push(
          <SelectionBox key="selection-box" frame={state.selectionBox} />
        );

        canvasElements.push(
          <div
            key="element-panel"
            style={{
              background: "yellow",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0
            }}
          >
            {getComponentsOfElementPanel(dispatch, state)}
          </div>
        );

        canvasElements.push(
          <div
            key="scale"
            style={{
              background: "gray",
              position: "fixed",
              bottom: 0,
              right: 0
            }}
          >
            <div onClick={useCallback(() => dispatch(updateZoom(1)), [])}>
              100%
            </div>
            <div onClick={useCallback(() => dispatch(updateZoom(2)), [])}>
              200%
            </div>
          </div>
        );

        return canvasElements;
      }}
    </Canvas>
  );
};
