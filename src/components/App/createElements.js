import React from "react";
import { elementsStatic } from "../App/elementsStatic";

const loadedElements = {};

const loadElement = name => {
  if (loadedElements[name] === undefined) {
    loadedElements[name] = React.lazy(() =>
      import(`../elements/${name}`).then(module => {
        loadedElements[name] = module.default;
        elementsStatic[name] = module.elementStatic;
        return module;
      })
    );
  }

  return loadedElements[name];
};

const createElement = ({ id, name, ...props }, dispatch) => {
  const Element = loadElement(name);
  return <Element key={id} id={id} {...props} dispatch={dispatch} />;
};

export const createElements = (dispatch, elements, pageId) =>
  elements
    .filter(({ page }) => {
      return page === pageId;
    })
    .map(props => createElement(props, dispatch));
