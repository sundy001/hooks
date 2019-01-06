import {
  START_CROPPING_IMAGE,
  STOP_CROPPING_IMAGE,
  UPDATE_CROPPING_IMAGE
} from "./actions";
import { updateEntity } from "../../../updateEntity";

export const elements = (state, action) => {
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

// TODO: move it somewhere image no loger need to rasie
export const raise = (state = [], action) => {
  switch (action.type) {
    default:
      return state;
  }
};
