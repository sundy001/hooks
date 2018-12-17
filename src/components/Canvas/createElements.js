import Test from "../../Test";
import Image from "../Elements/Image";
import React from "react";

const ELEMENTS = {
  Test,
  Image
};

export const createElements = (elements, dragMouseDown) => {
  return elements.map(({ id, name, ...props }) => {
    // const Component = lazy(() => import(`./${name}`));
    const ElementName = ELEMENTS[name];
    return (
      <ElementName {...props} onMouseDown={dragMouseDown} id={id} key={id} />
    );
  });
};
