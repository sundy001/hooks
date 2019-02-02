export const SET_SELECTIONS = "SET_SELECTIONS";
export const CLEAR_SELECTIONS = "CLEAR_SELECTIONS";

export const setSelections = (selections: ReadonlyArray<number>) => ({
  type: SET_SELECTIONS as typeof SET_SELECTIONS,
  selections
});

export const clearSelections = () => ({
  type: CLEAR_SELECTIONS as typeof CLEAR_SELECTIONS
});

export type Action = ReturnType<typeof setSelections | typeof clearSelections>;
