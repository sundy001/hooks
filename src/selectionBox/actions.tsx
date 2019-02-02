import { Frame } from "./type";

export const UPDATE_SELECTION_BOX = "UPDATE_SELECTION_FRAME";
export const HIDE_SELECTION_BOX = "HIDE_SELECTION_BOX";

export const updateSelectionBox = (frame: Frame) => ({
  type: UPDATE_SELECTION_BOX as typeof UPDATE_SELECTION_BOX,
  frame
});

export const hideSelectionBox = () => ({
  type: HIDE_SELECTION_BOX as typeof HIDE_SELECTION_BOX
});

export type Action = ReturnType<
  typeof updateSelectionBox | typeof hideSelectionBox
>;
