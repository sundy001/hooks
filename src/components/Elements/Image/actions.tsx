import { Frame } from "./type";
import { createAction } from "../../../reducer";

export const START_CROPPING_IMAGE = "START_CROPPING_IMAGE";
export const STOP_CROPPING_IMAGE = "STOP_CROPPING_IMAGE";
export const UPDATE_CROPPING_IMAGE = "UPDATE_CROPPING_IMAGE";

export const startCroppingImage = (element: number) =>
  createAction(START_CROPPING_IMAGE, element);

export const stopCroppingImage = (element: number) =>
  createAction(STOP_CROPPING_IMAGE, element);

export const updateCroppingImage = (
  element: number,
  frame: Readonly<Frame>,
  imageFrame: Readonly<Frame>
) =>
  createAction(UPDATE_CROPPING_IMAGE, {
    element,
    frame,
    imageFrame
  });

export type Action = ReturnType<
  | typeof startCroppingImage
  | typeof stopCroppingImage
  | typeof updateCroppingImage
>;
