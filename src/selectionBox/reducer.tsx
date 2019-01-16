import { Action, UPDATE_SELECTION_BOX, HIDE_SELECTION_BOX } from "./actions";
import { Reducer } from "../reducer";
import { State } from "./type";

export const reducer: Reducer<State, Action> = (
  state = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  action
) => {
  switch (action.type) {
    case UPDATE_SELECTION_BOX:
      return action.payload;
    case HIDE_SELECTION_BOX:
      return { x: 0, y: 0, width: 0, height: 0 };
    default:
      return state;
  }
};
