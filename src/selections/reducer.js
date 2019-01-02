import { SET_SELECTIONS, CLEAR_SELECTIONS } from "./actions";

export const reducer = (state = [], action) => {
  switch (action.type) {
    case SET_SELECTIONS:
      return action.selections;
    case CLEAR_SELECTIONS:
      return [];
    default:
      return state;
  }
};
