import { Frame } from "./type";
import { DeepReadonly } from "../utilType";

export const UPDATE_CONTROL_BOX = "UPDATE_CONTROL_BOX";
export const updateControlBox = (
  props: DeepReadonly<{ frame?: Frame; angle?: number }>
) => ({
  type: UPDATE_CONTROL_BOX as typeof UPDATE_CONTROL_BOX,
  ...props
});

export const UPDATE_CONTROL_BOX_BY_ELEMENT = "UPDATE_CONTROL_BOX_BY_ELEMENT";
export const updateControlBoxByElement = (element: number) => ({
  type: UPDATE_CONTROL_BOX_BY_ELEMENT as typeof UPDATE_CONTROL_BOX_BY_ELEMENT,
  element
});

export const SHOW_CONTROL_BOX = "SHOW_CONTROL_BOX";
export const showControlBox = () => ({
  type: SHOW_CONTROL_BOX as typeof SHOW_CONTROL_BOX
});

export const HIDE_CONTROL_BOX = "HIDE_CONTROL_BOX";
export const hideControlBox = () => ({
  type: HIDE_CONTROL_BOX as typeof HIDE_CONTROL_BOX
});

export const CLEAR_SELECTIONS = "CLEAR_SELECTIONS";
export const clearSelections = () => ({
  type: CLEAR_SELECTIONS as typeof CLEAR_SELECTIONS
});

export const SET_SELECTIONS = "SET_SELECTIONS";
export const setSelections = (selections: ReadonlyArray<number>) => ({
  type: SET_SELECTIONS as typeof SET_SELECTIONS,
  selections
});

export type Action = ReturnType<
  | typeof updateControlBox
  | typeof updateControlBoxByElement
  | typeof showControlBox
  | typeof hideControlBox
  | typeof clearSelections
  | typeof setSelections
>;
