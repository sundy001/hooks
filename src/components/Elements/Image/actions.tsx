import { Frame } from "./type";

export const START_CROPPING_IMAGE = "START_CROPPING_IMAGE";
export const STOP_CROPPING_IMAGE = "STOP_CROPPING_IMAGE";
export const UPDATE_CROPPING_IMAGE = "UPDATE_CROPPING_IMAGE";

export const startCroppingImage = (element: number) => ({
  type: START_CROPPING_IMAGE as typeof START_CROPPING_IMAGE,
  element
});

export const stopCroppingImage = (element: number) => ({
  type: STOP_CROPPING_IMAGE as typeof STOP_CROPPING_IMAGE,
  element
});

export const updateCroppingImage = (
  element: number,
  frame: Frame,
  imageFrame: Frame
) => ({
  type: UPDATE_CROPPING_IMAGE as typeof UPDATE_CROPPING_IMAGE,
  element,
  frame,
  imageFrame
});

export type Action = ReturnType<
  | typeof startCroppingImage
  | typeof stopCroppingImage
  | typeof updateCroppingImage
>;
