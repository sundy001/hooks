import React from "react";
import { elementsStatic } from "./elementsStatic";

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

const createElement = ({ id, name, ...props }, dragMouseDown, dispatch) => {
  const Element = loadElement(name);
  return (
    <Element
      key={id}
      id={id}
      {...props}
      onMouseDown={dragMouseDown}
      dispatch={dispatch}
    />
  );
};

export const createElements = (dispatch, elements, raise, dragMouseDown) => {
  const reactElements = [];
  const raisedElements = [];

  elements.forEach(props => {
    const reactElement = createElement(props, dragMouseDown, dispatch);
    if (raise.indexOf(props.id) !== -1) {
      raisedElements.push(reactElement);
    } else {
      reactElements.push(reactElement);
    }
  });

  return reactElements.concat(raisedElements);
};
