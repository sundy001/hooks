import { createAction } from "../reducer";
import { Frame } from "./type";

export const UPDATE_SELECTION_BOX = "UPDATE_SELECTION_FRAME";
export const HIDE_SELECTION_BOX = "HIDE_SELECTION_BOX";

export const updateSelectionBox = (frame: Frame) =>
  createAction(UPDATE_SELECTION_BOX, frame);

export const hideSelectionBox = () => createAction(HIDE_SELECTION_BOX);

export type Action = ReturnType<
  typeof updateSelectionBox | typeof hideSelectionBox
>;
