import { Test } from "../../Test";
import { Image } from "../elements/Image";
import React from "react";

const ELEMENTS = {
  Test,
  Image
};

const createElement = ({ id, name, ...props }, dragMouseDown, dispatch) => {
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
