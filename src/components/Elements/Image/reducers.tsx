import * as actions from "./actions";
import { updateEntity } from "../../../updateEntity";

export const elements = (state, action: actions.Action) => {
  switch (action.type) {
    case actions.START_CROPPING_IMAGE:
      return updateEntity(
        state,
        () => ({
          isCropping: true
        }),
        action.payload
      );

    case actions.STOP_CROPPING_IMAGE:
      return updateEntity(
        state,
        () => ({
          isCropping: false
        }),
        action.payload
      );

    case actions.UPDATE_CROPPING_IMAGE:
      return updateEntity(
        state,
        () => ({
          frame: action.payload.frame,
          imageFrame: action.payload.imageFrame
        }),
        action.payload.element
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
