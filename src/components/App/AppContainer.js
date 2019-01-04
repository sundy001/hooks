import React, { Suspense, useEffect, useReducer, useRef } from "react";
import debounce from "lodash/debounce";
import { Canvas } from "../Canvas";
import { Page } from "../Page";
import { reducer } from "./reducer";
import { initialState } from "./initialState";
import { getComponentsOfElementPanel } from "./selectors/getComponentsOfElementPanel";
import { selectElements } from "./selectors/selectElements";
import { shouldResizeKeepAspectRatio } from "./selectors/shouldResizeKeepAspectRatio";
import { createElements } from "./createElements";
import { updatePageOffsets as updatePageOffsetsAction } from "./actions";
import { clearSelections } from "../../selections";

export const AppContainer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    dispatch({ type: undefined });
  }, []);
  // TODO: find a way remove detection
  if (!state.selections) return null;

  const elements = selectElements(state);

  const pagesRef = useRef([]);

  useEffect(() => {
    const updatePageOffsets = () => {
      let scrollElement =
        ((scrollElement = document.documentElement) ||
          (scrollElement = document.body.parentNode)) &&
        typeof scrollElement.scrollLeft == "number"
          ? scrollElement
          : document.body;
      const offsets = {};
      for (let i = 0; i < pagesRef.current.length; i++) {
        const { current } = pagesRef.current[i];
        const { left: x, top: y } = current.getBoundingClientRect();
        offsets[current.dataset.id] = {
          x: x + scrollElement.scrollLeft,
          y: y + scrollElement.scrollTop
        };
      }

      dispatch(updatePageOffsetsAction(offsets));
    };
    const debouncedUpdatePageOffsets = debounce(updatePageOffsets, 200);
    const onResize = () => {
      dispatch(clearSelections());
      debouncedUpdatePageOffsets();
    };

    window.addEventListener("resize", onResize);
    updatePageOffsets();

    return () => {
      window.removeEventListener("resize", onResize);
      debouncedUpdatePageOffsets.cancel();
    };
  }, []);

  const pageOffsetById = {};
  const ids = state.elements.allIds;
  for (let i = 0; i < ids.length; i++) {
    const { id, page } = state.elements.byId[ids[i]];
    pageOffsetById[id] = state.pageOffsets[page];
  }

  pagesRef.current.length = 0;

  return (
    <Canvas
      state={state}
      dispatch={dispatch}
      controlBox={state.controlBox}
      selectionBoxFrame={state.selectionBox}
      elements={elements}
      pageOffsetById={pageOffsetById}
      selectionIds={state.selections}
      resizeKeepAspectRatio={shouldResizeKeepAspectRatio(state)}
    >
      {state.pages.allIds.map(pageId => {
        const page = state.pages.byId[pageId];
        const pageRef = useRef();
        pagesRef.current.push(pageRef);
        return (
          <Page
            key={pageId}
            ref={pageRef}
            id={pageId}
            width={page.width}
            height={page.height}
            backgroundColor={page.backgroundColor}
          >
            <Suspense fallback={<div>Loading...</div>}>
              {createElements(dispatch, elements, pageId)}
            </Suspense>
          </Page>
        );
      })}
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
    </Canvas>
  );
};
