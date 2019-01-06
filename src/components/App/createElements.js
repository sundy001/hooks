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

const createElement = ({ id, name, ...elementProps }, props) => {
  const Element = loadElement(name);
  return <Element key={id} id={id} {...props} {...elementProps} />;
};

export const createElements = (elements, ...props) =>
  elements.map(elementProps => createElement(elementProps, props));
