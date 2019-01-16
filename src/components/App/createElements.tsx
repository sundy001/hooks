import React, { ComponentType } from "react";
import { elementsStatic } from "../App/elementsStatic";
import { DeepReadonlyArray } from "../../utilType";
import { ElementEntity } from "./type";

const loadedElements: { [name: string]: ComponentType<any> } = {};

const loadElement = (name: string) => {
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

export const createElements = (
  elements: DeepReadonlyArray<ElementEntity>,
  props: { [name: string]: any }
) =>
  elements.map(({ id, name, ...elementProps }) => {
    const Element = loadElement(name);
    return <Element key={id} id={id} {...props} {...elementProps} />;
  });
