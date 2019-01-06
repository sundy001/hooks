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

export const createElements = (elements, props) =>
  elements.map(({ id, name, ...elementProps }) => {
    const Element = loadElement(name);
    return <Element key={id} id={id} {...props} {...elementProps} />;
  });
