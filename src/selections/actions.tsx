import { createAction } from "../reducer";

export const SET_SELECTIONS = "SET_SELECTIONS";
export const CLEAR_SELECTIONS = "CLEAR_SELECTIONS";

export const setSelections = (selections: ReadonlyArray<number>) =>
  createAction(SET_SELECTIONS, selections);

export const clearSelections = () => createAction(CLEAR_SELECTIONS);

export type Action = ReturnType<typeof setSelections | typeof clearSelections>;
