import { createAction } from "../reducer";
import { Frame } from "./type";
import { DeepReadonly } from "../utilType";

export const UPDATE_CONTROL_BOX = "UPDATE_CONTROL_BOX";
export const updateControlBox = (
  props: DeepReadonly<{ frame?: Frame; angle?: number }>
) => createAction(UPDATE_CONTROL_BOX, props);

export const UPDATE_CONTROL_BOX_BY_ELEMENT = "UPDATE_CONTROL_BOX_BY_ELEMENT";
export const updateControlBoxByElement = (element: number) =>
  createAction(UPDATE_CONTROL_BOX_BY_ELEMENT, element);

export const SHOW_CONTROL_BOX = "SHOW_CONTROL_BOX";
export const showControlBox = () => createAction(SHOW_CONTROL_BOX);

export const HIDE_CONTROL_BOX = "HIDE_CONTROL_BOX";
export const hideControlBox = () => createAction(HIDE_CONTROL_BOX);

export const CLEAR_SELECTIONS = "CLEAR_SELECTIONS";
export const clearSelections = () => createAction(CLEAR_SELECTIONS);

export const SET_SELECTIONS = "SET_SELECTIONS";
export const setSelections = (selections: ReadonlyArray<number>) =>
  createAction(SET_SELECTIONS, selections);

export type Action = ReturnType<
  | typeof updateControlBox
  | typeof updateControlBoxByElement
  | typeof showControlBox
  | typeof hideControlBox
  | typeof clearSelections
  | typeof setSelections
>;
