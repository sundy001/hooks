export const UPDATE_ELEMENT = "UPDATE_ELEMENT";
export const SET_SELECIONS = "SET_SELECRIONS";
export const UPDATE_CONTROL_BOX = "UPDATE_CONTROL_BOX";
export const SHOW_CONTROL_BOX = "SHOW_CONTROL_BOX";
export const HIDE_CONTROL_BOX = "HIDE_CONTROL_BOX";
export const UPDATE_SELECTION_BOX = "UPDATE_SELECTION_FRAME";
export const COPY_ELEMENTS = "COPY_ELEMENTS";
export const DELETE_ELEMENTS = "DELETE_ELEMENTS";
export const RAISE_ELEMENTS = "RAISE_ELEMENTS";
export const CLEAR_RAISE_ELEMENTS = "CLEAR_RAISE_ELEMENTS";

export const updateElement = (id, props) => ({
  type: UPDATE_ELEMENT,
  id,
  ...props
});

export const setSelections = selections => ({
  type: SET_SELECIONS,
  selections
});

export const clearSelection = () => ({
  type: SET_SELECIONS,
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

export const copyElements = () => ({
  type: COPY_ELEMENTS
});

export const deleteElements = elements => ({
  type: DELETE_ELEMENTS,
  elements
});

export const raiseElements = elements => ({
  type: RAISE_ELEMENTS,
  elements
});

export const clearRaiseElements = () => ({
  type: CLEAR_RAISE_ELEMENTS
});
