// elements
export const ADD_ELEMENTS = "ADD_ELEMENTS";
export const UPDATE_ELEMENTS = "UPDATE_ELEMENTS";
export const DELETE_ELEMENTS = "DELETE_ELEMENTS";

// scale
export const UPDATE_ZOOM = "UPDATE_ZOOM";

export const addElements = (elements: ReadonlyArray<any>) => ({
  type: ADD_ELEMENTS as typeof ADD_ELEMENTS,
  elements
});

export const updateElements = (elements: ReadonlyArray<any>) => ({
  type: UPDATE_ELEMENTS as typeof UPDATE_ELEMENTS,
  elements
});

export const updateZoom = (zoom: number) => ({
  type: UPDATE_ZOOM as typeof UPDATE_ZOOM,
  zoom
});

export const deleteElements = (elements: ReadonlyArray<number>) => ({
  type: DELETE_ELEMENTS as typeof DELETE_ELEMENTS,
  elements
});

export type Action = ReturnType<
  | typeof addElements
  | typeof updateElements
  | typeof updateZoom
  | typeof deleteElements
>;
