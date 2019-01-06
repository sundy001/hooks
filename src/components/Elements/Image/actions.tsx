import { createAction } from "../../../reducer";

export const START_CROPPING_IMAGE = "START_CROPPING_IMAGE";
export const STOP_CROPPING_IMAGE = "STOP_CROPPING_IMAGE";
export const UPDATE_CROPPING_IMAGE = "UPDATE_CROPPING_IMAGE";

type Frame = Readonly<{
  width: number;
  height: number;
  x: number;
  y: number;
}>;

export const startCroppingImage = (element: number) =>
  createAction(START_CROPPING_IMAGE, element);

export const stopCroppingImage = (element: number) =>
  createAction(STOP_CROPPING_IMAGE, element);

export const updateCroppingImage = (
  element: number,
  frame: Frame,
  imageFrame: Frame
) =>
  createAction(UPDATE_CROPPING_IMAGE, {
    element,
    frame,
    imageFrame
  });

type ActionCreatorsMapObject = {
  [actionCreator: string]: (...args: any[]) => any;
};
type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<A[keyof A]>;
export type Action = ActionsUnion<{
  startCroppingImage: typeof startCroppingImage;
  stopCroppingImage: typeof stopCroppingImage;
  updateCroppingImage: typeof updateCroppingImage;
}>;
