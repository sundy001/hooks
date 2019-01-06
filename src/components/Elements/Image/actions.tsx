export const START_CROPPING_IMAGE = "START_CROPPING_IMAGE";
export const STOP_CROPPING_IMAGE = "STOP_CROPPING_IMAGE";
export const UPDATE_CROPPING_IMAGE = "UPDATE_CROPPING_IMAGE";

export const startCroppingImage = element => ({
  type: START_CROPPING_IMAGE,
  element
});

export const stopCroppingImage = element => ({
  type: STOP_CROPPING_IMAGE,
  element
});

export const updateCroppingImage = (element, frame, imageFrame) => ({
  type: UPDATE_CROPPING_IMAGE,
  element,
  frame,
  imageFrame
});
