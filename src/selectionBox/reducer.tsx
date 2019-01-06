import { UPDATE_SELECTION_BOX, HIDE_SELECTION_BOX } from "./actions";

export const reducer = (
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
      return action.frame;
    case HIDE_SELECTION_BOX:
      return { x: 0, y: 0, width: 0, height: 0 };
    default:
      return state;
  }
};
