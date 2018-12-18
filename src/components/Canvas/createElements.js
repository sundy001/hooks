import Test from "../../Test";
import Image from "../Elements/Image";
import React from "react";

const ELEMENTS = {
  Test,
  Image
};

export const createElements = (elements, dragMouseDown, dispatch) => {
  return elements.map(({ id, name, ...props }) => {
    // const Component = lazy(() => import(`./${name}`));
    const ElementName = ELEMENTS[name];
    return (
      <ElementName
        key={id}
        id={id}
        {...props}
        onMouseDown={dragMouseDown}
        dispatch={dispatch}
      />
    );
  });
};
