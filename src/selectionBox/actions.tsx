export const UPDATE_SELECTION_BOX = "UPDATE_SELECTION_FRAME";
export const HIDE_SELECTION_BOX = "HIDE_SELECTION_BOX";

export const updateSelectionBox = frame => ({
  type: UPDATE_SELECTION_BOX,
  frame
});

export const hideSelectionBox = () => ({
  type: HIDE_SELECTION_BOX
});
