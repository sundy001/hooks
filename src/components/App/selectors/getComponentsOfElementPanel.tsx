import React, { ReactNode } from "react";
import { elementsStatic } from "../elementsStatic";
import { copyElements, deleteElements } from "../actions";
import { setSelections, clearSelections } from "../../../selections";
import { State } from "../type";

export const getComponentsOfElementPanel = (
  dispatch: (action: any) => void,
  { selections, elements }: State
) => {
  let components: ReactNode[] = [];
  if (selections.length > 0) {
    components.push(
      <button
        key="copy"
        onClick={() => {
          dispatch(copyElements());

          // TODO: need to think about how the get new Id
          const selectionLength = selections.length;
          const newElementIds: number[] = [];
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

    components.push(
      <button
        key="delete"
        onClick={() => {
          dispatch(deleteElements(selections));
          dispatch(clearSelections());
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
      components = elementStatic.getComponentsOfPanel(
        dispatch,
        element,
        components
      );
    }
  } else if (selections.length > 1) {
  }

  return components;
};
