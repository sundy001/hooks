import React from "react";
import { elementsStatic } from "../elementsStatic";
import {
  copyElements,
  setSelections,
  deleteElements,
  startCroppingImage,
  stopCroppingImage
} from "../CanvasAction";

export const getComponentsOfElementPanel = (
  dispatch,
  { selections, elements }
) => {
  let toolButtons = [];
  if (selections.length > 0) {
    toolButtons.push(
      <button
        key="copy"
        onClick={() => {
          dispatch(copyElements());

          // TODO: need to think about how the get new Id
          const selectionLength = selections.length;
          const newElementIds = [];
          let maxId = Math.max(...elements.allIds);
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
          dispatch(deleteElements(selections));
        }}
      >
        Delete
      </button>
    );
  }
  if (selections.length === 1) {
    const element = elements.byId[selections[0]];
    const elementStatic = elementsStatic[element.name];
    if (elementStatic && elementStatic.getComponentsOfPanel) {
      toolButtons = elementStatic.getComponentsOfPanel(
        dispatch,
        element,
        toolButtons
      );
    }
  } else if (selections.length > 1) {
  }

  return toolButtons;
};
