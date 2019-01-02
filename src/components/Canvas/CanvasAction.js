// elements
export const UPDATE_ELEMENT = "UPDATE_ELEMENT";
export const COPY_ELEMENTS = "COPY_ELEMENTS";
export const DELETE_ELEMENTS = "DELETE_ELEMENTS";

// control box
export const UPDATE_CONTROL_BOX = "UPDATE_CONTROL_BOX";

// seelction box
export const UPDATE_SELECTION_BOX = "UPDATE_SELECTION_FRAME";

// elements
// image
export const START_CROPPING_IMAGE = "START_CROPPING_IMAGE";
export const STOP_CROPPING_IMAGE = "STOP_CROPPING_IMAGE";
export const UPDATE_CROPPING_IMAGE = "UPDATE_CROPPING_IMAGE";

export const updateElement = (id, props) => ({
  type: UPDATE_ELEMENT,
  id,
  ...props
});

export const updateControlBox = props => ({
  type: UPDATE_CONTROL_BOX,
  ...props
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
