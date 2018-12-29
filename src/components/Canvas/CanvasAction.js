export const UPDATE_ELEMENT = "UPDATE_ELEMENT";
export const SET_SELECIONS = "SET_SELECRIONS";
export const UPDATE_CONTROL_BOX = "UPDATE_CONTROL_BOX";
export const SHOW_CONTROL_BOX = "SHOW_CONTROL_BOX";
export const HIDE_CONTROL_BOX = "HIDE_CONTROL_BOX";
export const UPDATE_SELECTION_BOX = "UPDATE_SELECTION_FRAME";
export const COPY_ELEMENTS = "COPY_ELEMENTS";
export const DELETE_ELEMENTS = "DELETE_ELEMENTS";

export const START_CROPPING_IMAGE = "START_CROPPING_IMAGE";
export const STOP_CROPPING_IMAGE = "STOP_CROPPING_IMAGE";
export const UPDATE_CROPPING_IMAGE = "UPDATE_CROPPING_IMAGE";

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

export const updateCroppingImage = (element, frame, imageFrame) => ({
  type: UPDATE_CROPPING_IMAGE,
  element,
  frame,
  imageFrame
});

export const startCroppingImage = element => ({
  type: START_CROPPING_IMAGE,
  element
});

export const stopCroppingImage = element => ({
  type: STOP_CROPPING_IMAGE,
  element
});
