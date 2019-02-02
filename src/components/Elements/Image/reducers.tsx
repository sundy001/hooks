import {
  Action,
  START_CROPPING_IMAGE,
  STOP_CROPPING_IMAGE,
  UPDATE_CROPPING_IMAGE
} from "./actions";
import { Reducer, EntityStore, updateEntity } from "../../../reducer";
import { ImageEntity } from "./type";

export const elements: Reducer<EntityStore<ImageEntity>, Action> = (
  state,
  action
) => {
  switch (action.type) {
    case START_CROPPING_IMAGE:
      return updateEntity(
        state,
        () => ({
          isCropping: true
        }),
        action.element
      );

    case STOP_CROPPING_IMAGE:
      return updateEntity(
        state,
        () => ({
          isCropping: false
        }),
        action.element
      );

    case UPDATE_CROPPING_IMAGE:
      return updateEntity(
        state,
        () => ({
          frame: action.frame,
          imageFrame: action.imageFrame
        }),
        action.element
      );
    default:
      return state;
  }
};
