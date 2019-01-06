export const SET_SELECTIONS = "SET_SELECTIONS";
export const CLEAR_SELECTIONS = "CLEAR_SELECTIONS";

export const setSelections = selections => ({
  type: SET_SELECTIONS,
  selections
});

export const clearSelections = () => ({
  type: CLEAR_SELECTIONS
});
