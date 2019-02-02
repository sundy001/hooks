// elements
export const UPDATE_ELEMENT = "UPDATE_ELEMENT";
export const UPDATE_ELEMENTS = "UPDATE_ELEMENTS";
export const DELETE_ELEMENTS = "DELETE_ELEMENTS";

// scale
export const UPDATE_ZOOM = "UPDATE_ZOOM";

// external features
export const COPY_ELEMENTS = "COPY_ELEMENTS";

export const updateElement = (id: number, props: object) => ({
  type: UPDATE_ELEMENT as typeof UPDATE_ELEMENT,
  id,
  props
});

export const updateElements = (elements: ReadonlyArray<any>) => ({
  type: UPDATE_ELEMENTS as typeof UPDATE_ELEMENTS,
  elements
});

export const copyElements = () => ({
  type: COPY_ELEMENTS as typeof COPY_ELEMENTS
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
  | typeof updateElement
  | typeof updateElements
  | typeof copyElements
  | typeof updateZoom
  | typeof deleteElements
>;
