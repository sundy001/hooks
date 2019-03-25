// elements
export const ADD_ELEMENTS = "ADD_ELEMENTS";
export const UPDATE_ELEMENTS = "UPDATE_ELEMENTS";
export const DELETE_ELEMENTS = "DELETE_ELEMENTS";

export const addElements = (
  elements: ReadonlyArray<{ id: number; [key: string]: any }>
) => ({
  type: ADD_ELEMENTS as typeof ADD_ELEMENTS,
  elements
});

export const updateElements = (
  elements: ReadonlyArray<{ id: number; [key: string]: any }>
) => ({
  type: UPDATE_ELEMENTS as typeof UPDATE_ELEMENTS,
  elements
});

export const deleteElements = (elements: ReadonlyArray<number>) => ({
  type: DELETE_ELEMENTS as typeof DELETE_ELEMENTS,
  elements
});

export type Action = ReturnType<
  typeof addElements | typeof updateElements | typeof deleteElements
>;
