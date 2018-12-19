export const UPDATE_ELEMENT = "UPDATE_ELEMENT";
export const SET_SELECRIONS = "SET_SELECRIONS";
export const UPDATE_CONTROL_BOX = "UPDATE_CONTROL_BOX";
export const SHOW_CONTROL_BOX = "SHOW_CONTROL_BOX";
export const HIDE_CONTROL_BOX = "HIDE_CONTROL_BOX";
export const UPDATE_SELECTION_BOX = "UPDATE_SELECTION_FRAME";

export const updateElement = (id, props) => ({
  type: UPDATE_ELEMENT,
  id,
  ...props
});

export const setSelections = selections => ({
  type: SET_SELECRIONS,
  selections
});

export const clearSelection = () => ({
  type: SET_SELECRIONS,
  selections: []
});

export const updateControlBox = props => ({
  type: UPDATE_CONTROL_BOX,
  ...props
});

export const showControlBox = () => ({
  type: SHOW_CONTROL_BOX
});

export const hideControlBox = () => ({
  type: HIDE_CONTROL_BOX
});

export const updateSelectionBox = frame => ({
  type: UPDATE_SELECTION_BOX,
  frame
});
