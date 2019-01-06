import { createAction } from "../../reducer";

// elements
export const UPDATE_ELEMENT = "UPDATE_ELEMENT";
export const UPDATE_ELEMENTS = "UPDATE_ELEMENTS";
export const DELETE_ELEMENTS = "DELETE_ELEMENTS";

// scale
export const UPDATE_ZOOM = "UPDATE_ZOOM";

// external features
export const COPY_ELEMENTS = "COPY_ELEMENTS";

export const updateElement = (id: number, props: any) =>
  createAction(UPDATE_ELEMENT, { id, props });

export const updateElements = (elements: ReadonlyArray<any>) =>
  createAction(UPDATE_ELEMENTS, elements);

export const copyElements = () => createAction(COPY_ELEMENTS);

export const updateZoom = (zoom: number) => createAction(UPDATE_ZOOM, zoom);

export const deleteElements = (elements: ReadonlyArray<number>) =>
  createAction(DELETE_ELEMENTS, elements);
