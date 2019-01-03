// elements
export const UPDATE_ELEMENT = "UPDATE_ELEMENT";
export const UPDATE_ELEMENTS = "UPDATE_ELEMENTS";
export const DELETE_ELEMENTS = "DELETE_ELEMENTS";

// external features
export const COPY_ELEMENTS = "COPY_ELEMENTS";

export const updateElement = (id, props) => ({
  type: UPDATE_ELEMENT,
  id,
  ...props
});

export const updateElements = elements => ({
  type: UPDATE_ELEMENTS,
  elements
});

export const copyElements = () => ({
  type: COPY_ELEMENTS
});

export const deleteElements = elements => ({
  type: DELETE_ELEMENTS,
  elements
});
