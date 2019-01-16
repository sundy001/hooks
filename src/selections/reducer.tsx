import { SET_SELECTIONS, CLEAR_SELECTIONS, Action } from "./actions";
import { Reducer } from "../reducer";
import { State } from "./type";

export const reducer: Reducer<State, Action> = (state = [], action) => {
  switch (action.type) {
    case SET_SELECTIONS:
      return action.payload;
    case CLEAR_SELECTIONS:
      return [];
    default:
      return state;
  }
};
