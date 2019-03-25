import React, { ReactNode } from "react";
import cloneDeep from "lodash/cloneDeep";
import { elementsStatic } from "../elementsStatic";
import { deleteElements, addElements } from "../actions";
import { setSelections, clearSelections } from "../../../selections";
import { State, ElementEntity } from "../type";

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
          let lastId = Math.max(...elements.allIds);
          const newElements: ElementEntity[] = [];
          selections.forEach(id => {
            const newElement = cloneDeep(elements.byId[id]) as ElementEntity;
            newElement.id = ++lastId;
            newElement.frame.x += 20;
            newElement.frame.y += 20;
            newElements.push(newElement);
          });

          dispatch(addElements(newElements));
          dispatch(setSelections(newElements.map(({ id }) => id)));
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
