import {
  Action,
  START_CROPPING_IMAGE,
  STOP_CROPPING_IMAGE,
  UPDATE_CROPPING_IMAGE
} from "./actions";
import { Reducer, EntityStore, updateEntities } from "../../../reducer";
import { ImageEntity } from "./type";

export const elements: Reducer<EntityStore<ImageEntity>, Action> = (
  state,
  action
) => {
  switch (action.type) {
    case START_CROPPING_IMAGE:
      return updateEntities(state, [{ id: action.element }], previousState => ({
        ...previousState,
        isCropping: true
      }));

    case STOP_CROPPING_IMAGE:
      return updateEntities(state, [{ id: action.element }], previousState => ({
        ...previousState,
        isCropping: false
      }));

    case UPDATE_CROPPING_IMAGE:
      return updateEntities(state, [{ id: action.element }], previousState => ({
        ...previousState,
        frame: action.frame,
        imageFrame: action.imageFrame
      }));
    default:
      return state;
  }
};
